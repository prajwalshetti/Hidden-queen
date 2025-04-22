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
          <div className="md:hidden flex flex-col space-y-1 pb-4">
            <NavItem to="/dashboard" end><Home className="w-4 h-4" /><span>Home</span></NavItem>
            <NavItem to="/dashboard/rules"><BookOpen className="w-4 h-4" /><span>Rules</span></NavItem>
            <NavItem to="/dashboard/about"><Info className="w-4 h-4" /><span>About</span></NavItem>
            <NavItem to="/dashboard/feedback"><MessageSquare className="w-4 h-4" /><span>Feedback</span></NavItem>
            <NavItem to="/dashboard/settings"><Settings className="w-4 h-4" /><span>Settings</span></NavItem>
          </div>
        )}
      </div>
    </nav>
  );
}

export default NavBar;
