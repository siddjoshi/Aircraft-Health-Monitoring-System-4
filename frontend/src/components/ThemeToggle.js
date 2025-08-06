import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

/**
 * Theme Toggle component for switching between dark and light modes
 * 
 * Provides an accessible button to toggle themes with smooth transitions
 * and appropriate visual indicators.
 * 
 * @author Aircraft Monitoring Team
 * @version 1.0.0
 */
const ThemeToggle = () => {
  const { toggleTheme, isDark } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`
        relative inline-flex items-center justify-center
        w-10 h-10 rounded-lg transition-all duration-200 ease-in-out
        hover:scale-105 focus:outline-none focus:ring-2 focus:ring-aviation-blue
        ${isDark 
          ? 'bg-card-bg border border-border-color text-yellow-400 hover:bg-gray-700' 
          : 'bg-white border border-gray-300 text-gray-600 hover:bg-gray-50'
        }
      `}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      <div className="relative">
        {isDark ? (
          <Sun className="w-5 h-5 transition-transform duration-200 rotate-0" />
        ) : (
          <Moon className="w-5 h-5 transition-transform duration-200 rotate-0" />
        )}
      </div>
    </button>
  );
};

export default ThemeToggle;