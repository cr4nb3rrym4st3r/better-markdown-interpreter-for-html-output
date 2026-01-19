# Frontend Security: Content Security Policy (CSP)

Since your editor allows writing raw HTML, you are at risk of XSS (Cross-Site Scripting). If User A shares a document with User B that contains a <script> tag, that script could steal User B's login token.

To prevent this:
- Sanitize on Render: Use a library like DOMPurify in your online-script.js before setting .innerHTML.
- CSP Headers: Set a header on your S3/CloudFront site that forbids the execution of inline scripts: Content-Security-Policy: default-src 'self'; script-src 'self';
- block copy paste of scripts. only allow typed scripts and add a warning when a script is typed.
