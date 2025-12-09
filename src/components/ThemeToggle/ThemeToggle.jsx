import React, { useContext } from 'react';
import './ThemeToggle.css';
import { Context } from '../../context/Context';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useContext(Context);

  return (
    <button 
      className="theme-toggle" 
      onClick={toggleTheme}
      title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      aria-label="Toggle theme"
    >
      <div className="theme-toggle-track">
        <span className="theme-icon sun-icon">☀️</span>
        <span className="theme-icon moon-icon">🌙</span>
        <div className={`theme-toggle-thumb ${theme}`}></div>
      </div>
    </button>
  );
};

export default ThemeToggle;
