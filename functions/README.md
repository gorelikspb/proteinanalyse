# Cloudflare Functions API

This directory contains Cloudflare Workers functions for the proteinanalyse platform.

## Structure

```
functions/
├── api/
│   ├── analyze.js           # Main analysis API endpoint
│   ├── benchmark.js          # Benchmark comparison API
│   └── database-lookup.js   # Database integration (UniProt, PDB, NCBI)
└── README.md                 # This file
```

## API Endpoints

### `/api/analyze`
Main endpoint for sequence analysis with ML integration.

**POST** `/api/analyze`
- Body: `{ sequence: string, analysisType: string }`
- Analysis types: `ml_predictions`, `database_lookup`, `benchmark_comparison`

**GET** `/api/analyze`
- Health check and API info

### `/api/benchmark`
Benchmark protein data access.

**GET** `/api/benchmark?action=list`
- List all benchmark proteins

**GET** `/api/benchmark?action=get&id=<id>`
- Get specific benchmark by ID

**GET** `/api/benchmark?action=compare&sequence=<seq>`
- Compare sequence with benchmarks

**POST** `/api/benchmark`
- Add new benchmark (admin)

### `/api/database-lookup`
Database integration endpoint for protein databases.

**POST** `/api/database-lookup`
- Body: `{ sequence: string, database: string, action: string }`
- Databases: `uniprot`, `pdb`, `ncbi`
- Actions:
  - `blast` - BLAST search (for UniProt, uses EBI BLAST API or fallback)
  - `id` or `search` - Lookup by UniProt ID or text search
- **Note**: UniProt REST API does not support direct sequence BLAST. The endpoint uses:
  - EBI BLAST API (async, returns job ID)
  - Fallback text search by sequence length
  - Direct UniProt ID lookup (recommended)

**Example - UniProt ID lookup:**
```json
{
  "sequence": "P12345",
  "database": "uniprot",
  "action": "id"
}
```

**Example - Sequence search (fallback):**
```json
{
  "sequence": "MKTAYIAKQRQISFVK...",
  "database": "uniprot",
  "action": "blast"
}
```

## Setup

1. Install Wrangler CLI: `npm install -g wrangler`
2. Login: `wrangler login`
3. Create D1 database: `wrangler d1 create protein-benchmarks`
4. Update `wrangler.toml` with database ID
5. Set secrets: `wrangler secret put RESEND_API_KEY`
6. Deploy: `wrangler deploy`

## D1 Database Schema (to be created)

```sql
CREATE TABLE benchmarks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  sequence TEXT NOT NULL,
  uniprot_id TEXT,
  expressibility_score REAL,
  solubility REAL,
  thermostability REAL,
  experimental_data JSON,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_uniprot_id ON benchmarks(uniprot_id);
```

## Current Integrations

- **UniProt API**: 
  - ✅ ID lookup (direct)
  - ✅ Text search (by length/characteristics)
  - ⚠️ BLAST search (uses EBI BLAST API, async - returns job ID)
  - **Limitation**: UniProt REST API doesn't support direct sequence BLAST
- **PDB API**: Placeholder (implementation pending)
- **NCBI API**: Placeholder (implementation pending)

## Future Integrations

- ESM API for protein property prediction
- AlphaFold API for structure prediction
- NCBI BLAST API for sequence similarity search
- PDB API for structure data
- EBI BLAST async job polling implementation







