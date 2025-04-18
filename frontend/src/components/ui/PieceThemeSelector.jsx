import React from "react";
import { usePieceTheme } from "../../context/PieceThemeContext";  // Adjust path based on your project structure

const options = ["kosal", "anarcandy", "alpha", "spatial"];  // The list of theme options

const PieceThemeSelector = () => {
  const { pieceTheme, setPieceTheme } = usePieceTheme();  // Access current theme and setter function

  return (
    <select
      value={pieceTheme}  // Display the current theme
      onChange={(e) => setPieceTheme(e.target.value)}  // Update the theme when the user selects a new one
      className="w-64 p-2.5 bg-gray-800 text-white rounded-lg border border-gray-700 shadow-lg hover:border-purple-500 transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none cursor-pointer font-medium"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%239CA3AF'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "right 0.75rem center",
        backgroundSize: "1rem"
      }}
    >
      {options.map((opt) => (
        <option key={opt} value={opt} className="bg-gray-800 text-white py-2 hover:bg-gray-700">
          {opt}  {/* Display theme options */}
        </option>
      ))}
    </select>
  );
};

export default PieceThemeSelector;
