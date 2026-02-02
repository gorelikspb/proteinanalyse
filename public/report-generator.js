/**
 * PDF Report Generator for Protein Analysis
 * Generates comprehensive PDF reports in POI Analysis style
 * Requires: jsPDF library (https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js)
 */

// Kyte-Doolittle hydrophobicity scale (needed for plots)
const KD_HYDROPHOBICITY = {
    'A': 1.8, 'C': 2.5, 'D': -3.5, 'E': -3.5,
    'F': 2.8, 'G': -0.4, 'H': -3.2, 'I': 4.5,
    'K': -3.9, 'L': 3.8, 'M': 1.9, 'N': -3.5,
    'P': -1.6, 'Q': -3.5, 'R': -4.5, 'S': -0.8,
    'T': -0.7, 'V': 4.2, 'W': -0.9, 'Y': -1.3
};

// Debug: Log script loading
if (typeof window !== 'undefined') {
    console.log('report-generator.js: Script loaded');
}

// Check if jsPDF is loaded (should be loaded before this script)
if (typeof window !== 'undefined' && typeof window.jspdf === 'undefined') {
    console.warn('report-generator.js: jsPDF library not found. It should be loaded before this script.');
}

/**
 * Generate comprehensive POI Analysis report
 * @param {Object} analysisResults - Results from comprehensive analysis
 * @param {Object} options - Report options
 * @returns {jsPDF} PDF document
 */
function generatePOIReport(analysisResults, options = {}) {
    const { jsPDF } = window.jspdf || {};
    if (!jsPDF) {
        throw new Error('jsPDF library not loaded. Please include jsPDF before calling this function.');
    }

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    let yPos = margin;

    // Cover Page
    addCoverPage(doc, analysisResults, pageWidth, pageHeight);
    doc.addPage();

    // Executive Summary
    yPos = addExecutiveSummary(doc, analysisResults, margin, pageWidth);
    if (yPos > pageHeight - 40) {
        doc.addPage();
        yPos = margin;
    }

    // Sequence Information
    yPos = addSequenceInfo(doc, analysisResults, margin, pageWidth, yPos);
    if (yPos > pageHeight - 40) {
        doc.addPage();
        yPos = margin;
    }

    // Structural Analysis
    yPos = addStructuralAnalysis(doc, analysisResults, margin, pageWidth, yPos);
    if (yPos > pageHeight - 40) {
        doc.addPage();
        yPos = margin;
    }

    // Expression Recommendations
    yPos = addExpressionRecommendations(doc, analysisResults, margin, pageWidth, yPos);
    if (yPos > pageHeight - 40) {
        doc.addPage();
        yPos = margin;
    }

    // Risk Assessment
    yPos = addRiskAssessment(doc, analysisResults, margin, pageWidth, yPos);
    if (yPos > pageHeight - 40) {
        doc.addPage();
        yPos = margin;
    }

    // Database Comparison
    if (analysisResults.databaseComparison) {
        yPos = addDatabaseComparison(doc, analysisResults, margin, pageWidth, yPos);
        if (yPos > pageHeight - 40) {
            doc.addPage();
            yPos = margin;
        }
    }

    // Detailed Tables
    yPos = addDetailedTables(doc, analysisResults, margin, pageWidth, yPos);
    if (yPos > pageHeight - 40) {
        doc.addPage();
        yPos = margin;
    }

    // Appendix
    addAppendix(doc, analysisResults, margin, pageWidth);

    return doc;
}

// Export function immediately after definition
window.generatePOIReport = generatePOIReport;

/**
 * Add cover page
 */
function addCoverPage(doc, results, pageWidth, pageHeight) {
    const centerX = pageWidth / 2;
    let yPos = pageHeight / 2 - 40;

    // Title
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('Protein Analysis Report', centerX, yPos, { align: 'center' });

    yPos += 20;
    doc.setFontSize(16);
    doc.setFont('helvetica', 'normal');
    doc.text(results.proteinName || 'Unknown Protein', centerX, yPos, { align: 'center' });

    if (results.uniprotId) {
        yPos += 15;
        doc.setFontSize(12);
        doc.text(`UniProt ID: ${results.uniprotId}`, centerX, yPos, { align: 'center' });
    }

    yPos += 30;
    doc.setFontSize(10);
    doc.text(`Analysis Date: ${results.analysisDate}`, centerX, yPos, { align: 'center' });
    yPos += 8;
    doc.text(`Report Version: ${results.analysisVersion || '1.0'}`, centerX, yPos, { align: 'center' });
}

/**
 * Add executive summary
 */
function addExecutiveSummary(doc, results, margin, pageWidth) {
    let yPos = margin;

    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Executive Summary', margin, yPos);
    yPos += 15;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    
    const summary = [
        `Sequence Length: ${results.sequenceLength} amino acids`,
        `Molecular Weight: ${results.molecularWeightKDa} kDa`,
        `Isoelectric Point: ${results.isoelectricPoint}`,
        `Hydrophobic Content: ${results.hydrophobicPercent}%`,
        `Signal Peptide: ${results.signalPeptide.hasSignalPeptide ? 'Yes' : 'No'}`,
        `Transmembrane Domains: ${results.transmembraneDomains.length}`,
        `Disulfide Bonds: ${results.disulfideBonds.pairs} pairs (${results.disulfideBonds.cysCount} Cys)`,
        `N-Glycosylation Sites: ${results.nGlycosylationSites.length}`
    ];

    // Key recommendations
    const recommendedSystems = Object.entries(results.expressionRecommendations)
        .filter(([_, rec]) => rec.recommended)
        .map(([system, _]) => system.charAt(0).toUpperCase() + system.slice(1));

    if (recommendedSystems.length > 0) {
        summary.push(`\nRecommended Expression Systems: ${recommendedSystems.join(', ')}`);
    }

    // Risks
    summary.push(`\nRisk Assessment:`);
    summary.push(`- Aggregation Risk: ${results.riskAssessment.aggregationRisk.toUpperCase()}`);
    summary.push(`- Solubility Risk: ${results.riskAssessment.solubilityRisk.toUpperCase()}`);
    summary.push(`- Expression Difficulty: ${results.riskAssessment.expressionDifficulty.toUpperCase()}`);

    const summaryText = summary.join('\n');
    const lines = doc.splitTextToSize(summaryText, pageWidth - 2 * margin);
    doc.text(lines, margin, yPos);
    yPos += lines.length * 6 + 10;

    return yPos;
}

/**
 * Add sequence information
 */
function addSequenceInfo(doc, results, margin, pageWidth, startY) {
    let yPos = startY;

    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Sequence Information', margin, yPos);
    yPos += 12;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');

    // Basic properties table
    const properties = [
        ['Property', 'Value'],
        ['Protein Name', results.proteinName || 'Unknown'],
        ['UniProt ID', results.uniprotId || 'N/A'],
        ['Sequence Length', `${results.sequenceLength} amino acids`],
        ['Molecular Weight', `${results.molecularWeightKDa} kDa`],
        ['Isoelectric Point (pI)', results.isoelectricPoint.toString()],
        ['Hydrophobic Percentage', `${results.hydrophobicPercent}%`]
    ];

    // Simple table drawing
    const colWidths = [80, pageWidth - margin - 100];
    let tableY = yPos;
    
    properties.forEach((row, i) => {
        if (tableY > doc.internal.pageSize.getHeight() - 30) {
            doc.addPage();
            tableY = margin;
        }
        
        doc.setFont('helvetica', i === 0 ? 'bold' : 'normal');
        doc.text(row[0], margin, tableY);
        doc.text(row[1], margin + colWidths[0] + 5, tableY);
        tableY += 8;
    });

    yPos = tableY + 10;

    // Amino acid composition (summary)
    doc.setFont('helvetica', 'bold');
    doc.text('Amino Acid Composition Summary', margin, yPos);
    yPos += 8;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    const aaCounts = results.aminoAcidComposition.counts;
    const aaList = Object.entries(aaCounts)
        .filter(([_, count]) => count > 0)
        .sort(([_, a], [__, b]) => b - a)
        .slice(0, 10)
        .map(([aa, count]) => `${aa}: ${count} (${results.aminoAcidComposition.percentages[aa]}%)`)
        .join(', ');

    const aaLines = doc.splitTextToSize(aaList, pageWidth - 2 * margin);
    doc.text(aaLines, margin, yPos);
    yPos += aaLines.length * 5 + 10;

    return yPos;
}

/**
 * Add hydrophobicity plot
 */
function addHydrophobicityPlot(doc, results, margin, pageWidth, startY) {
    let yPos = startY;
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('Hydrophobicity Profile', margin, yPos);
    yPos += 10;
    
    // Simple bar chart representation
    const seq = results.sequence;
    const plotWidth = pageWidth - 2 * margin;
    const plotHeight = 30;
    const plotX = margin;
    const plotY = yPos;
    
    // Draw axes
    doc.setDrawColor(0, 0, 0);
    doc.line(plotX, plotY + plotHeight, plotX + plotWidth, plotY + plotHeight); // X-axis
    doc.line(plotX, plotY, plotX, plotY + plotHeight); // Y-axis
    
    // Calculate hydrophobicity values (simplified - sample every 10th residue)
    const sampleRate = Math.max(1, Math.floor(seq.length / 50));
    const values = [];
    for (let i = 0; i < seq.length; i += sampleRate) {
        const aa = seq[i];
        values.push(KD_HYDROPHOBICITY[aa] || 0);
    }
    
    if (values.length > 0) {
        const maxVal = Math.max(...values.map(Math.abs));
        const barWidth = plotWidth / values.length;
        
        values.forEach((val, i) => {
            const barHeight = (val / maxVal) * plotHeight;
            const x = plotX + i * barWidth;
            const y = plotY + plotHeight - barHeight;
            
            // Color: positive = hydrophobic (blue), negative = hydrophilic (red)
            if (val > 0) {
                doc.setFillColor(0, 0, 200);
            } else {
                doc.setFillColor(200, 0, 0);
            }
            doc.rect(x, y, barWidth - 1, Math.abs(barHeight), 'F');
        });
    }
    
    // Labels
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 0, 0);
    doc.text('0', plotX - 5, plotY + plotHeight + 3);
    doc.text(seq.length.toString(), plotX + plotWidth - 10, plotY + plotHeight + 3);
    doc.text('Position', plotX + plotWidth / 2 - 15, plotY + plotHeight + 8);
    
    yPos += plotHeight + 20;
    return yPos;
}

/**
 * Add structural analysis section
 */
function addStructuralAnalysis(doc, results, margin, pageWidth, startY) {
    let yPos = startY;

    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Structural Analysis', margin, yPos);
    yPos += 12;
    
    // Add hydrophobicity plot
    yPos = addHydrophobicityPlot(doc, results, margin, pageWidth, yPos);
    if (yPos > doc.internal.pageSize.getHeight() - 40) {
        doc.addPage();
        yPos = margin;
    }

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');

    // Signal Peptide
    doc.setFont('helvetica', 'bold');
    doc.text('Signal Peptide', margin, yPos);
    yPos += 8;
    doc.setFont('helvetica', 'normal');
    doc.text(`Detected: ${results.signalPeptide.hasSignalPeptide ? 'Yes' : 'No'}`, margin + 5, yPos);
    if (results.signalPeptide.hasSignalPeptide) {
        yPos += 6;
        doc.text(`Cleavage Site: Position ${results.signalPeptide.cleavageSite || 'unknown'}`, margin + 5, yPos);
        yPos += 6;
        doc.text(`Probability: ${(results.signalPeptide.probability * 100).toFixed(1)}%`, margin + 5, yPos);
    }
    yPos += 10;

    // Transmembrane Domains
    doc.setFont('helvetica', 'bold');
    doc.text('Transmembrane Domains', margin, yPos);
    yPos += 8;
    doc.setFont('helvetica', 'normal');
    doc.text(`Number of domains: ${results.transmembraneDomains.length}`, margin + 5, yPos);
    if (results.transmembraneDomains.length > 0) {
        results.transmembraneDomains.forEach(tm => {
            yPos += 6;
            doc.text(`Position ${tm.start}-${tm.end} (hydrophobicity: ${tm.hydrophobicity})`, margin + 10, yPos);
        });
    }
    yPos += 10;

    // Disulfide Bonds
    doc.setFont('helvetica', 'bold');
    doc.text('Disulfide Bonds', margin, yPos);
    yPos += 8;
    doc.setFont('helvetica', 'normal');
    doc.text(`Cysteine count: ${results.disulfideBonds.cysCount}`, margin + 5, yPos);
    yPos += 6;
    doc.text(`Possible disulfide bonds: ${results.disulfideBonds.pairs} pairs`, margin + 5, yPos);
    if (results.disulfideBonds.unpaired > 0) {
        yPos += 6;
        doc.text(`Unpaired cysteines: ${results.disulfideBonds.unpaired}`, margin + 5, yPos);
    }
    yPos += 10;

    // N-Glycosylation Sites
    doc.setFont('helvetica', 'bold');
    doc.text('N-Glycosylation Sites', margin, yPos);
    yPos += 8;
    doc.setFont('helvetica', 'normal');
    doc.text(`Number of sites: ${results.nGlycosylationSites.length}`, margin + 5, yPos);
    if (results.nGlycosylationSites.length > 0) {
        results.nGlycosylationSites.slice(0, 5).forEach(site => {
            yPos += 6;
            doc.text(`Position ${site.position}: ${site.sequence} (${site.accessible ? 'accessible' : 'may be buried'})`, margin + 10, yPos);
        });
        if (results.nGlycosylationSites.length > 5) {
            yPos += 6;
            doc.text(`... and ${results.nGlycosylationSites.length - 5} more`, margin + 10, yPos);
        }
    }
    yPos += 10;

    // Protease Sites
    doc.setFont('helvetica', 'bold');
    doc.text('Protease Cleavage Sites', margin, yPos);
    yPos += 8;
    doc.setFont('helvetica', 'normal');
    doc.text(`TEV sites: ${results.proteaseSites.tev.length}`, margin + 5, yPos);
    yPos += 6;
    doc.text(`Trypsin sites: ${results.proteaseSites.trypsin.length}`, margin + 5, yPos);
    yPos += 6;
    doc.text(`Chymotrypsin sites: ${results.proteaseSites.chymotrypsin.length}`, margin + 5, yPos);
    yPos += 10;

    return yPos;
}

/**
 * Add expression recommendations
 */
function addExpressionRecommendations(doc, results, margin, pageWidth, startY) {
    let yPos = startY;

    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Expression System Recommendations', margin, yPos);
    yPos += 12;

    doc.setFontSize(10);
    
    const systems = [
        { name: 'Bacterial (E.coli)', key: 'bacterial' },
        { name: 'Yeast', key: 'yeast' },
        { name: 'Insect Cells', key: 'insect' },
        { name: 'Mammalian Cells', key: 'mammalian' }
    ];

    systems.forEach(system => {
        const rec = results.expressionRecommendations[system.key];
        const color = rec.recommended ? [0, 150, 0] : [200, 0, 0];
        
        doc.setTextColor(...color);
        doc.setFont('helvetica', 'bold');
        doc.text(`${system.name}: ${rec.recommended ? 'Recommended' : 'Not Recommended'}`, margin, yPos);
        
        doc.setTextColor(0, 0, 0);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        const reasonLines = doc.splitTextToSize(rec.reason, pageWidth - margin - 30);
        yPos += 8;
        doc.text(reasonLines, margin + 5, yPos);
        yPos += reasonLines.length * 5 + 8;
    });

    doc.setFontSize(10);
    return yPos;
}

/**
 * Add risk assessment
 */
function addRiskAssessment(doc, results, margin, pageWidth, startY) {
    let yPos = startY;

    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Risk Assessment', margin, yPos);
    yPos += 12;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');

    const risks = [
        { name: 'Aggregation Risk', value: results.riskAssessment.aggregationRisk },
        { name: 'Solubility Risk', value: results.riskAssessment.solubilityRisk },
        { name: 'Expression Difficulty', value: results.riskAssessment.expressionDifficulty }
    ];

    risks.forEach(risk => {
        const color = getRiskColorPDF(risk.value);
        doc.setTextColor(...color);
        doc.setFont('helvetica', 'bold');
        doc.text(`${risk.name}: ${risk.value.toUpperCase()}`, margin, yPos);
        doc.setTextColor(0, 0, 0);
        doc.setFont('helvetica', 'normal');
        yPos += 10;
    });

    if (results.riskAssessment.issues.length > 0) {
        yPos += 5;
        doc.setFont('helvetica', 'bold');
        doc.text('Potential Issues:', margin, yPos);
        yPos += 8;
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        results.riskAssessment.issues.forEach(issue => {
            doc.text(`• ${issue}`, margin + 5, yPos);
            yPos += 7;
        });
    }

    doc.setFontSize(10);
    return yPos;
}

/**
 * Add database comparison
 */
function addDatabaseComparison(doc, results, margin, pageWidth, startY) {
    let yPos = startY;

    if (!results.databaseComparison || !results.databaseComparison.results) {
        return yPos;
    }

    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Database Comparison', margin, yPos);
    yPos += 12;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Found ${results.databaseComparison.totalResults || 0} similar proteins in UniProt`, margin, yPos);
    yPos += 10;

    if (results.databaseComparison.results.length > 0) {
        doc.setFontSize(9);
        results.databaseComparison.results.slice(0, 5).forEach(result => {
            doc.text(`${result.uniprotId || 'Unknown'}: ${result.proteinName || 'Unknown'}`, margin + 5, yPos);
            yPos += 7;
            if (result.organism) {
                doc.text(`  Organism: ${result.organism}`, margin + 10, yPos);
                yPos += 6;
            }
            yPos += 3;
        });
    }

    doc.setFontSize(10);
    return yPos;
}

/**
 * Add detailed tables
 */
function addDetailedTables(doc, results, margin, pageWidth, startY) {
    let yPos = startY;

    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Detailed Amino Acid Composition', margin, yPos);
    yPos += 12;

    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');

    // Create table header
    doc.setFont('helvetica', 'bold');
    doc.text('AA', margin, yPos);
    doc.text('Count', margin + 20, yPos);
    doc.text('%', margin + 50, yPos);
    doc.text('AA', margin + 70, yPos);
    doc.text('Count', margin + 90, yPos);
    doc.text('%', margin + 120, yPos);
    yPos += 8;

    doc.setFont('helvetica', 'normal');
    const aas = Object.keys(results.aminoAcidComposition.counts).sort();
    const half = Math.ceil(aas.length / 2);
    
    for (let i = 0; i < half; i++) {
        const aa1 = aas[i];
        const aa2 = aas[i + half] || null;
        
        doc.text(aa1, margin, yPos);
        doc.text(results.aminoAcidComposition.counts[aa1].toString(), margin + 20, yPos);
        doc.text(results.aminoAcidComposition.percentages[aa1] + '%', margin + 50, yPos);
        
        if (aa2) {
            doc.text(aa2, margin + 70, yPos);
            doc.text(results.aminoAcidComposition.counts[aa2].toString(), margin + 90, yPos);
            doc.text(results.aminoAcidComposition.percentages[aa2] + '%', margin + 120, yPos);
        }
        
        yPos += 7;
    }

    doc.setFontSize(10);
    return yPos + 10;
}

/**
 * Add appendix
 */
function addAppendix(doc, results, margin, pageWidth) {
    doc.addPage();
    let yPos = margin;

    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Appendix', margin, yPos);
    yPos += 15;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('Full Sequence', margin, yPos);
    yPos += 10;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    
    // Format sequence with line breaks (60 chars per line)
    const seq = results.sequence;
    const lineLength = 60;
    for (let i = 0; i < seq.length; i += lineLength) {
        const line = seq.substr(i, lineLength);
        const lineNum = Math.floor(i / lineLength) + 1;
        const startPos = i + 1;
        doc.text(`${startPos.toString().padStart(6, ' ')} ${line}`, margin, yPos);
        yPos += 5;
        
        if (yPos > doc.internal.pageSize.getHeight() - 30) {
            doc.addPage();
            yPos = margin;
        }
    }

    yPos += 15;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('Analysis Methods', margin, yPos);
    yPos += 10;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    const methods = [
        'Molecular weight: Monoisotopic masses',
        'Isoelectric point: Charge-based calculation',
        'Signal peptide: Hydrophobicity-based prediction',
        'Transmembrane domains: Kyte-Doolittle scale',
        'Disulfide bonds: Cysteine pairing prediction',
        'N-glycosylation: N-X-S/T pattern detection',
        'Protease sites: Sequence pattern matching'
    ];

    methods.forEach(method => {
        doc.text(`• ${method}`, margin + 5, yPos);
        yPos += 7;
    });
}

/**
 * Get risk color for PDF (RGB values)
 */
function getRiskColorPDF(risk) {
    switch(risk.toLowerCase()) {
        case 'high': return [220, 53, 69]; // red
        case 'medium': return [255, 193, 7]; // yellow
        case 'low': return [40, 167, 69]; // green
        default: return [108, 117, 125]; // gray
    }
}







