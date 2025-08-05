import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

/**
 * Theme Toggle Button Component
 * 
 * Provides a user-friendly toggle button to switch between dark and light modes.
 * Features smooth transitions and clear visual feedback.
 * 
 * @author Aircraft Monitoring Team
 * @version 1.0.0
 */
const ThemeToggle = ({ className = '' }) => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`
        relative inline-flex items-center justify-center
        w-12 h-6 rounded-full transition-all duration-300 ease-in-out
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-aviation-blue
        dark:focus:ring-offset-gray-800
        ${isDarkMode 
          ? 'bg-aviation-blue hover:bg-blue-600' 
          : 'bg-gray-300 hover:bg-gray-400'
        }
        ${className}
      `}
      title={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
      aria-label={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
    >
      {/* Toggle Circle */}
      <span
        className={`
          inline-block w-4 h-4 rounded-full transition-transform duration-300 ease-in-out
          transform bg-white shadow-lg
          ${isDarkMode ? 'translate-x-3' : '-translate-x-3'}
        `}
      >
        {/* Icon inside the circle */}
        <span className="flex items-center justify-center w-full h-full">
          {isDarkMode ? (
            // Moon icon for dark mode
            <svg className="w-2.5 h-2.5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"
                clipRule="evenodd"
              />
            </svg>
          ) : (
            // Sun icon for light mode
            <svg className="w-2.5 h-2.5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </span>
      </span>
    </button>
  );
};

/**
 * Alternative Theme Toggle Button with Text Labels
 * For cases where more explicit labeling is needed
 */
export const ThemeToggleWithLabel = ({ showLabel = true, className = '' }) => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      {showLabel && (
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {isDarkMode ? 'Dark' : 'Light'}
        </span>
      )}
      <ThemeToggle />
      {showLabel && (
        <span className="text-sm text-gray-500 dark:text-gray-400">
          Mode
        </span>
      )}
    </div>
  );
};

export default ThemeToggle;
