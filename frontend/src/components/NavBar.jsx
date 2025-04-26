import { NavLink } from "react-router-dom";
import { Home, Info, BookOpen, MessageSquare, Menu, X, Settings } from 'lucide-react';
import { useState } from "react";

function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const NavItem = ({ to, children, end = false }) => (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
          isActive
            ? "text-blue-400 bg-gray-800 shadow-md font-semibold"
            : "text-white hover:text-blue-400 hover:bg-gray-700"
        }`
      }
      onClick={() => setMenuOpen(false)} // close menu on click
    >
      {children}
    </NavLink>
  );

  return (
    <nav className="top-0 z-50 w-full backdrop-blur-sm bg-gray-900 border-b border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Mobile toggle button */}
          <div className="md:hidden">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-white focus:outline-none"
            >
              {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center space-x-1">
            <NavItem to="/dashboard" end><Home className="w-4 h-4" /><span>Home</span></NavItem>
            <NavItem to="/dashboard/rules"><BookOpen className="w-4 h-4" /><span>Rules</span></NavItem>
            <NavItem to="/dashboard/about"><Info className="w-4 h-4" /><span>About</span></NavItem>
            <NavItem to="/dashboard/feedback"><MessageSquare className="w-4 h-4" /><span>Feedback</span></NavItem>
            <NavItem to="/dashboard/settings"><Settings className="w-4 h-4" /><span>Settings</span></NavItem>
          </div>
        </div>

{/* Mobile dropdown nav */}
{menuOpen && (
  <div 
    className="md:hidden fixed top-16 right-0 left-0 bg-gray-900 z-50 shadow-lg border-t border-gray-800 animate-in"
    style={{
      animation: "slideDown 0.3s ease-out forwards",
      maxHeight: "calc(100vh - 4rem)",
      overflowY: "auto"
    }}
  >
    <div className="container mx-auto px-4 py-3">
      <div className="flex flex-col space-y-1">
        <NavItem to="/dashboard" end onClick={() => setMenuOpen(false)}>
          <div className="flex items-center px-3 py-2 rounded-lg transition-all duration-200 hover:bg-blue-900 hover:bg-opacity-30">
            <Home className="w-4 h-4 mr-3" />
            <span>Home</span>
          </div>
        </NavItem>
        
        <NavItem to="/dashboard/rules" onClick={() => setMenuOpen(false)}>
          <div className="flex items-center px-3 py-2 rounded-lg transition-all duration-200 hover:bg-blue-900 hover:bg-opacity-30">
            <BookOpen className="w-4 h-4 mr-3" />
            <span>Rules</span>
          </div>
        </NavItem>
        
        <NavItem to="/dashboard/about" onClick={() => setMenuOpen(false)}>
          <div className="flex items-center px-3 py-2 rounded-lg transition-all duration-200 hover:bg-blue-900 hover:bg-opacity-30">
            <Info className="w-4 h-4 mr-3" />
            <span>About</span>
          </div>
        </NavItem>
        
        <NavItem to="/dashboard/feedback" onClick={() => setMenuOpen(false)}>
          <div className="flex items-center px-3 py-2 rounded-lg transition-all duration-200 hover:bg-blue-900 hover:bg-opacity-30">
            <MessageSquare className="w-4 h-4 mr-3" />
            <span>Feedback</span>
          </div>
        </NavItem>
        
        <NavItem to="/dashboard/settings" onClick={() => setMenuOpen(false)}>
          <div className="flex items-center px-3 py-2 rounded-lg transition-all duration-200 hover:bg-blue-900 hover:bg-opacity-30">
            <Settings className="w-4 h-4 mr-3" />
            <span>Settings</span>
          </div>
        </NavItem>
      </div>
    </div>

    {/* Optional: Backdrop with click-out-to-close functionality */}
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 -z-10" 
      onClick={() => setMenuOpen(false)}
      style={{ animation: "fadeIn 0.3s ease-out forwards" }}
    />

    <style jsx>{`
      @keyframes slideDown {
        from { transform: translateY(-20px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
      }
      
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 0.5; }
      }
      
      .animate-in {
        opacity: 0;
      }
    `}</style>
  </div>
)}
      </div>
    </nav>
  );
}

export default NavBar;
