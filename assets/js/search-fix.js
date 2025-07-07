// Fix for search functionality
document.addEventListener('DOMContentLoaded', function() {
    // Get original functions if they exist
    const originalDisplaySearch = window.displaySearch;
    const originalHideSearch = window.hideSearch;
    
    // Override displaySearch to properly show the search modal
    window.displaySearch = function() {
        const wrapper = document.getElementById("search-wrapper");
        const input = document.getElementById("search-query");
        
        if (wrapper) {
            // Remove invisible class AND set visibility
            wrapper.classList.remove('invisible');
            wrapper.style.visibility = 'visible';
            document.body.style.overflow = 'hidden';
            
            // Focus input after a small delay to ensure modal is visible
            setTimeout(() => {
                if (input) input.focus();
            }, 100);
        }
        
        // Call original function if it exists
        if (originalDisplaySearch && typeof originalDisplaySearch === 'function') {
            originalDisplaySearch();
        }
    };
    
    // Override hideSearch to properly hide the search modal
    window.hideSearch = function() {
        const wrapper = document.getElementById("search-wrapper");
        
        if (wrapper) {
            // Add invisible class AND set visibility
            wrapper.classList.add('invisible');
            wrapper.style.visibility = 'hidden';
            document.body.style.overflow = 'visible';
        }
        
        // Call original function if it exists
        if (originalHideSearch && typeof originalHideSearch === 'function') {
            originalHideSearch();
        }
    };
});