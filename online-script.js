document.addEventListener("DOMContentLoaded", function () {
    // 1. Find all blocks that need interpreting
    const markdownBlocks = document.querySelectorAll('.better-markdown');
    
    // Status indicator for Autosave (Shared)
    const status = document.createElement('div');
    status.id = 'save-status';
    document.body.appendChild(status);

    // 2. Initialize each block independently
    markdownBlocks.forEach((block, blockIndex) => {
        initializeEditor(block, blockIndex);
    });

    function initializeEditor(container, blockId) {
        // FIX: Improved line splitting logic
        // We trim the start/end of the whole block, then split by actual newline characters
        let lines = container.textContent
            .split('\n')
            .map(line => line.trim())
            .filter((line, index, array) => {
                // Keep lines that aren't just empty padding at the start/end
                return line.length > 0 || (index > 0 && index < array.length - 1);
            });

        if (lines.length === 0) lines = [""];

        let config = { color: 'white', bg: 'black' };

        // Initial Theme Check
        function updateBlockConfig() {
            if (lines.length > 0 && lines[0].startsWith('±')) {
                const parts = lines[0].split('|');
                if (parts.length >= 3) {
                    config.color = parts[1].trim();
                    config.bg = parts[2].trim();
                }
            }
            // Apply theme to the whole body based on the LAST config found on page
            document.body.style.color = config.color;
            document.body.style.backgroundColor = config.bg;
        }

        function render() {
            updateBlockConfig();
            container.innerHTML = '';
            lines.forEach((text, index) => {
                const el = createPreviewElement(text, index);
                container.appendChild(el);
            });
        }

        function createPreviewElement(text, index) {
            let el;
            if (text.startsWith('±')) {
                el = document.createElement('div');
                el.className = 'config-line';
                el.textContent = text;
            } else if (text.includes('# ')) {
                const splitIndex = text.indexOf('# ');
                const colorPart = text.substring(0, splitIndex).trim();
                const bodyText = text.substring(splitIndex + 2).trim();
                const finalColor = colorPart === "" ? config.color : colorPart;
                el = document.createElement('h1');
                el.style.color = finalColor;
                el.innerHTML = bodyText || '&nbsp;';
            } else {
                el = document.createElement('p');
                el.innerHTML = text || '&nbsp;';
            }

            el.onclick = () => switchToEditMode(el, index);
            return el;
        }

        function switchToEditMode(previewEl, index) {
            const input = document.createElement('input');
            input.type = 'text';
            input.className = 'line-editor';
            input.value = lines[index];
            
            container.replaceChild(input, previewEl);
            input.focus();

            input.onblur = () => {
                lines[index] = input.value;
                render();
                debouncedSave(blockId, lines);
            };

            input.onkeydown = (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    lines[index] = input.value;
                    lines.splice(index + 1, 0, "");
                    render();
                    // Focus the newly created line
                    const nextEl = container.children[index + 1];
                    if (nextEl) nextEl.click();
                }
                if (e.key === 'Backspace' && input.value === '' && lines.length > 1) {
                    e.preventDefault();
                    lines.splice(index, 1);
                    render();
                }
            };
        }

        render();
    }

    // 3. AWS Autosave Logic (Identifies which block changed)
    let timeoutId;
    function debouncedSave(blockId, contentArray) {
        status.style.display = 'block';
        status.innerText = '• Unsaved changes...';
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            saveToAWS(blockId, contentArray.join('\n'));
        }, 2000);
    }

    async function saveToAWS(blockId, fullText) {
        status.innerText = `↻ Syncing Block ${blockId}...`;
        try {
            // Simulated AWS Fetch
            console.log(`Saving Block ${blockId}:`, fullText);
            await new Promise(r => setTimeout(r, 500)); 
            status.innerText = '✓ All changes saved';
            setTimeout(() => { status.style.display = 'none'; }, 2000);
        } catch (error) {
            status.innerText = '⚠ Save Failed';
        }
    }
});
