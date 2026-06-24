// src/content/gfgDetector.js
(() => {
    // Find the first <pre><code> block – GFG uses this for solution code
    const codeBlocks = document.querySelectorAll('pre > code');
    if (!codeBlocks.length) return;

    const button = document.createElement('button');
    button.textContent = 'Save to GFGHub';
    Object.assign(button.style, {
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        zIndex: 9999,
        padding: '10px 15px',
        background: '#2563EB',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
    });

    button.addEventListener('click', () => {
        const code = codeBlocks[0].innerText;
        const problemTitle = document.querySelector('h1')?.innerText || 'Untitled Problem';
        const problemUrl = location.href;
        const payload = {
            repositoryId: null, // filled later in popup
            problemName: problemTitle,
            difficulty: 'Easy', // default – user can change in popup
            language: 'javascript',
            topic: '',
            code,
            problemUrl,
        };
        // Store payload locally so the popup can retrieve it
        chrome.storage.local.set({ payload }, () => {
            // Notify background to forward it later (when user clicks Push)
            chrome.runtime.sendMessage({ type: 'UPLOAD_PREPARED', payload });
        });
        alert('Solution captured – open the extension popup to push.');
    });

    document.body.appendChild(button);
})();
