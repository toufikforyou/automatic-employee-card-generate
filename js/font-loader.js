// This helps ensure fonts are loaded before rendering
document.fonts.ready.then(function() {
    console.log('Fonts are loaded');
    // Initialize your app here if needed
});

// Function to check if specific font is loaded
function isFontLoaded(fontFamily) {
    return document.fonts.check(`12px ${fontFamily}`);
} 