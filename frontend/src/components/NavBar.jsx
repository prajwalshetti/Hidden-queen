import { NavLink } from "react-router-dom";
import { Home, Info, BookOpen, MessageSquare, Menu, X, Settings } from 'lucide-react';
import { useState, useEffect } from "react";

function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Close menu when clicking outside
  useEffect(() => {
    if (!menuOpen) return;
    const handleClickOutside = (e) => {
      if (!e.target.closest('nav')) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [menuOpen]);

  const NavItem = ({ to, children, end = false }) => (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `flex items-center gap-2 px-4 py-3 md:py-2 rounded-lg transition-all duration-200 ${
          isActive
            ? "text-blue-400 bg-gray-800 shadow-md font-semibold"
            : "text-white hover:text-blue-300 hover:bg-gray-700"
        }`
      }
      onClick={() => setMenuOpen(false)}
    >
      {children}
    </NavLink>
  );
  
  // Mobile Bottom Tab NavItem
  const MobileTabItem = ({ to, icon, label, end = false }) => (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `flex flex-col items-center justify-center px-2 py-1 transition-all duration-200 ${
          isActive
            ? "text-blue-400 font-medium"
            : "text-gray-400"
        }`
      }
      onClick={() => setMenuOpen(false)}
    >
      {icon}
      <span className="text-xs mt-1">{label}</span>
    </NavLink>
  );

  return (
    <>
      {/* Main Navbar */}
      <nav className={`fixed top-0 left-0 right-0 z-[100] border-b border-gray-700 transition-all duration-300 ${
        scrolled
          ? "bg-gray-900 shadow-lg shadow-black/20"
          : "bg-gray-900"
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* Mobile toggle button */}
            <div className="md:hidden">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setMenuOpen(!menuOpen);
                }}
                className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-800 text-white focus:outline-none"
                aria-label="Toggle menu"
              >
                {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center space-x-1">
              <NavItem to="/" end><Home className="w-4 h-4" /><span>Home</span></NavItem>
              <NavItem to="/rules"><BookOpen className="w-4 h-4" /><span>Rules</span></NavItem>
              <NavItem to="/about"><Info className="w-4 h-4" /><span>About</span></NavItem>
              <NavItem to="/feedback"><MessageSquare className="w-4 h-4" /><span>Feedback</span></NavItem>
              <NavItem to="/settings"><Settings className="w-4 h-4" /><span>Settings</span></NavItem>
            </div>
          </div>

          {/* Mobile slide-in menu */}
          <div className={`md:hidden fixed left-0 top-16 bottom-0 w-64 z-[101] transition-transform duration-300 ease-in-out ${
            menuOpen ? 'translate-x-0' : '-translate-x-full'
          } bg-gray-900`}> 
            <div className="flex flex-col space-y-1 p-4 h-full">
              <NavItem to="/" end><Home className="w-5 h-5" /><span className="text-lg">Home</span></NavItem>
              <NavItem to="/rules"><BookOpen className="w-5 h-5" /><span className="text-lg">Rules</span></NavItem>
              <NavItem to="/about"><Info className="w-5 h-5" /><span className="text-lg">About</span></NavItem>
              <NavItem to="/feedback"><MessageSquare className="w-5 h-5" /><span className="text-lg">Feedback</span></NavItem>
              <NavItem to="/settings"><Settings className="w-5 h-5" /><span className="text-lg">Settings</span></NavItem>
            </div>
          </div>
        </div>
      </nav>
      
      {/* Spacer for fixed navbar */}
      <div className="sm:h-16"></div>
      
      {/* Bottom spacer */}
      <div className="md:hidden h-16"></div>
    </>
  );
}

export default NavBar;