    document.getElementById('header-placeholder').innerHTML = window.headerHtml;
    document.getElementById('footer-placeholder').innerHTML = window.footerHtml;
    
    let qr;
    
    function initQR() {
        document.getElementById("downloadBtn").style.display = "none";
        document.getElementById("linkInput").addEventListener("keypress", function(e) {
            if (e.key === "Enter") {
                generateQR();
            }
        });
    }
    
    function generateQR() {
        const link = document.getElementById("linkInput").value.trim();
        if (!link) {
            alert("✱ Please enter a link, text or image URL");
            return;
        }

        const qrContainer = document.getElementById("qrcode");
        qrContainer.innerHTML = "";

        qr = new QRCode(qrContainer, {
            text: link,
            width: 200,
            height: 200,
            correctLevel: QRCode.CorrectLevel.H
        });

        document.getElementById("downloadBtn").style.display = "inline-flex";

        const hintSmall = document.querySelector('.hint-text small');
        if (hintSmall) {
            hintSmall.innerHTML = link.length > 50 ? '✔ QR updated — ready to scan' : '✔ QR updated — click download to save';
        }
    }
    
    function downloadQR() {
        const qrDiv = document.getElementById("qrcode");
        const img = qrDiv.querySelector("img");
        const canvas = qrDiv.querySelector("canvas");

        let src = null;
        if (img) {
            src = img.src;
        } else if (canvas) {
            src = canvas.toDataURL("image/png");
        }

        if (!src) {
            alert("QR code not found. Generate one first.");
            return;
        }

        const link = document.createElement("a");
        link.href = src;
        link.download = "qr-forge.png";
        link.click();
    }
    
    function toggleTheme() {
        document.body.classList.toggle("dark");
        const toggleBtn = document.getElementById("themeToggle");
        const moonSun = toggleBtn.querySelector("i:first-child");
        if (document.body.classList.contains("dark")) {
            moonSun.className = "fas fa-sun";
        } else {
            moonSun.className = "fas fa-moon";
        }
    }