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