// CMP Styling Fix - Styles first Ezoic popup and hides it when second appears
// Ensures proper z-index stacking for consent flow

(function() {
    const baseZIndex = 2147483640;
    
    // Remove backdrop
    function removeBackdrop() {
        const backdrop = document.getElementById('cmp-backdrop');
        if (backdrop) {
            backdrop.remove();
        }
    }
    
    // Hide the first popup and backdrop
    function hideFirstPopup() {
        const firstPopup = document.querySelector('div[data-ezoic-role="privacy-policy"]');
        if (firstPopup) {
            firstPopup.style.setProperty('display', 'none', 'important');
            console.log('CMP Fix: Hiding first popup');
        }
        removeBackdrop();
    }
    
    // Style ONLY the first popup element
    function styleFirstPopup(el) {
        // Position as fixed overlay
        el.style.setProperty('position', 'fixed', 'important');
        el.style.setProperty('top', '50%', 'important');
        el.style.setProperty('left', '50%', 'important');
        el.style.setProperty('transform', 'translate(-50%, -50%)', 'important');
        el.style.setProperty('z-index', String(baseZIndex + 1), 'important');
        el.style.setProperty('max-height', '80vh', 'important');
        el.style.setProperty('overflow-y', 'auto', 'important');
        
        // Theme colors
        el.style.setProperty('background-color', '#2a2a2a', 'important');
        el.style.setProperty('color', '#e0e0e0', 'important');
        el.style.setProperty('border', '1px solid rgba(0, 255, 0, 0.3)', 'important');
        el.style.setProperty('border-radius', '12px', 'important');
        el.style.setProperty('box-shadow', '0 10px 40px rgba(0, 0, 0, 0.5)', 'important');
        el.style.setProperty('padding', '20px', 'important');
        
        // Clear the inline clear:both that pushes it down
        el.style.setProperty('clear', 'none', 'important');
        
        // Add click listener to "Do Not Sell" button to hide first popup
        // Use setTimeout to let Ezoic's handler run first
        const doNotSellBtn = el.querySelector('#ez-ccpa-reject-all');
        if (doNotSellBtn && !doNotSellBtn.dataset.cmpListener) {
            doNotSellBtn.addEventListener('click', function() {
                // Delay hiding to let Ezoic's handler complete first
                setTimeout(hideFirstPopup, 100);
            });
            doNotSellBtn.dataset.cmpListener = 'true';
        }
        
        // Also handle "Consent" button - let Ezoic handle it, just remove our backdrop after
        const consentBtn = el.querySelector('#ez-ccpa-accept-all');
        if (consentBtn && !consentBtn.dataset.cmpListener) {
            consentBtn.addEventListener('click', function() {
                // Delay to let Ezoic save consent
                setTimeout(function() {
                    removeBackdrop();
                }, 100);
            });
            consentBtn.dataset.cmpListener = 'true';
        }
        
        // Style headings
        el.querySelectorAll('h2, h3').forEach(h => {
            h.style.setProperty('color', '#00ff00', 'important');
        });
        
        // Style paragraphs
        el.querySelectorAll('p').forEach(p => {
            p.style.setProperty('color', '#e0e0e0', 'important');
        });
        
        // Style buttons
        el.querySelectorAll('button').forEach(btn => {
            btn.style.setProperty('background-color', '#00ff00', 'important');
            btn.style.setProperty('color', '#0f0f0f', 'important');
            btn.style.setProperty('border', 'none', 'important');
            btn.style.setProperty('padding', '10px 20px', 'important');
            btn.style.setProperty('border-radius', '8px', 'important');
            btn.style.setProperty('font-weight', '600', 'important');
            btn.style.setProperty('cursor', 'pointer', 'important');
        });
    }
    
    // Create backdrop
    function createBackdrop() {
        let backdrop = document.getElementById('cmp-backdrop');
        if (!backdrop) {
            backdrop = document.createElement('div');
            backdrop.id = 'cmp-backdrop';
            backdrop.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.7);
                z-index: ${baseZIndex};
            `;
            document.body.appendChild(backdrop);
        }
        return backdrop;
    }
    
    // Process ONLY the first consent popup
    function processFirstPopup() {
        const firstPopup = document.querySelector('div[data-ezoic-role="privacy-policy"]');
        
        if (firstPopup && firstPopup.style.display !== 'none' && !firstPopup.dataset.cmpStyled) {
            createBackdrop();
            styleFirstPopup(firstPopup);
            firstPopup.dataset.cmpStyled = 'true';
            console.log('CMP Fix: Styled first popup');
        }
        
        // Check if first popup is hidden - remove backdrop
        if (!firstPopup || firstPopup.style.display === 'none') {
            removeBackdrop();
        }
    }
    
    // Watch for DOM changes
    const observer = new MutationObserver(() => {
        processFirstPopup();
    });
    
    observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['style']
    });
    
    // Initial check
    processFirstPopup();
    
    // Periodic check
    setInterval(processFirstPopup, 500);
    
    console.log('CMP Fix: Script loaded (first popup only)');
})();
