import React, { createContext, useState, useContext } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [isDark, setIsDark] = useState(true);

    const toggleTheme = () => setIsDark(!isDark);

    const theme = {
        isDark,
        background: isDark ? '#111521' : '#f8f9fa',
        text: isDark ? '#ffffff' : '#1a1a1a',
        textSecondary: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)',
        card: isDark ? 'rgba(255,255,255,0.05)' : '#ffffff',
        primary: '#2a60ea',
        border: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme, isDark }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);
