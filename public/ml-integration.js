/**
 * Client-side ML API integration
 * Handles communication with backend ML services
 */

const ML_API_BASE = '/api'; // Will be configured based on deployment

/**
 * Get ML predictions for a protein sequence
 * @param {string} sequence - Protein or DNA sequence
 * @param {string} type - Type of prediction (solubility, structure, etc.)
 * @returns {Promise<Object>} Prediction results
 */
async function getMLPredictions(sequence, type = 'all') {
  try {
    const response = await fetch(`${ML_API_BASE}/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sequence: sequence,
        analysisType: 'ml_predictions',
        predictionType: type,
      }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('ML prediction error:', error);
    return {
      success: false,
      error: error.message,
      message: 'ML predictions temporarily unavailable',
    };
  }
}

/**
 * Lookup sequence in protein databases
 * @param {string} sequence - Protein sequence
 * @param {string} database - Database name (uniprot, pdb, ncbi)
 * @returns {Promise<Object>} Database lookup results
 */
async function databaseLookup(sequence, database = 'uniprot') {
  try {
    const response = await fetch(`${ML_API_BASE}/database-lookup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sequence: sequence,
        database: database,
        action: 'blast',
      }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Database lookup error:', error);
    return {
      success: false,
      error: error.message,
      message: 'Database lookup temporarily unavailable',
    };
  }
}

/**
 * Compare sequence with benchmark proteins
 * @param {string} sequence - Protein sequence
 * @returns {Promise<Object>} Comparison results
 */
async function compareWithBenchmarks(sequence) {
  try {
    const response = await fetch(`${ML_API_BASE}/benchmark?action=compare&sequence=${encodeURIComponent(sequence)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Benchmark comparison error:', error);
    return {
      success: false,
      error: error.message,
      message: 'Benchmark comparison temporarily unavailable',
    };
  }
}

/**
 * Check if ML API is available
 * @returns {Promise<boolean>} True if API is available
 */
async function checkAPIAvailability() {
  try {
    const response = await fetch(`${ML_API_BASE}/analyze`, {
      method: 'GET',
    });
    return response.ok;
  } catch (error) {
    return false;
  }
}

// Export functions for use in other scripts
if (typeof window !== 'undefined') {
  window.MLIntegration = {
    getMLPredictions,
    databaseLookup,
    compareWithBenchmarks,
    checkAPIAvailability,
  };
}

// For Node.js environments
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    getMLPredictions,
    databaseLookup,
    compareWithBenchmarks,
    checkAPIAvailability,
  };
}








