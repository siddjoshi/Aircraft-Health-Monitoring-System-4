import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ThemeProvider, useTheme } from '../contexts/ThemeContext';

// Test component that uses the theme context
const TestComponent = () => {
  const { theme, toggleTheme, isDark, isLight } = useTheme();
  
  return (
    <div>
      <span data-testid="current-theme">{theme}</span>
      <span data-testid="is-dark">{isDark ? 'true' : 'false'}</span>
      <span data-testid="is-light">{isLight ? 'true' : 'false'}</span>
      <button data-testid="toggle-theme" onClick={toggleTheme}>
        Toggle Theme
      </button>
    </div>
  );
};

describe('ThemeContext', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    // Clear document classes
    document.documentElement.className = '';
  });

  test('provides default theme state', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    expect(screen.getByTestId('current-theme')).toHaveTextContent('dark');
    expect(screen.getByTestId('is-dark')).toHaveTextContent('true');
    expect(screen.getByTestId('is-light')).toHaveTextContent('false');
  });

  test('toggles theme correctly', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    const toggleButton = screen.getByTestId('toggle-theme');
    
    // Initially dark
    expect(screen.getByTestId('current-theme')).toHaveTextContent('dark');
    
    // Toggle to light
    fireEvent.click(toggleButton);
    expect(screen.getByTestId('current-theme')).toHaveTextContent('light');
    expect(screen.getByTestId('is-dark')).toHaveTextContent('false');
    expect(screen.getByTestId('is-light')).toHaveTextContent('true');
    
    // Toggle back to dark
    fireEvent.click(toggleButton);
    expect(screen.getByTestId('current-theme')).toHaveTextContent('dark');
    expect(screen.getByTestId('is-dark')).toHaveTextContent('true');
    expect(screen.getByTestId('is-light')).toHaveTextContent('false');
  });

  test('persists theme to localStorage', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    const toggleButton = screen.getByTestId('toggle-theme');
    
    // Toggle to light theme
    fireEvent.click(toggleButton);
    
    // Check localStorage
    expect(localStorage.getItem('aircraft-theme')).toBe('light');
    
    // Toggle back to dark theme
    fireEvent.click(toggleButton);
    
    // Check localStorage
    expect(localStorage.getItem('aircraft-theme')).toBe('dark');
  });

  test('applies theme class to document element', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    const toggleButton = screen.getByTestId('toggle-theme');
    
    // Initially should have dark class
    expect(document.documentElement.classList.contains('dark')).toBe(true);
    
    // Toggle to light
    fireEvent.click(toggleButton);
    expect(document.documentElement.classList.contains('light')).toBe(true);
    expect(document.documentElement.classList.contains('dark')).toBe(false);
    
    // Toggle back to dark
    fireEvent.click(toggleButton);
    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(document.documentElement.classList.contains('light')).toBe(false);
  });

  test('throws error when useTheme is used outside ThemeProvider', () => {
    // Suppress console.error for this test
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    expect(() => {
      render(<TestComponent />);
    }).toThrow('useTheme must be used within a ThemeProvider');
    
    consoleSpy.mockRestore();
  });
});