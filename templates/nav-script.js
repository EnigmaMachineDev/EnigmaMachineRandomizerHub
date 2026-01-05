// Sidebar Navigation Script
(function() {
    const sidebar = document.getElementById('sidebar');
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const navCategoryBtns = document.querySelectorAll('.nav-category-btn');

    // Check if device is mobile
    function isMobile() {
        return window.innerWidth <= 768;
    }

    // Initialize sidebar state based on device
    function initializeSidebar() {
        if (isMobile()) {
            // Mobile: closed by default
            sidebar.classList.remove('open');
            sidebar.classList.add('closed');
            document.body.classList.remove('sidebar-open');
            document.body.classList.add('sidebar-closed');
        } else {
            // Desktop: open by default
            sidebar.classList.add('open');
            sidebar.classList.remove('closed');
            document.body.classList.add('sidebar-open');
            document.body.classList.remove('sidebar-closed');
        }
    }

    // Toggle sidebar
    sidebarToggle.addEventListener('click', () => {
        const isOpen = sidebar.classList.contains('open');
        
        if (isOpen) {
            sidebar.classList.remove('open');
            sidebar.classList.add('closed');
            document.body.classList.remove('sidebar-open');
            document.body.classList.add('sidebar-closed');
        } else {
            sidebar.classList.add('open');
            sidebar.classList.remove('closed');
            document.body.classList.add('sidebar-open');
            document.body.classList.remove('sidebar-closed');
        }
    });

    // Close sidebar when clicking outside (mobile only)
    document.addEventListener('click', (e) => {
        if (isMobile() && sidebar.classList.contains('open')) {
            if (!sidebar.contains(e.target) && !sidebarToggle.contains(e.target)) {
                sidebar.classList.remove('open');
                sidebar.classList.add('closed');
                document.body.classList.remove('sidebar-open');
                document.body.classList.add('sidebar-closed');
            }
        }
    });

    // Category dropdown functionality
    navCategoryBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const category = btn.parentElement;
            category.classList.toggle('expanded');
        });
    });

    // Reinitialize on window resize
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            initializeSidebar();
        }, 250);
    });

    // Initialize on page load
    initializeSidebar();
})();
