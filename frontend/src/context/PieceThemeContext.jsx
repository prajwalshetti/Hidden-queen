import React, { createContext, useContext, useState, useEffect } from "react";

// Create a context for managing the piece theme
const PieceThemeContext = createContext();

export const PieceThemeProvider = ({ children }) => {
  // Check if there's a saved theme in localStorage, if not, default to 'kosal'
  const storedTheme = localStorage.getItem("pieceTheme");
  const [pieceTheme, setPieceTheme] = useState(storedTheme || "kosal");

  // Save the theme to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("pieceTheme", pieceTheme);
  }, [pieceTheme]);

  return (
    <PieceThemeContext.Provider value={{ pieceTheme, setPieceTheme }}>
      {children}
    </PieceThemeContext.Provider>
  );
};

// Custom hook for easy access to the piece theme context
export const usePieceTheme = () => useContext(PieceThemeContext);
