// ========== SHARE FUNCTIE ==========
    document.getElementById('header-placeholder').innerHTML = window.headerHtml;
    document.getElementById('footer-placeholder').innerHTML = window.footerHtml;
    
    // ========== TOOLS DATASET ==========
    const toolsData = [
        { name: "Creativize", icon: "fa-palette", desc: "AI image studio", category: "design" },
        { name: "GrowthDash", icon: "fa-chart-column", desc: "social analytics", category: "marketing" },
        { name: "CodeSnap", icon: "fa-code", desc: "share snippets", category: "dev" },
        { name: "ClipFusion", icon: "fa-film", desc: "video editing", category: "video" },
        { name: "WriterGen", icon: "fa-pen-fancy", desc: "blog & copy", category: "text" },
        { name: "FontSwift", icon: "fa-text-height", desc: "typography checker", category: "design" },
        { name: "MetricMuse", icon: "fa-chart-line", desc: "SEO analytics", category: "marketing" },
        { name: "TaskPilot", icon: "fa-tasks", desc: "project planner", category: "productivity" },
        { name: "MockupLab", icon: "fa-cube", desc: "3D mockups", category: "design" },
        { name: "Shortzy", icon: "fa-link", desc: "link shortener", category: "utilities" },
        { name: "ColorHarmony", icon: "fa-fill-drip", desc: "color schemes", category: "design" },
        { name: "PDFwizard", icon: "fa-file-pdf", desc: "edit PDF", category: "office" }
    ];

    const allToolsGrid = document.getElementById('allToolsGrid');
    const searchInput = document.getElementById('toolSearch');

    function renderTools(filter = '') {
        const lowerFilter = filter.toLowerCase().trim();
        let html = '';
        let index = 0;
        toolsData.forEach(tool => {
            if (lowerFilter && !tool.name.toLowerCase().includes(lowerFilter)) return;
            html += `
                <div class="tool-card" style="--index: ${index}" onclick="location.href='?tool=${encodeURIComponent(tool.name)}';" title="Open ${tool.name}">
                    <div class="card-image"><i class="fas ${tool.icon}"></i></div>
                    <h3>${tool.name}</h3>
                    <p>${tool.desc}</p>
                    <div style="height: 4px;"></div>
                </div>
            `;
            index++;
        });
        if (html === '') {
            html = `<div style="grid-column:1/-1; background: var(--no-results-bg); border-radius: 48px; padding: 3rem; text-align:center; color: var(--no-results-color);">
                        <i class="fas fa-compass" style="font-size: 2.5rem; margin-bottom: 1rem; display:block;"></i>
                        No tool found for "<strong>${filter}</strong>"
                    </div>`;
        }
        allToolsGrid.innerHTML = html;
    }

    renderTools();
    searchInput.addEventListener('input', (e) => renderTools(e.target.value));

    // Intersection Observer for fade-on-scroll
    const fadeElements = document.querySelectorAll('.fade-on-scroll');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.15, rootMargin: "0px 0px -20px 0px" });
    
    fadeElements.forEach(el => observer.observe(el));
    
    const grids = document.querySelectorAll('.trending-grid, .all-tools-grid');
    grids.forEach(grid => {
        observer.observe(grid);
    });
    
    setTimeout(() => {
        fadeElements.forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight - 100) {
                el.classList.add('visible');
            }
        });
        grids.forEach(grid => {
            const rect = grid.getBoundingClientRect();
            if (rect.top < window.innerHeight - 100) {
                grid.classList.add('visible');
            }
        });
    }, 200);