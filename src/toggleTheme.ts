

// @ts-ignore
document.getElementById('toggleThemeButton').addEventListener('click', function() {
    // Get the current theme from the <html> element
    const currentTheme = document.documentElement.getAttribute('data-theme');

    // Toggle between "dark" and "light" themes
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    // Set the new theme on the <html> element
    document.documentElement.setAttribute('data-theme', newTheme);
});
