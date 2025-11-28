import { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext();

const themes = {
  light: {
    name: "light",
    primary: "#3b82f6",
    secondary: "#667eea",
    accent: "#764ba2",
    background: "#f8fafc",
    text: "#1e293b",
    textSecondary: "#64748b",
    border: "#e2e8f0",
    card: "#ffffff",
    headerGradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  },
  dark: {
    name: "dark",
    primary: "#60a5fa",
    secondary: "#818cf8",
    accent: "#a855f7",
    background: "#0f172a",
    text: "#f1f5f9",
    textSecondary: "#cbd5e1",
    border: "#334155",
    card: "#1e293b",
    headerGradient: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
  },
  purple: {
    name: "purple",
    primary: "#a855f7",
    secondary: "#d946ef",
    accent: "#ec4899",
    background: "#faf5ff",
    text: "#581c87",
    textSecondary: "#7c3aed",
    border: "#ddd6fe",
    card: "#ffffff",
    headerGradient: "linear-gradient(135deg, #a855f7 0%, #d946ef 100%)",
  },
  neon: {
    name: "neon",
    primary: "#00ff00",
    secondary: "#00ffff",
    accent: "#ff00ff",
    background: "#0a0e27",
    text: "#00ff00",
    textSecondary: "#00ffff",
    border: "#00ff00",
    card: "#1a1f3a",
    headerGradient: "linear-gradient(135deg, #00ff00 0%, #00ffff 100%)",
  },
  blue: {
    name: "blue",
    primary: "#0ea5e9",
    secondary: "#0284c7",
    accent: "#06b6d4",
    background: "#f0f9ff",
    text: "#0c2d5b",
    textSecondary: "#0369a1",
    border: "#bae6fd",
    card: "#ffffff",
    headerGradient: "linear-gradient(135deg, #0284c7 0%, #06b6d4 100%)",
  },
  ocean: {
    name: "ocean",
    primary: "#0369a1",
    secondary: "#0284c7",
    accent: "#00d9ff",
    background: "#0c1117",
    text: "#e0f2fe",
    textSecondary: "#7dd3fc",
    border: "#164e63",
    card: "#082f49",
    headerGradient: "linear-gradient(135deg, #0369a1 0%, #0284c7 100%)",
  },
  sunset: {
    name: "sunset",
    primary: "#f97316",
    secondary: "#fb923c",
    accent: "#fbbf24",
    background: "#fffbeb",
    text: "#7c2d12",
    textSecondary: "#d97706",
    border: "#fed7aa",
    card: "#ffffff",
    headerGradient: "linear-gradient(135deg, #f97316 0%, #fb923c 100%)",
  },
};

export const ThemeProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    return savedTheme || "light";
  });

  useEffect(() => {
    localStorage.setItem("theme", currentTheme);
    applyTheme(currentTheme);
  }, [currentTheme]);

  const applyTheme = (themeName) => {
    const theme = themes[themeName];
    const root = document.documentElement;

    Object.keys(theme).forEach((key) => {
      root.style.setProperty(`--color-${key.toLowerCase()}`, theme[key]);
    });
  };

  const changeTheme = (themeName) => {
    if (themes[themeName]) {
      setCurrentTheme(themeName);
    }
  };

  const value = {
    currentTheme,
    changeTheme,
    themes: Object.keys(themes),
    themeColors: themes[currentTheme],
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
};
