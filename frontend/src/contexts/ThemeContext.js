import React, { createContext, useContext, useEffect, useState } from 'react';

/**
 * Theme Context for managing dark/light mode across the application
 * 
 * Provides theme state management with localStorage persistence
 * and system preference detection.
 * 
 * @author Aircraft Monitoring Team
 * @version 1.0.0
 */

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    // Get theme from localStorage or detect system preference
    const savedTheme = localStorage.getItem('aircraft-theme');
    if (savedTheme) {
      setTheme(savedTheme);
    } else {
      // Detect system preference (with fallback for testing environments)
      const prefersDark = window.matchMedia 
        ? window.matchMedia('(prefers-color-scheme: dark)').matches
        : true; // Default to dark mode if matchMedia is not available
      setTheme(prefersDark ? 'dark' : 'light');
    }
  }, []);

  useEffect(() => {
    // Apply theme to document and save to localStorage
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
    localStorage.setItem('aircraft-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'dark' ? 'light' : 'dark');
  };

  const value = {
    theme,
    toggleTheme,
    isDark: theme === 'dark',
    isLight: theme === 'light'
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};