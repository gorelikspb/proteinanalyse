# Sequence Analyzer - SEO-Optimized Web Application

A fully static, JavaScript-only web application providing useful DNA/Protein sequence analysis tools. Optimized for SEO to attract free organic traffic.

## Features

### Pages

1. **`/index.html`** - Main Sequence Analyzer
   - Auto-detect DNA vs protein
   - Comprehensive analysis with basic stats

2. **`/dna-gc-calculator.html`** - GC Content Calculator
   - Sequence length
   - GC% and AT% calculation

3. **`/reverse-complement.html`** - Reverse Complement Tool
   - Reverse complement generation
   - Case-preserving option
   - Sequence cleaning

4. **`/orf-finder.html`** - ORF Finder
   - Longest ORF detection
   - Start/stop positions
   - Reading frame identification

5. **`/protein-mw-calculator.html`** - Protein Molecular Weight Calculator
   - Amino acid composition
   - Molecular weight calculation
   - Hydrophobic percentage

6. **`/sequence-translation.html`** - DNA Translation Tool
   - DNA → protein translation
   - Forward frame only
   - Standard genetic code

## Technical Details

- **100% Client-side**: All analysis runs in the browser using JavaScript
- **No Dependencies**: Pure HTML, CSS, and JavaScript
- **No Frameworks**: Vanilla JS only
- **Fast Loading**: Optimized for <200ms load time
- **SEO Optimized**: Each page includes:
  - SEO-optimized `<title>` tags
  - Keyword-rich `<h1>` headings
  - 150-200 words of human-readable SEO text
  - Internal links between pages
  - Schema markup (JSON-LD)
- **Responsive Design**: Works on desktop and mobile devices

## File Structure

```
docs/
├── index.html                    # Main sequence analyzer
├── dna-gc-calculator.html        # GC content calculator
├── reverse-complement.html        # Reverse complement tool
├── orf-finder.html               # ORF detection
├── protein-mw-calculator.html    # Protein molecular weight
├── sequence-translation.html     # DNA translation
├── common.js                     # Shared functions
└── styles.css                    # Global styles
```

## SEO Keywords

Each page is optimized for specific keywords:

- **index.html**: sequence analysis, multiple sequence analysis, genome analysis
- **dna-gc-calculator.html**: GC content calculator, GC percentage, DNA GC calculator
- **reverse-complement.html**: reverse complement, DNA reverse complement, complement sequence
- **orf-finder.html**: ORF finder, open reading frame, ORF detection, gene finding
- **protein-mw-calculator.html**: protein molecular weight, protein MW calculator, amino acid composition
- **sequence-translation.html**: DNA translation, DNA to protein, genetic code, codon translation

## Deployment

### GitHub Pages

1. Create a GitHub repository
2. Push all files from the `docs/` folder to the repository
3. Go to repository Settings > Pages
4. Select source: "Deploy from a branch"
5. Choose branch: `main` (or `master`)
6. Select folder: `/docs`
7. Save

Your site will be available at: `https://[username].github.io/[repository-name]/`

### Alternative: Netlify / Vercel

Simply drag and drop the `docs/` folder to deploy instantly.

## Local Development

1. Open any HTML file in a web browser
2. Or use a local server:
   ```bash
   cd docs
   python -m http.server 8000
   ```
3. Navigate to `http://localhost:8000`

## Browser Support

Works in all modern browsers that support ES6 JavaScript.

## Performance

- Load time: <200ms
- No external dependencies
- No backend required
- Works offline (after initial load)

## Privacy

All analysis is performed locally in your browser. No data is sent to any server, ensuring complete privacy and security for your sequences.
