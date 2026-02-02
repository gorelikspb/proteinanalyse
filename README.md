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
public/
├── index.html                    # Main sequence analyzer
├── dna-gc-calculator.html        # GC content calculator
├── reverse-complement.html        # Reverse complement tool
├── orf-finder.html               # ORF detection
├── protein-mw-calculator.html    # Protein molecular weight
├── sequence-translation.html     # DNA translation
├── amino-acid-composition.html   # Amino acid composition analyzer
├── codon-usage-calculator.html   # Codon usage calculator
├── fasta-validator.html          # FASTA format validator
├── peptide-length-calculator.html # Peptide length calculator
├── rna-to-protein.html           # RNA to protein translator
├── ai-feasibility.html           # AI feasibility checker
├── common.js                     # Shared functions
├── styles.css                    # Global styles
├── robots.txt                    # SEO robots file
└── sitemap.xml                   # SEO sitemap
```

## Deployment to Cloudflare Pages

### Prerequisites

- GitHub repository with code pushed
- Cloudflare account (free tier works)

### Step 1: Push to GitHub

Code is already pushed to: `https://github.com/gorelikspb/proteinanalyse`

If you need to push updates:
```bash
git add .
git commit -m "Your commit message"
git push
```

### Step 2: Connect to Cloudflare Pages

#### Option A: Automatic Setup (if you have Cloudflare API token)

**What you need:**
1. Cloudflare API Token with Pages permissions
   - Get it here: https://dash.cloudflare.com/profile/api-tokens
   - Permissions: `Account` → `Cloudflare Pages` → `Edit`

**Tell AI assistant:**
> "Настрой Cloudflare Pages с токеном: `ваш-токен`"

The assistant will:
- Check if `seq-tools` name is available
- Create the project automatically
- Configure deployment from `public/` folder
- Get the site URL

#### Option B: Manual Setup (recommended for first time)

1. **Go to Cloudflare Dashboard**:
   - Navigate to [Cloudflare Dashboard](https://dash.cloudflare.com/)
   - Select your account
   - Go to **Pages** in the sidebar (or visit: https://dash.cloudflare.com/pages)

2. **Create a new project**:
   - Click **"Create a project"**
   - Click **"Connect to Git"**
   - Authorize Cloudflare to access your GitHub account (if not already connected)
   - Select the repository: `gorelikspb/proteinanalyse`

3. **Configure build settings**:
   - **Project name**: `seq-tools` ⚠️ (if name is taken, choose another)
   - **Production branch**: `master`
   - **Framework preset**: Select **"None"** (or leave empty)
   - **Build command**: Leave **empty** (no build step needed)
   - **Build output directory**: `public` ⚠️ **IMPORTANT!**
   - **Root directory**: Leave empty (or `/`)

4. **Deploy**:
   - Click **"Save and Deploy"**
   - Wait for deployment to complete (usually 1-2 minutes)

### Step 3: Access Your Site

After deployment, your site will be available at:
```
https://seqanalysis.org
```

See `SITE_DOMAIN.md` for production domain details.

**Note**: If `seq-tools` name is already taken, Cloudflare will suggest an alternative name (e.g., `seq-tools-xyz123`).

### Step 4: Verify Deployment

See "Deployment Checklist" section below to verify everything works.

---

**For detailed instructions, see:** `docs/domain/CLOUDFLARE_DOMAIN_SETUP.md`

**Документация:** См. `docs/README.md` для полного списка документации.

## Deployment Checklist

After deployment, verify the following:

### ✅ Basic Functionality
- [ ] Main page (`/index.html`) loads correctly
- [ ] All CSS styles are applied (check if page looks correct)
- [ ] JavaScript is working (no console errors)
- [ ] Navigation menu appears on all pages

### ✅ All Tools Work
- [ ] **Sequence Analyzer** (`/index.html`):
  - [ ] DNA example loads and analyzes correctly
  - [ ] Protein example loads and analyzes correctly
  - [ ] Results display properly

- [ ] **GC Calculator** (`/dna-gc-calculator.html`):
  - [ ] Example loads correctly
  - [ ] GC% calculation works
  - [ ] Results display properly

- [ ] **Reverse Complement** (`/reverse-complement.html`):
  - [ ] Example loads correctly
  - [ ] Reverse complement generation works
  - [ ] Copy to clipboard works (if implemented)

- [ ] **ORF Finder** (`/orf-finder.html`):
  - [ ] Example loads correctly
  - [ ] ORF detection works
  - [ ] Results show start/stop positions

- [ ] **Protein MW Calculator** (`/protein-mw-calculator.html`):
  - [ ] Example loads correctly
  - [ ] Molecular weight calculation works
  - [ ] Amino acid composition displays

- [ ] **DNA Translation** (`/sequence-translation.html`):
  - [ ] Example loads correctly
  - [ ] Translation works correctly
  - [ ] Protein sequence displays

### ✅ Navigation & Links
- [ ] All internal links between pages work
- [ ] Navigation menu links work on all pages
- [ ] No broken links (404 errors)
- [ ] All pages are accessible via direct URL

### ✅ SEO & Performance
- [ ] All pages have unique titles
- [ ] Meta descriptions are present
- [ ] Page loads quickly (<2 seconds)
- [ ] No console errors
- [ ] Mobile responsive design works

### ✅ Assets Loading
- [ ] CSS file (`styles.css`) loads correctly
- [ ] JavaScript file (`common.js`) loads correctly
- [ ] All images (if any) load correctly
- [ ] No 404 errors for assets

## Local Development

1. **Open directly in browser**:
   - Navigate to `public/index.html` and open in browser
   - All relative paths should work

2. **Or use a local server**:
   ```bash
   cd public
   python -m http.server 8000
   ```
   Then navigate to `http://localhost:8000`

## Alternative Deployment Options

### GitHub Pages

1. Push files from `public/` folder to repository
2. Go to repository Settings > Pages
3. Select source: "Deploy from a branch"
4. Choose branch: `master`
5. Select folder: `/public`
6. Save

Your site will be available at: `https://[username].github.io/[repository-name]/`

### Netlify / Vercel

Simply drag and drop the `public/` folder to deploy instantly.

## Browser Support

Works in all modern browsers that support ES6 JavaScript.

## Performance

- Load time: <200ms
- No external dependencies
- No backend required
- Works offline (after initial load)

## Privacy

All analysis is performed locally in your browser. No data is sent to any server, ensuring complete privacy and security for your sequences.
