import React, { createContext, useContext, useState, useEffect } from 'react';

/**
 * Theme Context for managing dark/light mode across the application
 * 
 * This context provides theme state and toggle functionality to all components
 * in the Aircraft Health Monitoring Dashboard.
 * 
 * @author Aircraft Monitoring Team
 * @version 1.0.0
 */

// Define theme types
export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark'
};

// Create the theme context
const ThemeContext = createContext({
  theme: THEMES.DARK,
  toggleTheme: () => {},
  isDarkMode: true
});

/**
 * Custom hook to use the theme context
 * @returns {Object} Theme context value
 */
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

/**
 * Theme Provider component that wraps the application
 * Manages theme state and persists user preference in localStorage
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 */
export const ThemeProvider = ({ children }) => {
  // Initialize theme from localStorage or system preference
  const [theme, setTheme] = useState(() => {
    try {
      // First check localStorage for saved preference
      const savedTheme = localStorage.getItem('aircraftMonitoring_theme');
      if (savedTheme && Object.values(THEMES).includes(savedTheme)) {
        return savedTheme;
      }
      
      // Fall back to system preference
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return THEMES.DARK;
      }
      
      return THEMES.DARK; // Default to dark mode for aviation dashboards
    } catch (error) {
      console.error('Error reading theme preference:', error);
      return THEMES.DARK;
    }
  });

  // Update HTML class and localStorage when theme changes
  useEffect(() => {
    try {
      // Update document class for Tailwind CSS dark mode
      if (theme === THEMES.DARK) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      
      // Save preference to localStorage
      localStorage.setItem('aircraftMonitoring_theme', theme);
    } catch (error) {
      console.error('Error saving theme preference:', error);
    }
  }, [theme]);

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleSystemThemeChange = (e) => {
      // Only update if user hasn't manually set a preference
      const savedTheme = localStorage.getItem('aircraftMonitoring_theme');
      if (!savedTheme) {
        setTheme(e.matches ? THEMES.DARK : THEMES.LIGHT);
      }
    };

    mediaQuery.addEventListener('change', handleSystemThemeChange);
    
    return () => {
      mediaQuery.removeEventListener('change', handleSystemThemeChange);
    };
  }, []);

  /**
   * Toggle between light and dark themes
   */
  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === THEMES.DARK ? THEMES.LIGHT : THEMES.DARK);
  };

  const value = {
    theme,
    toggleTheme,
    isDarkMode: theme === THEMES.DARK
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContext;
