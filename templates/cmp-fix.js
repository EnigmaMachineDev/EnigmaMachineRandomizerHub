// CMP Styling and Positioning Fix
// This script ensures the consent management platform popup is properly styled and positioned

(function() {
    // Function to apply styles to CMP elements
    function styleCMP() {
        // Find all possible CMP containers
        const selectors = [
            '[id*="gatekeeper"]',
            '[class*="gatekeeper"]',
            '[id*="consent"]',
            '[class*="consent"]',
            'div[style*="z-index: 2147483647"]',
            'div[style*="z-index: 2147483646"]'
        ];

        selectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(el => {
                // Skip script and style tags
                if (el.tagName === 'SCRIPT' || el.tagName === 'STYLE') return;

                // Apply positioning
                const computedStyle = window.getComputedStyle(el);
                if (computedStyle.position === 'fixed' || el.style.position === 'fixed') {
                    el.style.setProperty('position', 'fixed', 'important');
                    el.style.setProperty('left', '50%', 'important');
                    el.style.setProperty('top', '50%', 'important');
                    el.style.setProperty('transform', 'translate(-50%, -50%)', 'important');
                    el.style.setProperty('right', 'auto', 'important');
                    el.style.setProperty('bottom', 'auto', 'important');
                    el.style.setProperty('margin', '0', 'important');
                    el.style.setProperty('max-width', '600px', 'important');
                    el.style.setProperty('width', '90vw', 'important');
                    el.style.setProperty('z-index', '999999', 'important');
                }

                // Apply dark theme styling
                if (el.offsetWidth > 200 && el.offsetHeight > 100) {
                    el.style.setProperty('background-color', '#2a2a2a', 'important');
                    el.style.setProperty('color', '#e0e0e0', 'important');
                    el.style.setProperty('border', '1px solid rgba(0, 255, 0, 0.3)', 'important');
                    el.style.setProperty('border-radius', '12px', 'important');
                    el.style.setProperty('box-shadow', '0 10px 40px rgba(0, 255, 0, 0.2)', 'important');
                }

                // Style child elements
                const allChildren = el.querySelectorAll('*');
                allChildren.forEach(child => {
                    if (child.tagName === 'SCRIPT' || child.tagName === 'STYLE') return;

                    // Headings
                    if (['H1', 'H2', 'H3', 'H4', 'H5', 'H6'].includes(child.tagName)) {
                        child.style.setProperty('color', '#00ff00', 'important');
                    }

                    // Text elements
                    if (['P', 'SPAN', 'DIV', 'LABEL', 'A'].includes(child.tagName)) {
                        child.style.setProperty('color', '#e0e0e0', 'important');
                    }

                    // Links
                    if (child.tagName === 'A') {
                        child.style.setProperty('color', '#00ff00', 'important');
                        child.style.setProperty('text-decoration', 'underline', 'important');
                    }

                    // Buttons
                    if (child.tagName === 'BUTTON') {
                        child.style.setProperty('background-color', '#00ff00', 'important');
                        child.style.setProperty('color', '#0f0f0f', 'important');
                        child.style.setProperty('border', 'none', 'important');
                        child.style.setProperty('padding', '10px 20px', 'important');
                        child.style.setProperty('border-radius', '8px', 'important');
                        child.style.setProperty('font-weight', '600', 'important');
                        child.style.setProperty('cursor', 'pointer', 'important');
                        
                        // Add click handler to close popup after any button click
                        if (!child.hasAttribute('data-cmp-handler-added')) {
                            child.setAttribute('data-cmp-handler-added', 'true');
                            child.addEventListener('click', function() {
                                setTimeout(() => {
                                    // Find and hide all CMP containers
                                    const cmpSelectors = [
                                        '[id*="gatekeeper"]',
                                        '[class*="gatekeeper"]',
                                        '[id*="consent"]',
                                        '[class*="consent"]',
                                        'div[style*="z-index: 2147483647"]',
                                        'div[style*="z-index: 2147483646"]'
                                    ];
                                    
                                    cmpSelectors.forEach(selector => {
                                        const elements = document.querySelectorAll(selector);
                                        elements.forEach(el => {
                                            if (el.tagName !== 'SCRIPT' && el.tagName !== 'STYLE') {
                                                el.style.display = 'none';
                                                el.remove();
                                            }
                                        });
                                    });
                                }, 500);
                            });
                        }
                    }

                    // Checkboxes
                    if (child.type === 'checkbox') {
                        child.style.setProperty('accent-color', '#00ff00', 'important');
                    }

                    // Remove white backgrounds
                    const bgColor = window.getComputedStyle(child).backgroundColor;
                    if (bgColor === 'rgb(255, 255, 255)' || bgColor === 'white' || bgColor.includes('255, 255, 255')) {
                        child.style.setProperty('background-color', 'transparent', 'important');
                    }
                });
            });
        });
    }

    // Run immediately
    styleCMP();

    // Run after a short delay (for dynamically loaded content)
    setTimeout(styleCMP, 100);
    setTimeout(styleCMP, 500);
    setTimeout(styleCMP, 1000);

    // Watch for DOM changes
    const observer = new MutationObserver(() => {
        styleCMP();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Run on window load
    window.addEventListener('load', styleCMP);
})();
