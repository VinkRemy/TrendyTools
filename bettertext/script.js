// ========== SHARE FUNCTIE ==========
document.getElementById('header-placeholder').innerHTML = window.headerHtml;
document.getElementById('footer-placeholder').innerHTML = window.footerHtml;

// ==================== BETTER TEXT INIT ====================
// Wacht tot de DOM volledig geladen is
document.addEventListener('DOMContentLoaded', function() {
    initBetterText();
});

function initBetterText() {
    // ==================== DOM ELEMENTS ====================
    const textField = document.getElementById('textField');
    const statsSpan = document.getElementById('stats');
    const historyListDiv = document.getElementById('historyList');
    
    // Check of elementen bestaan (voorkom errors op andere pagina's)
    if (!textField || !statsSpan || !historyListDiv) {
        console.log('BetterText elements not found on this page');
        return;
    }
    
    // Dark mode
    const darkModeToggle = document.getElementById('darkModeToggle');
    if (darkModeToggle) {
        if (localStorage.getItem('darkMode') === 'enabled') {
            document.body.classList.add('dark');
        }
        darkModeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark');
            localStorage.setItem('darkMode', document.body.classList.contains('dark') ? 'enabled' : 'disabled');
        });
    }
    
    // ==================== HISTORY TREE WITH OPERATION NAMES ====================
    let historyNodes = [];
    let currentNodeId = null;
    let nextId = 1;
    
    // Store operation name with each node
    function createNode(text, parentId = null, operationName = "Initial") {
        const node = { 
            id: nextId++, 
            text: text, 
            parentId: parentId, 
            children: [], 
            order: 1,
            operation: operationName
        };
        if (parentId !== null) {
            const parent = historyNodes.find(n => n.id === parentId);
            if (parent) {
                node.order = parent.children.length + 1;
                parent.children.push(node.id);
            }
        } else {
            const rootNodes = historyNodes.filter(n => n.parentId === null);
            node.order = rootNodes.length + 1;
        }
        historyNodes.push(node);
        return node.id;
    }
    
    function getTipOfBranch(parentId) {
        if (parentId === null) {
            const rootNodes = historyNodes.filter(n => n.parentId === null).sort((a, b) => a.order - b.order);
            if (rootNodes.length === 0) return null;
            let tip = rootNodes[rootNodes.length - 1];
            while (tip.children.length > 0) {
                const children = tip.children.map(id => historyNodes.find(n => n.id === id)).sort((a, b) => a.order - b.order);
                tip = children[children.length - 1];
            }
            return tip;
        } else {
            const parent = historyNodes.find(n => n.id === parentId);
            if (!parent) return null;
            if (parent.children.length === 0) return parent;
            const children = parent.children.map(id => historyNodes.find(n => n.id === id)).sort((a, b) => a.order - b.order);
            let tip = children[children.length - 1];
            while (tip.children.length > 0) {
                const tipChildren = tip.children.map(id => historyNodes.find(n => n.id === id)).sort((a, b) => a.order - b.order);
                tip = tipChildren[tipChildren.length - 1];
            }
            return tip;
        }
    }
    
    function getPreviousNodeInSameBranch(nodeId) {
        const node = historyNodes.find(n => n.id === nodeId);
        if (!node) return null;
        const parentId = node.parentId;
        if (parentId === null) {
            const rootNodes = historyNodes.filter(n => n.parentId === null).sort((a, b) => a.order - b.order);
            const currentIndex = rootNodes.findIndex(n => n.id === nodeId);
            if (currentIndex > 0) {
                let prevRoot = rootNodes[currentIndex - 1];
                while (prevRoot.children.length > 0) {
                    const children = prevRoot.children.map(id => historyNodes.find(n => n.id === id)).sort((a, b) => a.order - b.order);
                    prevRoot = children[children.length - 1];
                }
                return prevRoot;
            }
            return null;
        } else {
            const parent = historyNodes.find(n => n.id === parentId);
            const siblings = parent.children.map(id => historyNodes.find(n => n.id === id)).sort((a, b) => a.order - b.order);
            const currentIndex = siblings.findIndex(n => n.id === nodeId);
            if (currentIndex > 0) {
                let prevSibling = siblings[currentIndex - 1];
                while (prevSibling.children.length > 0) {
                    const children = prevSibling.children.map(id => historyNodes.find(n => n.id === id)).sort((a, b) => a.order - b.order);
                    prevSibling = children[children.length - 1];
                }
                return prevSibling;
            } else {
                return parent;
            }
        }
    }
    
    function getNextNodeInSameBranch(nodeId) {
        const node = historyNodes.find(n => n.id === nodeId);
        if (!node) return null;
        if (node.children.length > 0) {
            const children = node.children.map(id => historyNodes.find(n => n.id === id)).sort((a, b) => a.order - b.order);
            return children[0];
        }
        const parentId = node.parentId;
        if (parentId === null) {
            const rootNodes = historyNodes.filter(n => n.parentId === null).sort((a, b) => a.order - b.order);
            const currentIndex = rootNodes.findIndex(n => n.id === nodeId);
            if (currentIndex < rootNodes.length - 1) {
                return rootNodes[currentIndex + 1];
            }
            return null;
        } else {
            const parent = historyNodes.find(n => n.id === parentId);
            const siblings = parent.children.map(id => historyNodes.find(n => n.id === id)).sort((a, b) => a.order - b.order);
            const currentIndex = siblings.findIndex(n => n.id === nodeId);
            if (currentIndex < siblings.length - 1) {
                return siblings[currentIndex + 1];
            }
            return null;
        }
    }
    
    function isTipOfBranch(nodeId) {
        const node = historyNodes.find(n => n.id === nodeId);
        if (!node) return false;
        const tip = getTipOfBranch(node.parentId);
        if (!tip) return false;
        return tip.id === nodeId;
    }
    
    function getNode(id) { return historyNodes.find(n => n.id === id); }
    
    function saveToHistory(operationName) {
        const currentText = textField.value;
        const currentNode = getNode(currentNodeId);
        if (currentNode && currentNode.text === currentText) return;
        
        if (currentNodeId !== null && isTipOfBranch(currentNodeId)) {
            currentNodeId = createNode(currentText, currentNode.parentId, operationName || "Edit");
        } else if (currentNodeId !== null) {
            currentNodeId = createNode(currentText, currentNodeId, operationName || "Edit");
        } else {
            currentNodeId = createNode(currentText, null, operationName || "Initial");
        }
        updateHistoryPanel();
    }
    
    function goToNode(nodeId) {
        const node = getNode(nodeId);
        if (!node) return;
        currentNodeId = nodeId;
        textField.value = node.text;
        updateStats();
        updateHistoryPanel();
    }
    
    function undo() {
        if (currentNodeId === null) return;
        const prevNode = getPreviousNodeInSameBranch(currentNodeId);
        if (prevNode) goToNode(prevNode.id);
    }
    
    function redo() {
        if (currentNodeId === null) return;
        const nextNode = getNextNodeInSameBranch(currentNodeId);
        if (nextNode) goToNode(nextNode.id);
    }
    
    function updateHistoryPanel() {
        historyListDiv.innerHTML = '';
        const rootNodes = historyNodes.filter(n => n.parentId === null).sort((a, b) => a.order - b.order);
        for (const rootNode of rootNodes) displayNode(rootNode, 0);
        const currentElement = historyListDiv.querySelector('.history-item.current');
        if (currentElement) currentElement.scrollIntoView({ block: 'nearest' });
    }
    
    function displayNode(node, depth) {
        let preview = node.text.replace(/\n/g, '↵');
        if (preview.length > 35) preview = preview.substring(0, 32) + '...';
        let displayNumber = getNodeNumbering(node);
        const operationBadge = node.operation ? ` [${node.operation}]` : '';
        
        const item = document.createElement('div');
        item.className = 'history-item';
        if (depth > 0) { item.classList.add('branch'); item.style.marginLeft = (depth * 20) + 'px'; }
        if (node.id === currentNodeId) item.classList.add('current');
        item.textContent = `${displayNumber}. ${preview}${operationBadge}`;
        item.title = `${node.operation || 'Version'}: ${node.text.substring(0, 100)}`;
        item.onclick = () => goToNode(node.id);
        historyListDiv.appendChild(item);
        
        const children = node.children.map(id => getNode(id)).sort((a, b) => a.order - b.order);
        for (const child of children) displayNode(child, depth + 1);
    }
    
    function getNodeNumbering(node) {
        const parts = [];
        let current = node;
        while (current !== null) {
            parts.unshift(current.order);
            current = current.parentId ? getNode(current.parentId) : null;
        }
        return parts.join('.');
    }
    
    function clearHistory() {
        const currentText = textField.value;
        historyNodes = [];
        nextId = 1;
        currentNodeId = createNode(currentText, null, "Initial");
        updateHistoryPanel();
    }
    
    // ==================== STATISTICS ====================
    function updateStats() {
        const text = textField.value;
        if (text === "") { statsSpan.innerHTML = "Characters: 0 | Words: 0 | Lines: 0"; return; }
        const chars = text.length;
        const charsNoSpaces = text.replace(/\s/g, '').length;
        const words = text.trim() === "" ? 0 : text.trim().split(/\s+/).length;
        const lines = text.split(/\n/).length;
        statsSpan.innerHTML = `Characters: ${chars} (no spaces: ${charsNoSpaces}) | Words: ${words} | Lines: ${lines}`;
    }

        // ==================== PLATFORM LIMITS CHECKER ====================
    function updatePlatformLimits() {
        const currentText = textField.value;
        const textLength = currentText.length;
        
        const platformItems = document.querySelectorAll('.platform-item');
        platformItems.forEach(item => {
            const limit = parseInt(item.dataset.limit);
            const counterSpan = item.querySelector('.counter');
            const statusIcon = item.querySelector('.status-icon');
            
            if (limit && !isNaN(limit)) {
                const isValid = textLength <= limit;
                const percentage = Math.min(100, (textLength / limit) * 100);
                
                // Update counter display
                if (counterSpan) {
                    counterSpan.textContent = `${textLength}/${limit.toLocaleString()}`;
                }
                
                // Update status icon and styling
                if (statusIcon) {
                    if (isValid) {
                        statusIcon.innerHTML = '<i class="fas fa-check-circle"></i>';
                        item.classList.remove('invalid');
                        item.classList.add('valid');
                    } else {
                        statusIcon.innerHTML = '<i class="fas fa-exclamation-triangle"></i>';
                        item.classList.remove('valid');
                        item.classList.add('invalid');
                    }
                }
                
                // Add visual warning when close to limit (90%+)
                if (percentage >= 90 && !isValid) {
                    item.style.borderColor = '#ef4444';
                    item.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
                } else if (percentage >= 90) {
                    item.style.borderColor = '#f59e0b';
                    item.style.backgroundColor = 'rgba(245, 158, 11, 0.1)';
                } else {
                    item.style.borderColor = '';
                    item.style.backgroundColor = '';
                }
            }
        });
    }
    
    // Call updatePlatformLimits whenever text changes
    const originalUpdateStats = updateStats;
    updateStats = function() {
        originalUpdateStats();
        updatePlatformLimits();
    };
    
    // Initial call
    updatePlatformLimits();
    
    // Collapsible functionality for platform limits
    const platformLimitsHeader = document.getElementById('platformLimitsHeader');
    if (platformLimitsHeader) {
        platformLimitsHeader.addEventListener('click', () => {
            platformLimitsHeader.classList.toggle('collapsed');
        });
    }
    
    // ==================== TRANSFORMATIONS ====================
    function toggleCase(text) { return text.split('').map(c => { if (c >= 'a' && c <= 'z') return c.toUpperCase(); if (c >= 'A' && c <= 'Z') return c.toLowerCase(); return c; }).join(''); }
    function removeEmptyLines(text) { let r = text.replace(/\n{3,}/g, '\n\n'); r = r.replace(/^\n+/, ''); return r.replace(/\n+$/, ''); }
    function removeAllEmptyLines(text) { return text.split(/\n/).filter(l => l.trim() !== '').join('\n'); }
    function addPeriod(text) { return addPunctuationAtEnd(text, '.'); }
    function addExclamation(text) { return addPunctuationAtEnd(text, '!'); }
    function addQuestion(text) { return addPunctuationAtEnd(text, '?'); }
    function addPunctuationAtEnd(text, punctuation) {
        let lines = text.split(/\n/), result = [];
        for (let i = 0; i < lines.length; i++) {
            let line = lines[i], trimmed = line.trim();
            if (trimmed.length > 0) {
                let lastChar = trimmed[trimmed.length - 1];
                if (lastChar !== '.' && lastChar !== '!' && lastChar !== '?') {
                    let nextEmpty = (i + 1 < lines.length && lines[i + 1].trim() === '');
                    if (nextEmpty || i === lines.length - 1) line = line + punctuation;
                }
            }
            result.push(line);
        }
        return result.join('\n');
    }
    function replaceAll(text, s, r) { if (!s) return text; const regex = new RegExp(s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'); return text.replace(regex, r); }
    function replaceFirst(text, s, r) { if (!s) return text; const regex = new RegExp(s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')); return text.replace(regex, r); }
    function replaceLast(text, s, r) { if (!s) return text; let idx = text.lastIndexOf(s); if (idx === -1) return text; return text.substring(0, idx) + r + text.substring(idx + s.length); }
    function replaceNth(text, s, r, n) { if (!s || n < 1) return text; let cnt = 0, idx = -1; for (let i = 0; i <= text.length - s.length; i++) { if (text.substring(i, i + s.length) === s) { cnt++; if (cnt === n) { idx = i; break; } } } if (idx === -1) return text; return text.substring(0, idx) + r + text.substring(idx + s.length); }
    function fixSentenceCase(text) {
        if (text === "") return text;
        let result = text.toLowerCase();
        result = result.replace(/([.!?])\s+([a-z])/g, (m, p, l) => p + ' ' + l.toUpperCase());
        result = result.replace(/([.!?])\n([a-z])/g, (m, p, l) => p + '\n' + l.toUpperCase());
        result = result.replace(/^\s*([a-z])/gm, (m, l) => l.toUpperCase());
        if (result.length > 0 && /[a-z]/.test(result[0])) result = result[0].toUpperCase() + result.slice(1);
        return result;
    }
    function replaceLetters(text) { let from = document.getElementById('replaceFrom').value, to = document.getElementById('replaceTo').value; if (from === "") { alert("Please enter letters to replace."); return text; } let regex = new RegExp(from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'); return text.replace(regex, to); }
    function allUppercase(text) { return text.toUpperCase(); }
    function allLowercase(text) { return text.toLowerCase(); }
    function capitalizeAfterPunctuation(text) { if (text === "") return text; let r = text; if (r.length > 0 && /[a-z]/.test(r[0])) r = r[0].toUpperCase() + r.slice(1); r = r.replace(/([.!?])\s+([a-z])/g, (m, p, l) => p + ' ' + l.toUpperCase()); r = r.replace(/([.!?])\n([a-z])/g, (m, p, l) => p + '\n' + l.toUpperCase()); return r; }
    function titleCase(text) { return text.replace(/\b\w/g, c => c.toUpperCase()); }
    function removeDoubleSpaces(text) { return text.replace(/[ ]{2,}/g, ' '); }
    function trimSpaces(text) { return text.trim(); }
    function spacesToUnderscore(text) { return text.replace(/ /g, '_'); }
    function removeAllSpaces(text) { return text.replace(/\s/g, ''); }
    function reverseText(text) { return text.split('').reverse().join(''); }
    function removePunctuation(text) { return text.replace(/[^\w\s]/g, ''); }
    function resetText() { if (textField.value !== "") { saveToHistory("Clear all"); textField.value = ""; updateStats(); saveToHistory("Clear all"); } }
    
    async function copyToClipboard() { const text = textField.value; if (text === "") { showButtonMessage('copyBtn', '⚠️ No text', 1500); return; } try { await navigator.clipboard.writeText(text); showButtonMessage('copyBtn', '✅ Copied!', 1500); } catch (err) { showButtonMessage('copyBtn', '❌ Error', 1500); } }
    function exportToTxt() { const text = textField.value; if (text === "") { showButtonMessage('exportBtn', '⚠️ No text', 1500); return; } const blob = new Blob([text], { type: 'text/plain' }); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = 'bettertext_export.txt'; document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url); showButtonMessage('exportBtn', '✅ Exported!', 1500); }
    
    function showButtonMessage(btnId, message, duration) {
        const btn = document.getElementById(btnId);
        if (!btn) return;
        const originalText = btn.innerHTML;
        btn.innerHTML = `<i class="fas fa-info-circle"></i> <span>${message}</span>`;
        setTimeout(() => { btn.innerHTML = originalText; }, duration);
    }
    
    function performTransform(transformFunc, operationName) {
        const current = textField.value;
        if (current === "") return;
        saveToHistory(operationName);
        const newText = transformFunc(current);
        if (newText !== current) {
            textField.value = newText;
            saveToHistory(operationName);
            updateStats();
        }
    }
    
    // ==================== BUTTONS ====================
    const buttonIds = ['replaceAllBtn', 'replaceFirstBtn', 'replaceLastBtn', 'replaceNthBtn', 
        'uppercaseBtn', 'lowercaseBtn', 'toggleCaseBtn', 'capitalizeBtn', 'titlecaseBtn', 'fixSentenceCaseBtn',
        'removeDoubleSpacesBtn', 'trimSpacesBtn', 'spacesToUnderscoreBtn', 'removeAllSpacesBtn', 
        'removeEmptyLinesBtn', 'removeAllEmptyLinesBtn', 'addPunctuationAtEndBtn', 'reverseBtn', 
        'removePunctuationBtn', 'undoBtn', 'redoBtn', 'copyBtn', 'exportBtn', 'resetBtn', 'clearHistoryBtn'];
    
    // Check of knoppen bestaan voordat we event listeners toevoegen
    const replaceAllBtn = document.getElementById('replaceAllBtn');
    if (replaceAllBtn) {
        document.getElementById('replaceAllBtn').onclick = () => { if (textField.value === "") { alert("Please enter text first."); return; } const s = document.getElementById('searchFor').value; if (s === "") { alert("Please enter what to search for."); return; } const r = document.getElementById('replaceWith').value; performTransform(t => replaceAll(t, s, r), `replace all: "${s}"→"${r}"`); };
        document.getElementById('replaceFirstBtn').onclick = () => { if (textField.value === "") { alert("Please enter text first."); return; } const s = document.getElementById('searchFor').value; if (s === "") { alert("Please enter what to search for."); return; } const r = document.getElementById('replaceWith').value; performTransform(t => replaceFirst(t, s, r), `replace first: "${s}"→"${r}"`); };
        document.getElementById('replaceLastBtn').onclick = () => { if (textField.value === "") { alert("Please enter text first."); return; } const s = document.getElementById('searchFor').value; if (s === "") { alert("Please enter what to search for."); return; } const r = document.getElementById('replaceWith').value; performTransform(t => replaceLast(t, s, r), `replace last: "${s}"→"${r}"`); };
        document.getElementById('replaceNthBtn').onclick = () => { if (textField.value === "") { alert("Please enter text first."); return; } const s = document.getElementById('searchFor').value; if (s === "") { alert("Please enter what to search for."); return; } const r = document.getElementById('replaceWith').value; const n = parseInt(document.getElementById('replaceNth').value); if (isNaN(n) || n < 1) { alert("Please enter a valid Nth number."); return; } performTransform(t => replaceNth(t, s, r, n), `replace ${n}th: "${s}"→"${r}"`); };
        document.getElementById('uppercaseBtn').onclick = () => { if (textField.value !== "") performTransform(allUppercase, "uppercase"); };
        document.getElementById('lowercaseBtn').onclick = () => { if (textField.value !== "") performTransform(allLowercase, "lowercase"); };
        document.getElementById('toggleCaseBtn').onclick = () => { if (textField.value !== "") performTransform(toggleCase, "toggle case"); };
        document.getElementById('capitalizeBtn').onclick = () => { if (textField.value !== "") performTransform(capitalizeAfterPunctuation, "capitalize after punctuation"); };
        document.getElementById('titlecaseBtn').onclick = () => { if (textField.value !== "") performTransform(titleCase, "title case"); };
        document.getElementById('fixSentenceCaseBtn').onclick = () => { if (textField.value !== "") performTransform(fixSentenceCase, "fix wrong capitals"); };
        document.getElementById('removeDoubleSpacesBtn').onclick = () => { if (textField.value !== "") performTransform(removeDoubleSpaces, "remove double spaces"); };
        document.getElementById('trimSpacesBtn').onclick = () => { if (textField.value !== "") performTransform(trimSpaces, "trim spaces"); };
        document.getElementById('spacesToUnderscoreBtn').onclick = () => { if (textField.value !== "") performTransform(spacesToUnderscore, "spaces → underscores"); };
        document.getElementById('removeAllSpacesBtn').onclick = () => { if (textField.value !== "") performTransform(removeAllSpaces, "remove all spaces"); };
        document.getElementById('removeEmptyLinesBtn').onclick = () => { if (textField.value !== "") performTransform(removeEmptyLines, "remove double line breaks"); };
        document.getElementById('removeAllEmptyLinesBtn').onclick = () => { if (textField.value !== "") performTransform(removeAllEmptyLines, "remove all empty lines"); };
        
        // VERANDERING 1: addPunctuationAtEndBtn wordt nu 3 aparte knoppen
        // We halen de oude knop weg en vervangen door 3 nieuwe in de HTML, maar hier zorgen we dat de functionaliteit werkt
        const addPunctuationBtn = document.getElementById('addPunctuationAtEndBtn');
        if (addPunctuationBtn) {
            // Vervang de oude knop functionaliteit - we maken er 3 aparte van
            addPunctuationBtn.onclick = () => { performTransform(addPeriod, "add period at end"); };
        }
        // Nieuwe knoppen voor additions category
        // Let op: deze knoppen moeten in de HTML bestaan, anders slaan we over
        const addPeriodBtn = document.getElementById('addPeriodBtn');
        if (addPeriodBtn) addPeriodBtn.onclick = () => { if (textField.value !== "") performTransform(addPeriod, "add period at end"); };
        const addExclamationBtn = document.getElementById('addExclamationBtn');
        if (addExclamationBtn) addExclamationBtn.onclick = () => { if (textField.value !== "") performTransform(addExclamation, "add exclamation at end"); };
        const addQuestionBtn = document.getElementById('addQuestionBtn');
        if (addQuestionBtn) addQuestionBtn.onclick = () => { if (textField.value !== "") performTransform(addQuestion, "add question at end"); };
        
        document.getElementById('reverseBtn').onclick = () => { if (textField.value !== "") performTransform(reverseText, "reverse text"); };
        document.getElementById('removePunctuationBtn').onclick = () => { if (textField.value !== "") performTransform(removePunctuation, "remove punctuation"); };
        document.getElementById('undoBtn').onclick = undo;
        document.getElementById('redoBtn').onclick = redo;
        document.getElementById('copyBtn').onclick = copyToClipboard;
        document.getElementById('exportBtn').onclick = exportToTxt;
        document.getElementById('resetBtn').onclick = resetText;
        document.getElementById('clearHistoryBtn').onclick = clearHistory;
    }
    
    // VERANDERING 2: Global undo/redo shortcuts (werken altijd, niet alleen in textField)
    window.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
            e.preventDefault();
            undo();
        } else if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
            e.preventDefault();
            redo();
        } else if ((e.ctrlKey || e.metaKey) && e.key === 'Z') {
            e.preventDefault();
            redo();
        }
    });
    
    // TextField shortcuts blijven behouden maar conflicteren niet
    textField.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && (e.key === 'z' || e.key === 'y' || e.key === 'Z')) {
            // Wordt al afgehandeld door de globale listener, dus hier niks doen om dubbele acties te voorkomen
            return;
        }
    });
    
    let typingTimer;
    textField.addEventListener('input', () => { clearTimeout(typingTimer); typingTimer = setTimeout(() => { const cn = getNode(currentNodeId); if (!cn || cn.text !== textField.value) saveToHistory("manual edit"); updateStats(); }, 800); });
    
    // ==================== INIT ====================
    const exampleText = "";
    textField.value = exampleText;
    updateStats();
    currentNodeId = createNode(exampleText, null, "Initial");
    updateHistoryPanel();
}