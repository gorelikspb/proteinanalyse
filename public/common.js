// Common functions for all sequence analysis pages

// Amino acid molecular weights (monoisotopic)
const AA_WEIGHTS = {
    'A': 71.03711, 'C': 103.00919, 'D': 115.02694, 'E': 129.04259,
    'F': 147.06841, 'G': 57.02146, 'H': 137.05891, 'I': 113.08406,
    'K': 128.09496, 'L': 113.08406, 'M': 131.04049, 'N': 114.04293,
    'P': 97.05276, 'Q': 128.05858, 'R': 156.10111, 'S': 87.03203,
    'T': 101.04768, 'V': 99.06841, 'W': 186.07931, 'Y': 163.06333
};

// Genetic code
const GENETIC_CODE = {
    'TTT': 'F', 'TTC': 'F', 'TTA': 'L', 'TTG': 'L',
    'TCT': 'S', 'TCC': 'S', 'TCA': 'S', 'TCG': 'S',
    'TAT': 'Y', 'TAC': 'Y', 'TAA': '*', 'TAG': '*',
    'TGT': 'C', 'TGC': 'C', 'TGA': '*', 'TGG': 'W',
    'CTT': 'L', 'CTC': 'L', 'CTA': 'L', 'CTG': 'L',
    'CCT': 'P', 'CCC': 'P', 'CCA': 'P', 'CCG': 'P',
    'CAT': 'H', 'CAC': 'H', 'CAA': 'Q', 'CAG': 'Q',
    'CGT': 'R', 'CGC': 'R', 'CGA': 'R', 'CGG': 'R',
    'ATT': 'I', 'ATC': 'I', 'ATA': 'I', 'ATG': 'M',
    'ACT': 'T', 'ACC': 'T', 'ACA': 'T', 'ACG': 'T',
    'AAT': 'N', 'AAC': 'N', 'AAA': 'K', 'AAG': 'K',
    'AGT': 'S', 'AGC': 'S', 'AGA': 'R', 'AGG': 'R',
    'GTT': 'V', 'GTC': 'V', 'GTA': 'V', 'GTG': 'V',
    'GCT': 'A', 'GCC': 'A', 'GCA': 'A', 'GCG': 'A',
    'GAT': 'D', 'GAC': 'D', 'GAA': 'E', 'GAG': 'E',
    'GGT': 'G', 'GGC': 'G', 'GGA': 'G', 'GGG': 'G'
};

// Hydrophobic amino acids
const HYDROPHOBIC_AAS = new Set(['A', 'V', 'I', 'L', 'M', 'F', 'W', 'P']);

// Navigation menu HTML
function getNavigation() {
    return `
        <nav class="main-nav">
            <a href="index.html">Sequence Analyzer</a>
            <a href="ai-feasibility.html">AI Feasibility</a>
            <a href="dna-gc-calculator.html">GC Calculator</a>
            <a href="reverse-complement.html">Reverse Complement</a>
            <a href="orf-finder.html">ORF Finder</a>
            <a href="protein-mw-calculator.html">Protein MW</a>
            <a href="sequence-translation.html">DNA Translation</a>
            <div class="dropdown" onmouseenter="this.classList.add('active')" onmouseleave="this.classList.remove('active')">
                <a href="#" class="dropdown-btn" onclick="event.preventDefault(); return false;">More Tools ▼</a>
                <div class="dropdown-content">
                    <a href="codon-usage-calculator.html">Codon Usage</a>
                    <a href="fasta-validator.html">FASTA Validator</a>
                    <a href="rna-to-protein.html">RNA Translator</a>
                    <a href="peptide-length-calculator.html">Peptide Length</a>
                    <a href="amino-acid-composition.html">AA Composition</a>
                </div>
            </div>
        </nav>
    `;
}

// Clean sequence - remove whitespace and convert to uppercase
function cleanSequence(seq) {
    return seq.replace(/\s+/g, '').toUpperCase();
}

// Preserve case while cleaning
function cleanSequencePreserveCase(seq) {
    return seq.replace(/\s+/g, '');
}

// Detect if sequence is DNA
function isDNA(seq) {
    return /^[ACGTN\s]+$/i.test(seq);
}

// Detect if sequence is protein
function isProtein(seq) {
    return /^[ACDEFGHIKLMNPQRSTVWY\s*]+$/i.test(seq);
}

// Compute GC content
function computeGC(seq) {
    const gc = (seq.match(/[GC]/gi) || []).length;
    return ((gc / seq.length) * 100).toFixed(2);
}

// Compute AT content
function computeAT(seq) {
    const at = (seq.match(/[AT]/gi) || []).length;
    return ((at / seq.length) * 100).toFixed(2);
}

// Reverse complement
function reverseComplement(seq, preserveCase = false) {
    const complement = {
        'A': 'T', 'T': 'A', 'G': 'C', 'C': 'G',
        'N': 'N', 'a': 't', 't': 'a', 'g': 'c', 'c': 'g', 'n': 'n'
    };
    
    const cleaned = preserveCase ? cleanSequencePreserveCase(seq) : cleanSequence(seq);
    return cleaned.split('').reverse().map(base => complement[base] || base).join('');
}

// Translate DNA to protein
function translateDNA(seq) {
    const cleaned = cleanSequence(seq);
    let protein = '';
    for (let i = 0; i < cleaned.length - 2; i += 3) {
        const codon = cleaned.substr(i, 3);
        const aa = GENETIC_CODE[codon] || 'X';
        protein += aa;
    }
    return protein;
}

// Find longest ORF
function findORF(seq) {
    const cleaned = cleanSequence(seq);
    const startCodons = ['ATG'];
    const stopCodons = ['TAA', 'TAG', 'TGA'];
    
    let longestORF = { start: -1, end: -1, length: 0, sequence: '', frame: 0 };
    
    for (let frame = 0; frame < 3; frame++) {
        for (let i = frame; i < cleaned.length - 2; i += 3) {
            const codon = cleaned.substr(i, 3);
            
            if (startCodons.includes(codon)) {
                for (let j = i + 3; j < cleaned.length - 2; j += 3) {
                    const stopCodon = cleaned.substr(j, 3);
                    if (stopCodons.includes(stopCodon)) {
                        const orfLength = j + 3 - i;
                        if (orfLength > longestORF.length) {
                            longestORF = {
                                start: i,
                                end: j + 3,
                                length: orfLength,
                                sequence: cleaned.substr(i, orfLength),
                                frame: frame + 1
                            };
                        }
                        break;
                    }
                }
            }
        }
    }
    
    return longestORF.length > 0 ? longestORF : null;
}

// Compute molecular weight
function computeMW(seq) {
    const cleaned = cleanSequence(seq);
    let mw = 18.01528; // Water molecule
    
    for (const aa of cleaned) {
        if (AA_WEIGHTS[aa]) {
            mw += AA_WEIGHTS[aa];
        }
    }
    
    return mw.toFixed(2);
}

// Compute amino acid composition
function computeAAComposition(seq) {
    const cleaned = cleanSequence(seq);
    const composition = {};
    const validAAs = 'ACDEFGHIKLMNPQRSTVWY';
    
    for (const aa of validAAs) {
        composition[aa] = 0;
    }
    
    for (const aa of cleaned) {
        if (validAAs.includes(aa)) {
            composition[aa] = (composition[aa] || 0) + 1;
        }
    }
    
    const percentages = {};
    for (const [aa, count] of Object.entries(composition)) {
        percentages[aa] = ((count / cleaned.length) * 100).toFixed(2);
    }
    
    return { counts: composition, percentages };
}

// Compute hydrophobic percentage
function computeHydrophobicPercent(seq) {
    const cleaned = cleanSequence(seq);
    const hydrophobic = Array.from(cleaned).filter(aa => HYDROPHOBIC_AAS.has(aa)).length;
    return ((hydrophobic / cleaned.length) * 100).toFixed(2);
}

// Format sequence with line breaks
function formatSequence(seq, lineLength = 60) {
    if (!seq) return '';
    const lines = [];
    for (let i = 0; i < seq.length; i += lineLength) {
        lines.push(seq.substr(i, lineLength));
    }
    return lines.join('<br>');
}

// Display last update time
function updateLastUpdateTime() {
    const now = new Date();
    const options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit',
        timeZoneName: 'short'
    };
    const formattedDate = now.toLocaleString('en-US', options);
    const updateElement = document.getElementById('last-update');
    if (updateElement) {
        updateElement.textContent = formattedDate;
    }
}

