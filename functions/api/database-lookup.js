/**
 * API endpoint for database lookups (UniProt, PDB, NCBI)
 * Provides integration with protein databases
 */

export async function onRequest(context) {
  const { request, env } = context;
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (request.method === 'GET') {
    // Health check endpoint
    return new Response(
      JSON.stringify({
        success: true,
        message: 'Database Lookup API is running',
        endpoints: {
          uniprot: 'POST /api/database-lookup with { sequence, database: "uniprot", action: "id|blast|search" }',
          pdb: 'POST /api/database-lookup with { sequence, database: "pdb", action: "..." }',
          ncbi: 'POST /api/database-lookup with { sequence, database: "ncbi", action: "..." }',
        },
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }

  if (request.method === 'POST') {
    try {
      const data = await request.json();
      const { sequence, database, action } = data;

      if (!sequence) {
        return new Response(
          JSON.stringify({ error: 'Sequence is required' }),
          {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }

      switch (database) {
        case 'uniprot':
          return handleUniProtLookup(sequence, action, env, corsHeaders);
        case 'pdb':
          return handlePDBLookup(sequence, action, env, corsHeaders);
        case 'ncbi':
          return handleNCBILookup(sequence, action, env, corsHeaders);
        default:
          return new Response(
            JSON.stringify({ error: 'Unknown database. Use: uniprot, pdb, or ncbi' }),
            {
              status: 400,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            }
          );
      }
    } catch (error) {
      return new Response(
        JSON.stringify({ error: error.message }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }
  }

  return new Response('Method not allowed', {
    status: 405,
    headers: corsHeaders,
  });
}

/**
 * Handle UniProt database lookups
 * UniProt REST API: https://www.uniprot.org/help/api
 */
async function handleUniProtLookup(sequence, action, env, corsHeaders) {
  try {
    const uniprotBaseUrl = 'https://rest.uniprot.org';

    switch (action) {
      case 'blast':
        // BLAST search for homologs (uses EBI BLAST API or fallback)
        return await uniprotBlast(sequence, uniprotBaseUrl, corsHeaders);
      
      case 'search':
      case 'id':
        // Lookup by UniProt ID (if sequence looks like an ID)
        if (/^[A-Z0-9_-]+$/i.test(sequence) && sequence.length < 20) {
          return await uniprotIdLookup(sequence, uniprotBaseUrl, corsHeaders);
        }
        // Otherwise treat as text search
        return await uniprotTextSearch(sequence, uniprotBaseUrl, corsHeaders);
      
      default:
        // Default: Try BLAST if sequence is long, otherwise text search
        if (sequence.length > 50) {
          return await uniprotBlast(sequence, uniprotBaseUrl, corsHeaders);
        } else {
          return await uniprotTextSearch(sequence, uniprotBaseUrl, corsHeaders);
        }
    }
  } catch (error) {
    return new Response(
      JSON.stringify({ error: `UniProt lookup failed: ${error.message}` }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
}

/**
 * Perform BLAST search against UniProt using EBI BLAST API
 * Note: UniProt REST API doesn't support BLAST directly
 * We use EBI BLAST API which can search against UniProtKB
 */
async function uniprotBlast(sequence, baseUrl, corsHeaders) {
  try {
    // EBI BLAST API endpoint for UniProtKB
    // This is an asynchronous API - we submit a job and poll for results
    const ebiBlastUrl = 'https://www.ebi.ac.uk/Tools/services/rest/ncbiblast/run';
    
    // Prepare FASTA format sequence
    const fastaSequence = `>query\n${sequence}`;
    
    // Submit BLAST job
    const formData = new URLSearchParams();
    formData.append('email', 'noreply@example.com'); // Required by EBI API
    formData.append('program', 'blastp'); // Protein BLAST
    formData.append('database', 'uniprotkb'); // UniProtKB database
    formData.append('sequence', fastaSequence);
    formData.append('stype', 'protein');
    formData.append('matrix', 'BLOSUM62');
    formData.append('alignments', '10');
    formData.append('scores', '10');
    formData.append('exp', '1e-5');
    
    const submitResponse = await fetch(ebiBlastUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
    });

    if (!submitResponse.ok) {
      throw new Error(`EBI BLAST API error: ${submitResponse.status}`);
    }

    const jobId = await submitResponse.text();
    
    // Poll for results (simplified - in production should handle async properly)
    // For now, return job ID and instructions
    return new Response(
      JSON.stringify({
        success: true,
        database: 'uniprot',
        queryLength: sequence.length,
        message: 'BLAST search submitted. UniProt BLAST requires asynchronous processing.',
        note: 'For immediate results, use UniProt web interface or implement async job polling.',
        jobId: jobId.trim(),
        results: [],
        totalResults: 0,
        alternative: 'Use UniProt ID lookup or text search instead of sequence BLAST',
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    // Fallback: try text-based search using sequence characteristics
    return await uniprotTextSearch(sequence, baseUrl, corsHeaders);
  }
}

/**
 * Fallback: Text-based search in UniProt
 * Searches by sequence length and amino acid composition characteristics
 */
async function uniprotTextSearch(sequence, baseUrl, corsHeaders) {
  try {
    // Search by sequence length as approximation
    const length = sequence.length;
    const query = `length:${length - 10}-${length + 10}`;
    
    const searchUrl = `${baseUrl}/uniprotkb/search?query=${encodeURIComponent(query)}&format=json&size=10&sort=score`;
    
    const response = await fetch(searchUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`UniProt API error: ${response.status}`);
    }

    const data = await response.json();
    
    // Extract relevant information
    const results = (data.results || []).map(result => ({
      uniprotId: result.primaryAccession,
      name: result.uniProtkbId,
      proteinName: result.proteinDescription?.recommendedName?.fullName?.value || 'Unknown',
      organism: result.organism?.scientificName || 'Unknown',
      length: result.sequence?.length || 0,
      score: result.score || 0,
      note: 'Approximate match by length - use UniProt ID for exact lookup',
    }));

    return new Response(
      JSON.stringify({
        success: true,
        database: 'uniprot',
        queryLength: sequence.length,
        results: results,
        totalResults: data.totalResults || 0,
        note: 'Results are approximate matches by sequence length. For exact BLAST search, use UniProt web interface.',
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
        message: 'UniProt lookup failed. UniProt REST API does not support direct sequence BLAST. Use UniProt web interface or provide UniProt ID for lookup.',
        suggestion: 'For sequence similarity search, use: https://www.uniprot.org/blast/',
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
}

/**
 * Handle PDB database lookups
 * PDB REST API: https://www.rcsb.org/pages/webservices
 */
async function handlePDBLookup(sequence, action, env, corsHeaders) {
  // PDB API integration placeholder
  return new Response(
    JSON.stringify({
      success: true,
      database: 'pdb',
      message: 'PDB API integration - implementation pending',
      sequence: sequence.substring(0, 50) + '...',
    }),
    {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    }
  );
}

/**
 * Lookup UniProt entry by ID
 */
async function uniprotIdLookup(uniprotId, baseUrl, corsHeaders) {
  try {
    const lookupUrl = `${baseUrl}/uniprotkb/${uniprotId}.json`;
    
    const response = await fetch(lookupUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return new Response(
          JSON.stringify({
            success: false,
            error: 'UniProt ID not found',
            message: `No entry found for UniProt ID: ${uniprotId}`,
          }),
          {
            status: 404,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }
      throw new Error(`UniProt API error: ${response.status}`);
    }

    const data = await response.json();
    
    const result = {
      uniprotId: data.primaryAccession,
      name: data.uniProtkbId,
      proteinName: data.proteinDescription?.recommendedName?.fullName?.value || 'Unknown',
      organism: data.organism?.scientificName || 'Unknown',
      length: data.sequence?.length || 0,
      sequence: data.sequence?.value || '',
      geneNames: data.genes?.map(g => g.geneName?.value).filter(Boolean) || [],
      function: data.comments?.find(c => c.commentType === 'FUNCTION')?.texts?.[0]?.value || '',
    };

    return new Response(
      JSON.stringify({
        success: true,
        database: 'uniprot',
        results: [result],
        totalResults: 1,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
        message: 'UniProt ID lookup failed',
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
}

/**
 * Handle NCBI database lookups
 */
async function handleNCBILookup(sequence, action, env, corsHeaders) {
  // NCBI API integration placeholder
  return new Response(
    JSON.stringify({
      success: true,
      database: 'ncbi',
      message: 'NCBI API integration - implementation pending',
      sequence: sequence.substring(0, 50) + '...',
      note: 'NCBI BLAST API can be used for sequence similarity search',
    }),
    {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    }
  );
}







