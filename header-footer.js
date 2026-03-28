    (function() {
            const xhrHeader = new XMLHttpRequest();
            xhrHeader.open('GET', '/header.html', false);
            xhrHeader.send();
            
            const xhrFooter = new XMLHttpRequest();
            xhrFooter.open('GET', '/footer.html', false);
            xhrFooter.send();
            
            window.headerHtml = xhrHeader.responseText;
            window.footerHtml = xhrFooter.responseText;
        })();

    async function handleShare() {
        const shareBtn = document.getElementById('shareBtn');
        const url = window.location.href;
        
        // Sla de originele HTML op
        const originalHtml = shareBtn.innerHTML;
        
        if (navigator.share) {
            try {
                await navigator.share({
                    title: document.title,
                    text: 'Check out these awesome tools!',
                    url: url
                });
                // Verander knop naar "Copied!"
                shareBtn.innerHTML = '<i class="fas fa-check"></i><span class="btn-text">Copied!</span>';
                setTimeout(() => {
                    shareBtn.innerHTML = originalHtml;
                }, 1500);
            } catch (err) {
                if (err.name !== 'AbortError') {
                    await copyToClipboard(url, shareBtn, originalHtml);
                }
            }
        } else {
            await copyToClipboard(url, shareBtn, originalHtml);
        }
    }
    
    async function copyToClipboard(text, btnElement, originalHtml) {
        try {
            await navigator.clipboard.writeText(text);
            // Verander knop naar "Copied!"
            btnElement.innerHTML = '<i class="fas fa-check"></i><span class="btn-text">Copied!</span>';
            setTimeout(() => {
                btnElement.innerHTML = originalHtml;
            }, 1500);
        } catch (err) {
            // Fallback voor oudere browsers
            const textarea = document.createElement('textarea');
            textarea.value = text;
            document.body.appendChild(textarea);
            textarea.select();
            const success = document.execCommand('copy');
            document.body.removeChild(textarea);
            
            if (success) {
                btnElement.innerHTML = '<i class="fas fa-check"></i><span class="btn-text">Copied!</span>';
                setTimeout(() => {
                    btnElement.innerHTML = originalHtml;
                }, 1500);
            } else {
                btnElement.innerHTML = '<i class="fas fa-exclamation-triangle"></i><span class="btn-text">Failed!</span>';
                setTimeout(() => {
                    btnElement.innerHTML = originalHtml;
                }, 1500);
            }
        }
    }
    
    // ========== DARK MODE FUNCTIE ==========
    function toggleDarkMode() {
        const body = document.body;
        const darkModeBtn = document.getElementById('darkmodeBtn');
        const isDark = body.classList.contains('dark');
        
        if (isDark) {
            body.classList.remove('dark');
            localStorage.setItem('darkMode', 'false');
            darkModeBtn.innerHTML = '<i class="fas fa-moon"></i><span class="btn-text">Dark</span>';
            showToast('Light mode activated ☀️', 'fa-sun');
        } else {
            body.classList.add('dark');
            localStorage.setItem('darkMode', 'true');
            darkModeBtn.innerHTML = '<i class="fas fa-sun"></i><span class="btn-text">Light</span>';
            showToast('Dark mode activated 🌙', 'fa-moon');
        }
    }
    
    // Laad dark mode voorkeur bij startup
    function loadDarkModePreference() {
        const savedDarkMode = localStorage.getItem('darkMode');
        const darkModeBtn = document.getElementById('darkmodeBtn');
        
        if (savedDarkMode === 'true') {
            document.body.classList.add('dark');
            darkModeBtn.innerHTML = '<i class="fas fa-sun"></i><span class="btn-text">Light</span>';
        } else {
            document.body.classList.remove('dark');
            darkModeBtn.innerHTML = '<i class="fas fa-moon"></i><span class="btn-text">Dark</span>';
        }
    }

    document.addEventListener('DOMContentLoaded', function() {
    const fadeElements = document.querySelectorAll('.fade-on-scroll');

    // Share button event
        const shareButton = document.getElementById('shareBtn');
        if(shareButton) {
            shareButton.addEventListener('click', handleShare);
        }
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target); // Stop met observeren na animatie
            }
        });
    }, {
        threshold: 0.1, // Element is zichtbaar voor 10%
        rootMargin: '50px' // Laad iets eerder in
    });
    
    fadeElements.forEach(element => {
        observer.observe(element);
    });
});

    // Laad dark mode voorkeur
    loadDarkModePreference();