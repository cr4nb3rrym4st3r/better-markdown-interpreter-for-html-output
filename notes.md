# Frontend Security: Content Security Policy (CSP)

Since your editor allows writing raw HTML, you are at risk of XSS (Cross-Site Scripting). If User A shares a document with User B that contains a <script> tag, that script could steal User B's login token.

To prevent this:
- Sanitize on Render: Use a library like DOMPurify in your online-script.js before setting .innerHTML.
- CSP Headers: Set a header on your S3/CloudFront site that forbids the execution of inline scripts: Content-Security-Policy: default-src 'self'; script-src 'self';
- block copy paste of scripts. only allow typed scripts and add a warning when a script is typed. Need to rectify the aspect of another user sharing scripts.
  - need to add a wrapper with auth around the sharing of each page
  - will be very hard to block injection 
  - is there a way to sign every render with verification that the user is interacting with the full original html           served by our page with valid login credentials.
  - think.. adblocks could falsely target aspects critical to the security of our site.
  - if my website was being Phished and a malicious html was served to the user. would the phished sites with all its custom scripting be able to block aspects of

# <https://www.markdownguide.org/basic-syntax/#urls-and-email-addresses> 
- above url takes you to h3 id="urls-and-email-addresses"
- below does similarly
```html
  <h3 id="syntax-highlighting">
    Syntax Highlighting
    <a class="anchorjs-link " aria-label="Anchor" data-anchorjs-icon="" href="#syntax-highlighting" style="font: 1em / 1 anchorjs-icons; padding-left: 0.375em;"></a>
  </h3>
```

# type a *tab* and press *enter* to create a new block inside of the block n-1
- this allows you to create a html like
```html
  <h3 id="syntax-highlighting">
    Syntax Highlighting
    <a class="anchorjs-link " aria-label="Anchor" data-anchorjs-icon="" href="#syntax-highlighting" style="font: 1em / 1 anchorjs-icons; padding-left: 0.375em;"></a>
  </h3>
```
- create nested text
- 
