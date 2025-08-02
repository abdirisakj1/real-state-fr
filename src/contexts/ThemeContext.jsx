import React, { createContext, useContext, useReducer, useEffect } from 'react';

const ThemeContext = createContext();

// Theme reducer
const themeReducer = (state, action) => {
  switch (action.type) {
    case 'TOGGLE_THEME':
      return {
        ...state,
        isDark: !state.isDark
      };
    case 'SET_THEME':
      return {
        ...state,
        isDark: action.payload
      };
    case 'TOGGLE_SIDEBAR':
      return {
        ...state,
        sidebarCollapsed: !state.sidebarCollapsed
      };
    case 'SET_SIDEBAR':
      return {
        ...state,
        sidebarCollapsed: action.payload
      };
    default:
      return state;
  }
};

// Initial state
const initialState = {
  isDark: localStorage.getItem('theme') === 'dark' || 
          (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches),
  sidebarCollapsed: localStorage.getItem('sidebarCollapsed') === 'true' || false
};

export const ThemeProvider = ({ children }) => {
  const [state, dispatch] = useReducer(themeReducer, initialState);

  // Apply theme to document
  useEffect(() => {
    if (state.isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [state.isDark]);

  // Save sidebar state
  useEffect(() => {
    localStorage.setItem('sidebarCollapsed', state.sidebarCollapsed.toString());
  }, [state.sidebarCollapsed]);

  // Toggle theme
  const toggleTheme = () => {
    dispatch({ type: 'TOGGLE_THEME' });
  };

  // Set specific theme
  const setTheme = (isDark) => {
    dispatch({ type: 'SET_THEME', payload: isDark });
  };

  // Toggle sidebar
  const toggleSidebar = () => {
    dispatch({ type: 'TOGGLE_SIDEBAR' });
  };

  // Set sidebar state
  const setSidebar = (collapsed) => {
    dispatch({ type: 'SET_SIDEBAR', payload: collapsed });
  };

  const value = {
    ...state,
    toggleTheme,
    setTheme,
    toggleSidebar,
    setSidebar
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
