document.addEventListener("DOMContentLoaded", function () {
    const container = document.querySelector('.better-markdown');
    const status = document.createElement('div');
    status.id = 'save-status';
    document.body.appendChild(status);

    // Initial State: Read the HTML content as the starting "file"
    let lines = container.innerText.trim().split('\n').map(l => l.trim());
    
    // Configuration State
    let config = { color: 'white', bg: 'black' };
    
    // Clear the container to rebuild it dynamically
    container.innerHTML = '';
    
    // Initial Render
    renderAll();

    // ============================================
    // Core Rendering Logic
    // ============================================

    function renderAll() {
        // 1. updates global theme based on first line
        updateGlobalConfig();
        
        // 2. Clear current view
        container.innerHTML = '';

        // 3. Render each line
        lines.forEach((text, index) => {
            const el = createPreviewElement(text, index);
            container.appendChild(el);
        });
    }

    function updateGlobalConfig() {
        if (lines.length > 0 && lines[0].startsWith('±')) {
            const parts = lines[0].split('|');
            if (parts.length >= 3) {
                config.color = parts[1].trim();
                config.bg = parts[2].trim();
            }
        }
        document.body.style.color = config.color;
        document.body.style.backgroundColor = config.bg;
    }

    // Creates the HTML view (<h1> or <p>)
    function createPreviewElement(text, index) {
        let el;
        
        // Hide config line in preview mode, but keep it in DOM so we can click to edit it
        if (text.startsWith('±')) {
            el = document.createElement('div');
            el.style.opacity = '0.3';
            el.style.fontSize = '0.8em';
            el.textContent = text; // Show raw config so you know where to click
        } 
        else if (text.includes('# ')) {
            const splitIndex = text.indexOf('# ');
            const colorPart = text.substring(0, splitIndex).trim();
            const bodyText = text.substring(splitIndex + 2).trim();
            const finalColor = colorPart === "" ? config.color : colorPart;

            el = document.createElement('h1');
            el.style.color = finalColor;
            el.textContent = bodyText || ' '; // Ensure empty header has height
        } else {
            el = document.createElement('p');
            el.textContent = text || ' '; // Ensure empty line has height
        }

        // Add interaction
        el.dataset.index = index;
        el.onclick = () => switchToEditMode(index);
        return el;
    }

    // ============================================
    // Editor Logic
    // ============================================

    function switchToEditMode(index) {
        // Find the current element in the DOM
        const currentEl = container.children[index];
        if (!currentEl || currentEl.tagName === 'INPUT') return; // Already editing

        // Create input field
        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'line-editor';
        input.value = lines[index];
        
        // Replace preview with input
        container.replaceChild(input, currentEl);
        input.focus();

        // Save on Blur (clicking away)
        input.onblur = () => {
            commitChange(index, input.value);
        };

        // Handle Enter key (Save + New Line)
        input.onkeydown = (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                commitChange(index, input.value);
                insertNewLine(index + 1);
            }
            // Handle Backspace on empty line (Delete line)
            if (e.key === 'Backspace' && input.value === '' && lines.length > 1) {
                e.preventDefault();
                deleteLine(index);
            }
        };
    }

    function commitChange(index, newText) {
        lines[index] = newText;
        updateGlobalConfig(); // In case we edited the config line
        
        // Re-render just this line's preview
        const newPreview = createPreviewElement(newText, index);
        container.replaceChild(newPreview, container.children[index]);
        
        // Trigger Cloud Save
        debouncedSave();
    }

    function insertNewLine(index) {
        lines.splice(index, 0, ""); // Insert empty string
        renderAll(); // Re-render everything to update indices
        switchToEditMode(index); // Focus the new line
    }

    function deleteLine(index) {
        lines.splice(index, 1);
        renderAll();
        // Focus the line above the deleted one
        if(index > 0) switchToEditMode(index - 1);
    }

    // ============================================
    // AWS Autosave Logic
    // ============================================
    
    let timeoutId;
    function debouncedSave() {
        status.style.display = 'block';
        status.innerText = '• Unsaved changes...';
        
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            saveToAWS();
        }, 2000); // Save 2 seconds after last edit
    }

    async function saveToAWS() {
        status.innerText = '↻ Syncing to Cloud...';
        
        const fullText = lines.join('\n');
        
        try {
            // REPLACE THIS with your actual API Gateway URL
            // const apiUrl = 'https://YOUR_API_ID.execute-api.us-east-1.amazonaws.com/prod';
            
            // Simulating a network request for now:
            await new Promise(r => setTimeout(r, 500)); 
            
            console.log("Saved content:", fullText);
            
            status.innerText = '✓ All changes saved';
            setTimeout(() => { status.style.display = 'none'; }, 2000);

        } catch (error) {
            console.error(error);
            status.innerText = '⚠ Save Failed';
        }
    }
});
