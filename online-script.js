document.addEventListener("DOMContentLoaded", function () {

    // 1. GRAB THE RAW CONTENT
    const rawInput = document.body.textContent.trim();

    // 2. CLEAR THE BODY
    document.body.innerHTML = '';

    // 3. PARSE THE TEXT
    const lines = rawInput.split('\n');
    let htmlOutput = '';

    let defaultColor = 'white';
    let defaultBg = 'black';

    // Configuration line
    if (lines.length > 0 && lines[0].trim().startsWith('±')) {
        const configLine = lines[0].trim();
        const parts = configLine.split('|');

        if (parts.length >= 3) {
            defaultColor = parts[1].trim();
            defaultBg = parts[2].trim();
        }

        lines.shift();
    }

    // Apply defaults
    document.body.style.color = defaultColor;
    document.body.style.backgroundColor = defaultBg;

    // 4. INTERPRET THE REST OF THE LINES
    lines.forEach(line => {
        const cleanLine = line.trim();
        if (!cleanLine) return;
    
        // Check for the specific syntax: "color# " (Hash followed by a space)
        if (cleanLine.includes('# ')) {
            const splitIndex = cleanLine.indexOf('# ');
            
            // Everything before the '# ' is the color
            const colorPart = cleanLine.substring(0, splitIndex).trim();
            
            // Everything after the '# ' is the text (offset by 2 to skip the '# ')
            const text = cleanLine.substring(splitIndex + 2).trim();
    
            // If colorPart is empty (e.g., "# My Title"), default to white
            const finalColor = colorPart === "" ? "white" : colorPart;
    
            htmlOutput += `<h1 style="color: ${finalColor}">${text}</h1>`;
        } else {
            // If there is no "# ", or no space after the #, it's just a body paragraph
            htmlOutput += `<p>${cleanLine}</p>`;
        }
    });

    // Inject output
    document.body.innerHTML = htmlOutput;

    // Reveal body
    document.body.style.visibility = 'visible';
    document.body.style.opacity = '1';
});
