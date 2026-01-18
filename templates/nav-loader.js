// Navigation Loader Script
// This script loads the centralized navigation and adjusts paths based on page depth
(function() {
    // Determine the base path based on the current page location
    function getBasePath() {
        const path = window.location.pathname;
        
        // Count the directory depth by checking how many folders we're in
        // Remove the filename (anything after the last /)
        const dirPath = path.substring(0, path.lastIndexOf('/') + 1);
        
        // Count non-empty directory segments
        const segments = dirPath.split('/').filter(s => s.length > 0);
        
        // If we're at root (no segments), return empty string
        if (segments.length === 0) {
            return '';
        }
        
        // If we're in a subdirectory (1+ segments), use ../
        return '../';
    }

    // Load and inject the navigation
    async function loadNavigation() {
        const basePath = getBasePath();
        const navPath = basePath + 'templates/nav.html';
        
        console.log('Loading navigation from:', navPath, 'with basePath:', basePath);
        
        try {
            const response = await fetch(navPath);
            if (!response.ok) {
                console.error('Failed to load navigation:', response.status, navPath);
                return;
            }
            
            let navHTML = await response.text();
            console.log('Navigation HTML loaded successfully');
            
            // Replace {{BASE_PATH}} placeholder with actual base path
            navHTML = navHTML.replace(/\{\{BASE_PATH\}\}/g, basePath);
            
            // Create a temporary container to hold the navigation HTML
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = navHTML;
            
            // Insert navigation elements at the beginning of body
            const body = document.body;
            while (tempDiv.firstChild) {
                body.insertBefore(tempDiv.firstChild, body.firstChild);
            }
            
            console.log('Navigation injected into page');
            
            // Load the navigation script after the nav is injected
            const script = document.createElement('script');
            script.src = basePath + 'templates/nav-script.js';
            document.body.appendChild(script);
            
            console.log('Navigation script loaded');
            
        } catch (error) {
            console.error('Error loading navigation:', error);
        }
    }

    // Load navigation when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadNavigation);
    } else {
        loadNavigation();
    }
})();
