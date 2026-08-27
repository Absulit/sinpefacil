/**
 * Clears parameters from the url to avoid trigger a new sms
 */
export function clearParams(){
    if (window.location.search) {
            window.history.replaceState(
            {}, // State object (can store data, optional)  
            document.title, // Page title (optional, ignored by most browsers)  
            window.location.pathname // New URL (path only, no parameters)  
        );
    }
}
