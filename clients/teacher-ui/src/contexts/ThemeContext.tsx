import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiService } from '../utils/api';

interface ThemeContextType {
  theme: 'light' | 'dark' | 'auto';
  isDark: boolean;
  toggleTheme: () => void;
  setTheme: (theme: 'light' | 'dark' | 'auto') => void;
  loading: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setThemeState] = useState<'light' | 'dark' | 'auto'>('light');
  const [isDark, setIsDark] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load theme from API on mount
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const response = await apiService.getUserPreferences();
        const savedTheme = response.data.theme || 'light';
        setThemeState(savedTheme);
        
        // Apply theme
        applyTheme(savedTheme);
      } catch (error) {
        console.error('Failed to load theme preference:', error);
        // Fallback to localStorage
        const localTheme = localStorage.getItem('theme') as 'light' | 'dark' | 'auto' || 'light';
        setThemeState(localTheme);
        applyTheme(localTheme);
      } finally {
        setLoading(false);
      }
    };

    loadTheme();
  }, []);

  // Apply theme to the document
  const applyTheme = (themeValue: 'light' | 'dark' | 'auto') => {
    let effectiveTheme = themeValue;
    
    if (themeValue === 'auto') {
      // Use system preference
      effectiveTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    
    setIsDark(effectiveTheme === 'dark');
    
    if (effectiveTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // Listen for system theme changes when auto is selected
  useEffect(() => {
    if (theme === 'auto') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => applyTheme('auto');
      
      mediaQuery.addListener(handleChange);
      return () => mediaQuery.removeListener(handleChange);
    }
  }, [theme]);

  const setTheme = async (newTheme: 'light' | 'dark' | 'auto') => {
    try {
      // Update backend
      await apiService.updateTheme(newTheme);
      
      // Update local state
      setThemeState(newTheme);
      applyTheme(newTheme);
      
      // Backup to localStorage
      localStorage.setItem('theme', newTheme);
    } catch (error) {
      console.error('Failed to update theme:', error);
      
      // Fallback to localStorage only
      setThemeState(newTheme);
      applyTheme(newTheme);
      localStorage.setItem('theme', newTheme);
    }
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  };

  const value: ThemeContextType = {
    theme,
    isDark,
    toggleTheme,
    setTheme,
    loading,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
