import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { PieceThemeProvider } from './context/PieceThemeContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <PieceThemeProvider>
      <App />
    </PieceThemeProvider>
  </StrictMode>,
)
