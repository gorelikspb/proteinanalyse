/**
 * API endpoint for benchmark protein data
 * Provides access to benchmark proteins with experimental data
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
    try {
      const url = new URL(request.url);
      const action = url.searchParams.get('action') || 'list';

      switch (action) {
        case 'list':
          return handleListBenchmarks(env, corsHeaders);
        case 'get':
          const id = url.searchParams.get('id');
          return handleGetBenchmark(id, env, corsHeaders);
        case 'compare':
          const sequence = url.searchParams.get('sequence');
          return handleCompare(sequence, env, corsHeaders);
        default:
          return new Response(
            JSON.stringify({ error: 'Unknown action' }),
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

  if (request.method === 'POST') {
    try {
      const data = await request.json();
      const { sequence, properties } = data;
      return handleAddBenchmark(sequence, properties, env, corsHeaders);
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
 * List all benchmark proteins
 */
async function handleListBenchmarks(env, corsHeaders) {
  // TODO: Query D1 database
  // For now, return placeholder data
  return new Response(
    JSON.stringify({
      success: true,
      benchmarks: [],
      message: 'D1 database integration pending',
    }),
    {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    }
  );
}

/**
 * Get specific benchmark by ID
 */
async function handleGetBenchmark(id, env, corsHeaders) {
  if (!id) {
    return new Response(
      JSON.stringify({ error: 'Benchmark ID required' }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }

  // TODO: Query D1 database for benchmark with ID
  return new Response(
    JSON.stringify({
      success: true,
      benchmark: null,
      message: 'D1 database integration pending',
    }),
    {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    }
  );
}

/**
 * Compare sequence with benchmarks
 */
async function handleCompare(sequence, env, corsHeaders) {
  if (!sequence) {
    return new Response(
      JSON.stringify({ error: 'Sequence required' }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }

  // TODO: Compare sequence properties with benchmark data
  return new Response(
    JSON.stringify({
      success: true,
      comparisons: [],
      message: 'Comparison logic pending',
    }),
    {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    }
  );
}

/**
 * Add new benchmark (admin function)
 */
async function handleAddBenchmark(sequence, properties, env, corsHeaders) {
  // TODO: Insert into D1 database
  // Validate input
  // Return success
  return new Response(
    JSON.stringify({
      success: true,
      message: 'Benchmark addition - D1 integration pending',
    }),
    {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    }
  );
}
