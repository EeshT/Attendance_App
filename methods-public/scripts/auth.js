export const Auth = {
    // Check if user is authenticated
    async checkAuth() {
        try {
            const response = await fetch('/api/check-auth');
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Auth check failed:', error);
            return { authenticated: false };
        }
    },

    // Redirect to login if not authenticated
    async requireAuth() {
        const authData = await this.checkAuth();
        if (!authData.authenticated) {
            this.redirectToLogin();
            return false;
        }
        return authData;
    },

    // Redirect to login page
    redirectToLogin() {
        window.location.replace('/login'); // Use replace to prevent back button
    },

    // Logout user
    async logout() {
        try {
            await fetch('/api/logout', { method: 'POST' });
        } catch (error) {
            console.error('Logout failed:', error);
        }
        this.redirectToLogin();
    }
};

// Prevent back button after logout
window.addEventListener('pageshow', function(event) {
    if (event.persisted) {
        // Page loaded from cache, recheck auth
        Auth.checkAuth().then(data => {
            if (!data.authenticated) {
                Auth.redirectToLogin();
            }
        });
    }
});