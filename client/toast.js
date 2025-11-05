// Toast notification system
(function() {
    // Create toast container on page load
    let toastContainer = null;

    function getToastContainer() {
        if (!toastContainer) {
            toastContainer = document.createElement('div');
            toastContainer.className = 'toast-container';
            document.body.appendChild(toastContainer);
        }
        return toastContainer;
    }

    // Icons for different toast types
    const icons = {
        success: '✓',
        error: '✕',
        info: 'ℹ',
        warning: '⚠'
    };

    // Show toast notification
    window.showToast = function(message, type = 'info', duration = 4000) {
        const container = getToastContainer();

        // Create toast element
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;

        // Create toast content
        toast.innerHTML = `
            <div class="toast-icon">${icons[type] || icons.info}</div>
            <div class="toast-message">${message}</div>
            <button class="toast-close" aria-label="Close">&times;</button>
        `;

        // Add to container
        container.appendChild(toast);

        // Close button handler
        const closeBtn = toast.querySelector('.toast-close');
        closeBtn.addEventListener('click', () => {
            removeToast(toast);
        });

        // Auto remove after duration
        if (duration > 0) {
            setTimeout(() => {
                removeToast(toast);
            }, duration);
        }
    };

    function removeToast(toast) {
        toast.classList.add('hiding');
        setTimeout(() => {
            if (toast.parentElement) {
                toast.parentElement.removeChild(toast);
            }
        }, 300); // Match animation duration
    }

    // Convenience methods
    window.toast = {
        success: (message, duration) => showToast(message, 'success', duration),
        error: (message, duration) => showToast(message, 'error', duration),
        info: (message, duration) => showToast(message, 'info', duration),
        warning: (message, duration) => showToast(message, 'warning', duration)
    };
})();
