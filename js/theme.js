/* theme.js */

document.addEventListener('DOMContentLoaded', () => {
  const themeButtons = document.querySelectorAll('.theme-btn');
  const root = document.documentElement;
  
  // Set theme helper
  const setTheme = (theme) => {
    if (theme === 'slate') {
      root.removeAttribute('data-theme');
    } else {
      root.setAttribute('data-theme', theme);
    }
    
    // Update active states on buttons
    themeButtons.forEach(btn => {
      if (btn.dataset.theme === theme) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
    
    // Save to localStorage
    localStorage.setItem('portfolio-theme', theme);
    
    // Dispatch custom event for parts of the app that depend on the theme (e.g. canvas background colors)
    const event = new CustomEvent('themechanged', { detail: { theme } });
    window.dispatchEvent(event);
  };
  
  // Load saved theme or default
  const savedTheme = localStorage.getItem('portfolio-theme');
  if (savedTheme) {
    setTheme(savedTheme);
  } else {
    // Check system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
      setTheme('light');
    } else {
      setTheme('slate'); // Slate is our default dark
    }
  }
  
  // Add click handlers
  themeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const theme = btn.dataset.theme;
      setTheme(theme);
    });
  });
});
