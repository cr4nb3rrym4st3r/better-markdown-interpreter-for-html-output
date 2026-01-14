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

    // Interpret lines
    lines.forEach(line => {
        const cleanLine = line.trim();
        if (!cleanLine) return;

        if (cleanLine.includes('#')) {
            const splitIndex = cleanLine.indexOf('#');
            const color = cleanLine.substring(0, splitIndex).trim();
            const text = cleanLine.substring(splitIndex + 1).trim();

            htmlOutput += `<h1 style="color:${color}">${text}</h1>`;
        } else {
            htmlOutput += `<p>${cleanLine}</p>`;
        }
    });

    // Inject output
    document.body.innerHTML = htmlOutput;

    // Reveal body
    document.body.style.visibility = 'visible';
    document.body.style.opacity = '1';
});
