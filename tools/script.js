// TOOLS DATABASE - 50+ tools to demonstrate pagination
const FULL_TOOLS_SET = [
    { name: "Trianglelator", desc: "Triangle Calculator & Solver", category: "utility", icon: "fa-ruler-combined", slug: "trianglelator" },
    { name: "BetterText", desc: "Smart Text Editor & Formatter", category: "productivity", icon: "fa-font", slug: "bettertext" },
    { name: "GeoMarker", desc: "Interactive Map Maker", category: "creativity", icon: "fa-map", slug: "geomarker" },
    { name: "QR Forge", desc: "QR Code Generator", category: "utility", icon: "fa-qrcode", slug: "qrforge" },
    { name: "WriterGen AI", desc: "AI story & content ideas", category: "creativity", icon: "fa-feather", slug: "writergen" },
    { name: "ColorSnatch", desc: "Color palette extractor", category: "creativity", icon: "fa-palette", slug: "colorsnatch" },
    { name: "JSON Cleaner", desc: "Format & validate JSON", category: "developer", icon: "fa-brackets-curly", slug: "jsoncleaner" },
    { name: "Markdown Pro", desc: "Live markdown preview", category: "developer", icon: "fa-markdown", slug: "markdownpro" },
    { name: "QuickCrop", desc: "Image cropper & compressor", category: "media", icon: "fa-crop", slug: "quickcrop" },
    { name: "SVG Magic", desc: "Optimize & edit SVGs", category: "developer", icon: "fa-bezier-curve", slug: "svgmagic" },
    { name: "PDF Merger", desc: "Merge PDFs locally", category: "productivity", icon: "fa-file-pdf", slug: "pdfmerger" },
    { name: "Typing Test", desc: "WPM & accuracy test", category: "productivity", icon: "fa-keyboard", slug: "typingtest" },
    { name: "Password Vault", desc: "Offline password generator", category: "utility", icon: "fa-lock", slug: "passwordvault" },
    { name: "Pixel Ruler", desc: "Screen measurement tool", category: "utility", icon: "fa-ruler", slug: "pixelruler" },
    { name: "AudioTrim", desc: "Cut & trim audio", category: "media", icon: "fa-waveform", slug: "audiotrim" },
    { name: "Gradient Forge", desc: "CSS gradient maker", category: "creativity", icon: "fa-fill-drip", slug: "gradientforge" },
    { name: "Code Snippets", desc: "Save & share code snippets", category: "developer", icon: "fa-code", slug: "codesnippets" },
    { name: "Base64 Tool", desc: "Encode / decode base64", category: "utility", icon: "fa-exchange-alt", slug: "base64tool" },
    { name: "Favicon Gen", desc: "Generate favicon pack", category: "developer", icon: "fa-image", slug: "favicongen" },
    { name: "Lorem Ipsum", desc: "Custom placeholder text", category: "productivity", icon: "fa-paragraph", slug: "loremipsum" },
    { name: "Unit Converter", desc: "Universal unit converter", category: "utility", icon: "fa-weight-hanging", slug: "unitconverter" },
    { name: "Color Contrast", desc: "WCAG contrast checker", category: "creativity", icon: "fa-eye", slug: "colorcontrast" },
    { name: "CSS Shadows", desc: "Box shadow generator", category: "developer", icon: "fa-css3", slug: "cssshadows" },
    { name: "MemoMind", desc: "Flashcard maker", category: "productivity", icon: "fa-brain", slug: "memomind" },
    { name: "ChartForge", desc: "Data viz builder", category: "developer", icon: "fa-chart-line", slug: "chartforge" },
    { name: "Text Diff", desc: "Compare text differences", category: "developer", icon: "fa-code-branch", slug: "textdiff" },
    { name: "Regex Tester", desc: "Test regular expressions", category: "developer", icon: "fa-terminal", slug: "regextester" },
    { name: "Image Compressor", desc: "Compress images locally", category: "media", icon: "fa-file-image", slug: "imagecompressor" },
    { name: "Video Trimmer", desc: "Trim video files", category: "media", icon: "fa-video", slug: "videotrimmer" },
    { name: "CSV Viewer", desc: "View and edit CSV files", category: "productivity", icon: "fa-table", slug: "csvviewer" },
    { name: "XML Formatter", desc: "Format XML data", category: "developer", icon: "fa-code", slug: "xmlformatter" },
    { name: "YAML Parser", desc: "Parse YAML to JSON", category: "developer", icon: "fa-file-code", slug: "yamlparser" },
    { name: "JWT Decoder", desc: "Decode JWT tokens", category: "developer", icon: "fa-key", slug: "jwtdecoder" },
    { name: "URL Encoder", desc: "Encode/decode URLs", category: "utility", icon: "fa-link", slug: "urlencoder" },
    { name: "Hash Generator", desc: "Generate MD5, SHA hashes", category: "utility", icon: "fa-hashtag", slug: "hashgenerator" },
    { name: "Barcode Reader", desc: "Read barcodes from images", category: "utility", icon: "fa-barcode", slug: "barcodereader" },
    { name: "Color Picker", desc: "Pick colors from screen", category: "creativity", icon: "fa-eye-dropper", slug: "colorpicker" },
    { name: "Font Pairer", desc: "Find font combinations", category: "creativity", icon: "fa-font", slug: "fontpairer" },
    { name: "Wireframe Kit", desc: "UI wireframe generator", category: "creativity", icon: "fa-draw-polygon", slug: "wireframekit" },
    { name: "Mockup Gen", desc: "Generate device mockups", category: "creativity", icon: "fa-mobile-alt", slug: "mockupgen" }
];

// Configuration
const TOOLS_PER_ROW = 6;
const ROWS_INITIAL = 2;      // Start with 2 rows = 12 tools
const ROWS_TO_ADD = 2;       // View more adds 2 rows = 12 tools
const MAX_ROWS_PER_PAGE = 4; // Maximum 4 rows = 24 tools per page

let currentFilteredList = [...FULL_TOOLS_SET];
let currentPage = 1;
let viewMoreUsed = false;     // Track if view more has been clicked (can only be used once per page)
let totalPages = 1;

// DOM elements
const toolsGrid = document.getElementById('toolsGrid');
const searchInput = document.getElementById('searchInput');
const categorySelect = document.getElementById('categorySelect');
const resetBtn = document.getElementById('resetFiltersBtn');
const viewMoreBtn = document.getElementById('viewMoreBtn');
const viewMoreContainer = document.getElementById('viewMoreContainer');
const paginationContainer = document.getElementById('paginationContainer');
const prevPageBtn = document.getElementById('prevPageBtn');
const nextPageBtn = document.getElementById('nextPageBtn');
const pageNumbersDiv = document.getElementById('pageNumbers');
const emptyStateDiv = document.getElementById('emptyState');
const resultsInfoSpan = document.getElementById('resultsInfo');

// Get tools to display based on current page and view more state
function getToolsToDisplay() {
    const rowsToShow = viewMoreUsed ? MAX_ROWS_PER_PAGE : ROWS_INITIAL;
    const toolsPerPage = rowsToShow * TOOLS_PER_ROW;
    const start = (currentPage - 1) * toolsPerPage;
    const end = start + toolsPerPage;
    return currentFilteredList.slice(start, end);
}

// Calculate total pages based on current filter and view more state
function calculateTotalPages() {
    const toolsPerPage = (viewMoreUsed ? MAX_ROWS_PER_PAGE : ROWS_INITIAL) * TOOLS_PER_ROW;
    return Math.ceil(currentFilteredList.length / toolsPerPage);
}

// Render the grid
function renderGrid() {
    const visibleTools = getToolsToDisplay();
    
    if (visibleTools.length === 0) {
        toolsGrid.style.display = 'none';
        emptyStateDiv.style.display = 'block';
        resultsInfoSpan.innerText = `0 tools found — try resetting filters`;
        viewMoreContainer.style.display = 'none';
        paginationContainer.style.display = 'none';
        return;
    }
    
    toolsGrid.style.display = 'grid';
    emptyStateDiv.style.display = 'none';
    
    const toolsPerPage = (viewMoreUsed ? MAX_ROWS_PER_PAGE : ROWS_INITIAL) * TOOLS_PER_ROW;
    const startIndex = (currentPage - 1) * toolsPerPage + 1;
    const endIndex = Math.min(startIndex + visibleTools.length - 1, currentFilteredList.length);
    
    resultsInfoSpan.innerText = `Showing ${startIndex}-${endIndex} of ${currentFilteredList.length} tool${currentFilteredList.length !== 1 ? 's' : ''} | ${viewMoreUsed ? '24' : '12'} tools per page`;
    
    toolsGrid.innerHTML = '';
    visibleTools.forEach((tool) => {
        const card = document.createElement('div');
        card.className = 'tool-card';
        
        let categoryPretty = '';
        switch(tool.category) {
            case 'developer': categoryPretty = '💻 Dev'; break;
            case 'creativity': categoryPretty = '🎨 Creative'; break;
            case 'productivity': categoryPretty = '⚡ Productivity'; break;
            case 'utility': categoryPretty = '🛠️ Utility'; break;
            case 'media': categoryPretty = '📸 Media'; break;
            default: categoryPretty = tool.category;
        }
        
        card.innerHTML = `
            <div class="card-icon"><i class="fas ${tool.icon}"></i></div>
            <h3>${escapeHtml(tool.name)}</h3>
            <p>${escapeHtml(tool.desc)}</p>
            <span class="category-badge">${categoryPretty}</span>
        `;
        
        card.addEventListener('click', () => {
            window.location.href = `/${tool.slug}`;
        });
        
        toolsGrid.appendChild(card);
    });
    
    updatePaginationControls();
}

// Update view more button and pagination visibility
function updatePaginationControls() {
    totalPages = calculateTotalPages();
    const toolsPerPage = (viewMoreUsed ? MAX_ROWS_PER_PAGE : ROWS_INITIAL) * TOOLS_PER_ROW;
    const hasMoreTools = currentFilteredList.length > toolsPerPage;
    
    // Show/hide view more button
    if (!viewMoreUsed && hasMoreTools && currentFilteredList.length > (ROWS_INITIAL * TOOLS_PER_ROW)) {
        viewMoreContainer.style.display = 'flex';
    } else {
        viewMoreContainer.style.display = 'none';
    }
    
    // Show/hide pagination
    if (totalPages > 1) {
        paginationContainer.style.display = 'flex';
        renderPageNumbers();
    } else {
        paginationContainer.style.display = 'none';
    }
    
    // Update prev/next buttons
    prevPageBtn.disabled = currentPage === 1;
    nextPageBtn.disabled = currentPage === totalPages;
}

// Render page numbers
function renderPageNumbers() {
    pageNumbersDiv.innerHTML = '';
    
    // Show max 5 page numbers
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, startPage + 4);
    
    if (endPage - startPage < 4) {
        startPage = Math.max(1, endPage - 4);
    }
    
    for (let i = startPage; i <= endPage; i++) {
        const pageBtn = document.createElement('button');
        pageBtn.textContent = i;
        pageBtn.className = 'page-number' + (i === currentPage ? ' active' : '');
        pageBtn.addEventListener('click', () => {
            currentPage = i;
            renderGrid();
        });
        pageNumbersDiv.appendChild(pageBtn);
    }
}

// View more: adds 2 extra rows (12 tools) - can only be used once
function handleViewMore() {
    if (!viewMoreUsed) {
        viewMoreUsed = true;
        currentPage = 1; // Reset to page 1 when switching to 24 tools view
        totalPages = calculateTotalPages();
        renderGrid();
    }
}

// Apply filters (search + category)
function applyFilters() {
    const searchTerm = searchInput.value.trim().toLowerCase();
    const selectedCat = categorySelect.value;
    
    let filtered = FULL_TOOLS_SET.filter(tool => {
        const matchesName = searchTerm === '' || 
            tool.name.toLowerCase().includes(searchTerm) || 
            tool.desc.toLowerCase().includes(searchTerm);
        const matchesCat = selectedCat === 'all' || tool.category === selectedCat;
        return matchesName && matchesCat;
    });
    
    currentFilteredList = filtered;
    viewMoreUsed = false;  // Reset view more when filters change
    currentPage = 1;
    totalPages = calculateTotalPages();
    renderGrid();
}

// Reset all filters
function resetAllFilters() {
    searchInput.value = '';
    categorySelect.value = 'all';
    applyFilters();
}

// Navigation
function goToPrevPage() {
    if (currentPage > 1) {
        currentPage--;
        renderGrid();
    }
}

function goToNextPage() {
    if (currentPage < totalPages) {
        currentPage++;
        renderGrid();
    }
}

// Helper functions
function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

// Debounce for search
let debounceTimer;
function onFilterChange() {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
        applyFilters();
    }, 300);
}

// Dark mode
function initDarkMode() {
    const stored = localStorage.getItem('trendyTheme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDark = stored === 'dark' || (stored === null && prefersDark);
    if (isDark) document.body.classList.add('dark');
    updateToggleBtn();
}

function updateToggleBtn() {
    const btn = document.getElementById('darkModeToggle');
    if (!btn) return;
    const isDark = document.body.classList.contains('dark');
    btn.innerHTML = isDark ? '<i class="fas fa-sun"></i> Light mode' : '<i class="fas fa-moon"></i> Dark mode';
}

function toggleDark() {
    document.body.classList.toggle('dark');
    localStorage.setItem('trendyTheme', document.body.classList.contains('dark') ? 'dark' : 'light');
    updateToggleBtn();
}

// Event listeners
searchInput.addEventListener('input', onFilterChange);
categorySelect.addEventListener('change', applyFilters);
resetBtn.addEventListener('click', resetAllFilters);
viewMoreBtn.addEventListener('click', handleViewMore);
prevPageBtn.addEventListener('click', goToPrevPage);
nextPageBtn.addEventListener('click', goToNextPage);
document.getElementById('darkModeToggle')?.addEventListener('click', toggleDark);

// Initialize
initDarkMode();
applyFilters();