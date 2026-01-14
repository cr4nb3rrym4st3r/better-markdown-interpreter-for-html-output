document.addEventListener("DOMContentLoaded", function () {
    // 1. Find all blocks that need interpreting
    const markdownBlocks = document.querySelectorAll('.better-markdown');
    
    let defaultColor = 'white';
    let defaultBg = 'black';

    // 2. Iterate through each block
    markdownBlocks.forEach(block => {
        const rawInput = block.textContent.trim();
        const lines = rawInput.split('\n');
        let htmlOutput = '';

        // Check for configuration line (±) in this specific block
        if (lines.length > 0 && lines[0].trim().startsWith('±')) {
            const configLine = lines[0].trim();
            const parts = configLine.split('|');

            if (parts.length >= 3) {
                defaultColor = parts[1].trim();
                defaultBg = parts[2].trim();
            }
            lines.shift(); // Remove config line so it doesn't render
        }

        // 3. Process lines for this block
        lines.forEach(line => {
            const cleanLine = line.trim();
            if (!cleanLine) return;
        
            if (cleanLine.includes('# ')) {
                const splitIndex = cleanLine.indexOf('# ');
                const colorPart = cleanLine.substring(0, splitIndex).trim();
                const text = cleanLine.substring(splitIndex + 2).trim();
                const finalColor = colorPart === "" ? defaultColor : colorPart;
        
                htmlOutput += `<h1 style="color: ${finalColor}">${text}</h1>`;
            } else {
                htmlOutput += `<p>${cleanLine}</p>`;
            }
        });

        // 4. Swap the <p> for a <div> to accommodate <h1> elements
        // (Valid HTML doesn't allow <h1> inside <p>)
        const container = document.createElement('div');
        container.className = 'interpreted-markdown';
        container.innerHTML = htmlOutput;
        block.parentNode.replaceChild(container, block);
    });

    // 5. Apply the global theme (from the last config found)
    document.body.style.color = defaultColor;
    document.body.style.backgroundColor = defaultBg;

    // 6. Reveal the final page
    document.body.style.visibility = 'visible';
    document.body.style.opacity = '1';
});
