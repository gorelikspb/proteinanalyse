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

// Site header HTML (logo/banner linking to homepage)
// Automatically adjusts paths based on current directory
function getSiteHeader() {
    // Determine if we're in articles/ subdirectory
    const path = window.location.pathname;
    const isInArticles = path.includes('/articles/');
    const homePath = isInArticles ? '../index.html' : 'index.html';
    
    return `
        <div class="site-header">
            <a href="${homePath}" class="site-logo">
                <h1 style="margin: 0; font-size: 1.5em; color: #667eea;">Sequence Analysis</h1>
                <p style="margin: 5px 0 0 0; font-size: 0.9em; color: #7f8c8d;">Free DNA & Protein Analysis Tools</p>
            </a>
        </div>
    `;
}

// Navigation menu HTML
// Automatically adjusts paths based on current directory
function getNavigation() {
    // Determine if we're in articles/ subdirectory
    const path = window.location.pathname;
    const href = window.location.href;
    const isInArticles = path.includes('/articles/') || href.includes('/articles/');
    const prefix = isInArticles ? '../' : '';
    const articlesPath = isInArticles ? 'index.html' : 'articles/index.html';
    
    // Get current page filename - works for both file:// and http:// URLs
    let currentPage = '';
    if (path && path !== '/') {
        currentPage = path.split('/').pop() || '';
    } else if (href) {
        // For file:// URLs or root path, extract filename from href
        const match = href.match(/([^\/]+\.html)(?:\?|#|$)/);
        if (match) {
            currentPage = match[1];
        } else if (href.endsWith('/') || href.match(/\/$/) || path === '/') {
            // Root path means index.html
            currentPage = 'index.html';
        }
    }
    
    // Normalize: empty, root path, or 'index.html' means we're on homepage
    const currentPageClean = (currentPage === '' || currentPage === 'index.html' || !currentPage || path === '/') ? 'index.html' : currentPage;
    
    // Helper function to check if link is active
    const isActive = (pageName) => {
        const linkPage = pageName.replace(prefix, '').replace('../', '');
        // Special case: if we're on homepage and link is index.html
        if (currentPageClean === 'index.html' && linkPage === 'index.html') {
            return true;
        }
        return linkPage === currentPageClean;
    };
    
    return `
        <nav class="main-nav">
            <a href="${prefix}index.html" ${isActive('index.html') ? 'class="nav-active"' : ''} data-tooltip="Main sequence analysis tool. Enter DNA or protein sequences to analyze composition, molecular weight, and basic properties. Free online bioinformatics tool.">Sequence Analyzer</a>
            <a href="${prefix}comprehensive-analysis.html" ${isActive('comprehensive-analysis.html') ? 'class="nav-active"' : ''} data-tooltip="Comprehensive protein analysis with automated report generation. Analyze sequences, predict properties, expression systems, and generate detailed PDF reports for research.">Comprehensive Analysis (+PDF)</a>
            <a href="${prefix}ai-feasibility.html" ${isActive('ai-feasibility.html') ? 'class="nav-active"' : ''} data-tooltip="AI-powered protein expressibility prediction. Predict solubility, aggregation risks, transmembrane domains, and codon usage for E.coli expression systems.">AI Feasibility</a>
            <a href="${prefix}dna-gc-calculator.html" ${isActive('dna-gc-calculator.html') ? 'class="nav-active"' : ''} data-tooltip="Calculate GC content percentage of DNA sequences. GC content affects DNA stability, melting temperature, and is important for PCR primer design and molecular biology applications.">GC Calculator</a>
            <a href="${prefix}reverse-complement.html" ${isActive('reverse-complement.html') ? 'class="nav-active"' : ''} data-tooltip="Generate reverse complement of DNA sequences. Essential for primer design, finding complementary strands, and working with double-stranded DNA in molecular biology.">Reverse Complement</a>
            <a href="${prefix}orf-finder.html" ${isActive('orf-finder.html') ? 'class="nav-active"' : ''} data-tooltip="Find Open Reading Frames (ORFs) in DNA sequences. Identify potential protein-coding regions, start and stop codons, and translate ORFs to amino acid sequences.">ORF Finder</a>
            <a href="${prefix}protein-mw-calculator.html" ${isActive('protein-mw-calculator.html') ? 'class="nav-active"' : ''} data-tooltip="Calculate molecular weight of protein sequences. Uses monoisotopic masses for accurate protein mass determination, useful for mass spectrometry and protein analysis.">Protein MW</a>
            <a href="${prefix}sequence-translation.html" ${isActive('sequence-translation.html') ? 'class="nav-active"' : ''} data-tooltip="Translate DNA sequences to protein sequences using the standard genetic code. Convert nucleotide triplets (codons) to amino acids for protein sequence analysis.">DNA Translation</a>
            <div class="dropdown" onmouseenter="this.classList.add('active')" onmouseleave="this.classList.remove('active')">
                <a href="#" class="dropdown-btn" onclick="event.preventDefault(); return false;" data-tooltip="Additional bioinformatics tools including codon usage analysis, FASTA validation, RNA translation, and peptide calculations.">More Tools ▼</a>
                <div class="dropdown-content">
                    <a href="${prefix}codon-usage-calculator.html" ${isActive('codon-usage-calculator.html') ? 'class="nav-active"' : ''} data-tooltip="Analyze codon usage frequency in DNA sequences. Calculate Relative Synonymous Codon Usage (RSCU) values for optimizing gene expression in different organisms.">Codon Usage</a>
                    <a href="${prefix}fasta-validator.html" ${isActive('fasta-validator.html') ? 'class="nav-active"' : ''} data-tooltip="Validate FASTA format sequences. Check sequence format, identify errors, and ensure sequences are properly formatted for bioinformatics tools and databases.">FASTA Validator</a>
                    <a href="${prefix}rna-to-protein.html" ${isActive('rna-to-protein.html') ? 'class="nav-active"' : ''} data-tooltip="Translate RNA sequences to protein sequences. Convert mRNA codons to amino acids using the genetic code, essential for gene expression analysis.">RNA Translator</a>
                    <a href="${prefix}peptide-length-calculator.html" ${isActive('peptide-length-calculator.html') ? 'class="nav-active"' : ''} data-tooltip="Calculate peptide length and properties. Determine number of amino acids, molecular weight, and basic characteristics of peptide sequences.">Peptide Length</a>
                    <a href="${prefix}amino-acid-composition.html" ${isActive('amino-acid-composition.html') ? 'class="nav-active"' : ''} data-tooltip="Analyze amino acid composition of protein sequences. Calculate percentage and count of each amino acid type for protein characterization and analysis.">AA Composition</a>
                </div>
            </div>
            <a href="${articlesPath}" ${isInArticles ? 'class="nav-active"' : ''} data-tooltip="Guides and tutorials for using sequence analysis tools. Learn about DNA and protein analysis, bioinformatics methods, and best practices for sequence analysis.">Guides</a>
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

// Kyte-Doolittle hydrophobicity scale (for signal peptide and TM prediction)
const KD_HYDROPHOBICITY = {
    'A': 1.8, 'C': 2.5, 'D': -3.5, 'E': -3.5,
    'F': 2.8, 'G': -0.4, 'H': -3.2, 'I': 4.5,
    'K': -3.9, 'L': 3.8, 'M': 1.9, 'N': -3.5,
    'P': -1.6, 'Q': -3.5, 'R': -4.5, 'S': -0.8,
    'T': -0.7, 'V': 4.2, 'W': -0.9, 'Y': -1.3
};

// Amino acid pKa values (for isoelectric point calculation)
const AA_PKA = {
    // N-terminal
    'N_TERM': 9.69,
    // C-terminal
    'C_TERM': 2.34,
    // Side chains
    'D': 3.86, 'E': 4.25, 'H': 6.0, 'C': 8.33,
    'Y': 10.07, 'K': 10.53, 'R': 12.48
};

/**
 * Predict signal peptide in protein sequence
 * Returns: {hasSignalPeptide: bool, cleavageSite: int, probability: float, hydrophobicStretch: int}
 */
function predictSignalPeptide(sequence) {
    const cleaned = cleanSequence(sequence);
    if (cleaned.length < 25) {
        return { hasSignalPeptide: false, cleavageSite: null, probability: 0, hydrophobicStretch: 0 };
    }
    
    const nTerm = cleaned.substr(0, 25);
    
    // Check for stretch of ≥7 hydrophobic aa
    let maxHydrophobicStretch = 0;
    let currentStretch = 0;
    
    for (let i = 0; i < nTerm.length; i++) {
        const aa = nTerm[i];
        const isHydrophobic = KD_HYDROPHOBICITY[aa] > 0;
        
        if (isHydrophobic) {
            currentStretch++;
            maxHydrophobicStretch = Math.max(maxHydrophobicStretch, currentStretch);
        } else {
            currentStretch = 0;
        }
    }
    
    const hasHydrophobicStretch = maxHydrophobicStretch >= 7;
    
    // Check for cleavage site pattern (X-A/G/S/T) around position 15-25
    let cleavageSite = null;
    for (let i = 15; i < Math.min(25, cleaned.length - 1); i++) {
        const pattern = cleaned.substr(i, 2);
        if (/[ACDEFGHIKLMNPQRSTVWY][AGST]/i.test(pattern)) {
            cleavageSite = i + 1; // 1-based position
            break;
        }
    }
    
    const hasCleavageSite = cleavageSite !== null;
    const detected = hasHydrophobicStretch && hasCleavageSite;
    
    // Calculate probability (simplified heuristic)
    let probability = 0;
    if (hasHydrophobicStretch) probability += 0.4;
    if (hasCleavageSite) probability += 0.4;
    if (maxHydrophobicStretch >= 10) probability += 0.2;
    
    return {
        hasSignalPeptide: detected,
        cleavageSite: cleavageSite,
        probability: Math.min(probability, 0.95),
        hydrophobicStretch: maxHydrophobicStretch
    };
}

/**
 * Predict transmembrane domains
 * Returns: [{start: int, end: int, topology: string, hydrophobicity: float}, ...]
 */
function predictTransmembraneDomains(sequence, windowSize = 19) {
    const cleaned = cleanSequence(sequence);
    const segments = [];
    
    for (let i = 0; i <= cleaned.length - windowSize; i++) {
        const window = cleaned.substr(i, windowSize);
        let sum = 0;
        let count = 0;
        
        for (const aa of window) {
            if (KD_HYDROPHOBICITY.hasOwnProperty(aa)) {
                sum += KD_HYDROPHOBICITY[aa];
                count++;
            }
        }
        
        const meanHydro = count > 0 ? sum / count : 0;
        
        // Threshold for transmembrane domain (typically > 1.8)
        if (meanHydro > 1.8) {
            segments.push({
                start: i + 1, // 1-based
                end: i + windowSize,
                topology: 'transmembrane',
                hydrophobicity: parseFloat(meanHydro.toFixed(2))
            });
        }
    }
    
    // Merge overlapping segments
    const merged = [];
    if (segments.length > 0) {
        let current = segments[0];
        for (let i = 1; i < segments.length; i++) {
            if (segments[i].start <= current.end) {
                current.end = Math.max(current.end, segments[i].end);
            } else {
                merged.push(current);
                current = segments[i];
            }
        }
        merged.push(current);
    }
    
    return merged;
}

/**
 * Find protease cleavage sites
 * Returns: {tev: [{position: int, sequence: string}], trypsin: [{position: int, sequence: string}], ...}
 */
function findProteaseSites(sequence) {
    const cleaned = cleanSequence(sequence);
    const sites = {
        tev: [],
        trypsin: [],
        chymotrypsin: []
    };
    
    // TEV protease site: ENLYFQG (cleaves after Q)
    const tevPattern = /ENLYFQG/gi;
    let match;
    while ((match = tevPattern.exec(cleaned)) !== null) {
        sites.tev.push({
            position: match.index + 1, // 1-based
            sequence: match[0],
            cleavagePosition: match.index + 7 // After Q
        });
    }
    
    // Trypsin sites: K or R (except if followed by P)
    for (let i = 0; i < cleaned.length; i++) {
        const aa = cleaned[i];
        if ((aa === 'K' || aa === 'R') && (i + 1 >= cleaned.length || cleaned[i + 1] !== 'P')) {
            sites.trypsin.push({
                position: i + 1, // 1-based
                sequence: cleaned.substr(Math.max(0, i - 2), 5),
                cleavagePosition: i + 1
            });
        }
    }
    
    // Chymotrypsin sites: F, Y, W, L (except if followed by P)
    const chymotrypsinAAs = ['F', 'Y', 'W', 'L'];
    for (let i = 0; i < cleaned.length; i++) {
        const aa = cleaned[i];
        if (chymotrypsinAAs.includes(aa) && (i + 1 >= cleaned.length || cleaned[i + 1] !== 'P')) {
            sites.chymotrypsin.push({
                position: i + 1, // 1-based
                sequence: cleaned.substr(Math.max(0, i - 2), 5),
                cleavagePosition: i + 1
            });
        }
    }
    
    return sites;
}

/**
 * Predict disulfide bonds
 * Returns: {cysCount: int, possibleBonds: [{cys1: int, cys2: int, distance: int}], pairs: int}
 */
function predictDisulfideBonds(sequence) {
    const cleaned = cleanSequence(sequence);
    const cysPositions = [];
    
    // Find all Cys positions
    for (let i = 0; i < cleaned.length; i++) {
        if (cleaned[i] === 'C') {
            cysPositions.push(i + 1); // 1-based
        }
    }
    
    const cysCount = cysPositions.length;
    const possibleBonds = [];
    
    // Predict possible disulfide bonds (Cys pairs with distance > 5 residues)
    // Simple heuristic: pairs are more likely if distance is reasonable (5-200 residues)
    for (let i = 0; i < cysPositions.length; i++) {
        for (let j = i + 1; j < cysPositions.length; j++) {
            const distance = Math.abs(cysPositions[j] - cysPositions[i]);
            if (distance >= 5 && distance <= 200) {
                possibleBonds.push({
                    cys1: cysPositions[i],
                    cys2: cysPositions[j],
                    distance: distance
                });
            }
        }
    }
    
    // Estimate number of pairs (even number of Cys = all paired, odd = one unpaired)
    const pairs = Math.floor(cysCount / 2);
    
    return {
        cysCount: cysCount,
        possibleBonds: possibleBonds,
        pairs: pairs,
        unpaired: cysCount % 2
    };
}

/**
 * Find N-glycosylation sites (N-X-S/T pattern, where X is not P)
 * Returns: [{position: int, sequence: string, accessible: bool}, ...]
 */
function findNGlycosylationSites(sequence) {
    const cleaned = cleanSequence(sequence);
    const sites = [];
    
    // N-glycosylation pattern: N-X-S/T (where X is any amino acid except P)
    const pattern = /N[ACDEFGHIKLMNQRSTVWY][ST]/gi;
    let match;
    
    while ((match = pattern.exec(cleaned)) !== null) {
        const position = match.index + 1; // 1-based
        const siteSequence = match[0];
        const middleAA = siteSequence[1];
        
        // Check accessibility (simplified: not in very hydrophobic region)
        const contextStart = Math.max(0, match.index - 5);
        const contextEnd = Math.min(cleaned.length, match.index + 8);
        const context = cleaned.substr(contextStart, contextEnd - contextStart);
        
        let hydrophobicCount = 0;
        for (const aa of context) {
            if (KD_HYDROPHOBICITY[aa] > 1.0) {
                hydrophobicCount++;
            }
        }
        
        const accessible = hydrophobicCount / context.length < 0.5; // Less than 50% hydrophobic
        
        sites.push({
            position: position,
            sequence: siteSequence,
            accessible: accessible,
            middleAA: middleAA
        });
    }
    
    return sites;
}

/**
 * Calculate isoelectric point (pI) of protein
 * Uses simplified algorithm based on charged amino acids
 * Returns: pI value (float)
 */
function calculateIsoelectricPoint(sequence) {
    const cleaned = cleanSequence(sequence);
    
    // Count charged amino acids
    let posCharge = 0; // K, R, H (at pH < pKa)
    let negCharge = 0; // D, E (at pH > pKa)
    
    for (const aa of cleaned) {
        if (aa === 'K') posCharge++;
        else if (aa === 'R') posCharge++;
        else if (aa === 'H') posCharge++;
        else if (aa === 'D') negCharge++;
        else if (aa === 'E') negCharge++;
    }
    
    // Add terminal charges
    posCharge += 1; // N-terminal
    negCharge += 1; // C-terminal
    
    // Binary search for pI (where net charge = 0)
    let low = 2.0;
    let high = 12.0;
    let pI = 7.0;
    
    for (let iter = 0; iter < 50; iter++) {
        pI = (low + high) / 2;
        
        // Calculate net charge at this pH
        let netCharge = 0;
        
        // N-terminal (pKa = 9.69)
        netCharge += 1 / (1 + Math.pow(10, pI - 9.69));
        
        // C-terminal (pKa = 2.34)
        netCharge -= 1 / (1 + Math.pow(10, 2.34 - pI));
        
        // Count charged residues
        for (const aa of cleaned) {
            if (aa === 'K') {
                netCharge += 1 / (1 + Math.pow(10, pI - 10.53));
            } else if (aa === 'R') {
                netCharge += 1 / (1 + Math.pow(10, pI - 12.48));
            } else if (aa === 'H') {
                netCharge += 1 / (1 + Math.pow(10, pI - 6.0));
            } else if (aa === 'D') {
                netCharge -= 1 / (1 + Math.pow(10, 3.86 - pI));
            } else if (aa === 'E') {
                netCharge -= 1 / (1 + Math.pow(10, 4.25 - pI));
            } else if (aa === 'C') {
                netCharge += 1 / (1 + Math.pow(10, pI - 8.33));
            } else if (aa === 'Y') {
                netCharge -= 1 / (1 + Math.pow(10, 10.07 - pI));
            }
        }
        
        if (Math.abs(netCharge) < 0.001) {
            break;
        } else if (netCharge > 0) {
            low = pI;
        } else {
            high = pI;
        }
    }
    
    return parseFloat(pI.toFixed(2));
}

// Auto-initialize site header and navigation on page load
// This will automatically add the header to any page that has <div id="site-header"></div>
// Tooltip functionality for mobile devices and desktop hover (works for navigation and buttons)
function initTooltips() {
    const tooltipElements = document.querySelectorAll('[data-tooltip]');
    
    tooltipElements.forEach(element => {
        // Skip active navigation links
        if (element.classList.contains('nav-active')) {
            return;
        }
        
        // For desktop hover with delay
        let hoverTimeout;
        let hideTimeout;
        
        element.addEventListener('mouseenter', function() {
            // Clear any pending hide timeout
            clearTimeout(hideTimeout);
            
            // Show tooltip after 400ms delay
            hoverTimeout = setTimeout(() => {
                // Remove hover class from other elements
                tooltipElements.forEach(el => el.classList.remove('tooltip-hover'));
                // Add hover class to current element
                this.classList.add('tooltip-hover');
            }, 400);
        });
        
        element.addEventListener('mouseleave', function() {
            // Clear pending show timeout
            clearTimeout(hoverTimeout);
            
            // Hide tooltip immediately
            this.classList.remove('tooltip-hover');
        });
        
        // For touch devices
        let touchTimeout;
        
        element.addEventListener('touchstart', function(e) {
            e.preventDefault();
            // Remove active class from other elements
            tooltipElements.forEach(el => {
                el.classList.remove('tooltip-active');
                el.classList.remove('tooltip-hover');
            });
            // Add active class to current element
            this.classList.add('tooltip-active');
            
            // Hide tooltip after 3 seconds
            clearTimeout(touchTimeout);
            touchTimeout = setTimeout(() => {
                this.classList.remove('tooltip-active');
            }, 3000);
        });
        
        // Hide tooltip when element is clicked (for navigation links)
        element.addEventListener('click', function() {
            // Small delay to allow navigation
            setTimeout(() => {
                this.classList.remove('tooltip-active');
                this.classList.remove('tooltip-hover');
            }, 100);
        });
        
        // Hide tooltip when clicking outside
        document.addEventListener('touchstart', function(e) {
            if (!element.contains(e.target)) {
                element.classList.remove('tooltip-active');
                element.classList.remove('tooltip-hover');
            }
        });
    });
}

document.addEventListener('DOMContentLoaded', function() {
    const siteHeader = document.getElementById('site-header');
    if (siteHeader) {
        siteHeader.innerHTML = getSiteHeader();
    }
    
    const navigation = document.getElementById('navigation');
    if (navigation && typeof getNavigation === 'function') {
        navigation.innerHTML = getNavigation();
        // Initialize tooltips after navigation is rendered
        initTooltips();
    } else {
        // Initialize tooltips even if navigation wasn't found
        initTooltips();
    }
});

