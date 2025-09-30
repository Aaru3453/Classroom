import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const centerLinks = [
    { name: "Dashboard", path: "/dashboard", icon: "fa-chart-line" },
    { name: "Create-Timetable", path: "/create-timetable", icon: "fa-calendar-plus" },
    { name: "Subject", path: "/subject", icon: "fa-solid fa-book-open-reader" },
    { name: "Classrooms", path: "/classrooms", icon: "fa-solid fa-chalkboard-user" },
    { name: "Faculty", path: "/faculty", icon: "fa-solid fa-users" },
    { name: "StudentBatches", path: "/studentBatches", icon: "fa-solid fa-clipboard-list" },
  ];

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Function to get user initials for avatar
  const getUserInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Handle logo click - always go to landing page
  const handleLogoClick = (e) => {
    e.preventDefault();
    navigate("/");
  };

  return (
    <nav className="bg-blue-600 shadow-lg fixed top-0 left-0 w-full z-50">
      <div className="flex items-center justify-between h-16 px-0">
        
        {/* Left side (EduScheduler Logo - Clickable) */}
        <button 
          onClick={handleLogoClick}
          className="flex items-center space-x-2 pl-4 hover:opacity-80 transition-opacity"
        >
          <i className="fas fa-calendar-check text-white text-2xl"></i>
          <span className="text-white font-bold text-2xl">EduScheduler</span>
        </button>

        {/* Center Links (Desktop) - Only show when user is logged in */}
        {user && (
          <div className="hidden md:flex flex-1 justify-center">
            <div className="flex items-baseline space-x-2">
              {centerLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  className={({ isActive }) =>
                    `px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center space-x-2 ${
                      isActive
                        ? "bg-white text-blue-600 shadow-md"
                        : "text-blue-100 hover:bg-blue-500 hover:text-white"
                    }`
                  }
                >
                  <i className={`fas ${link.icon} w-4`}></i>
                  <span>{link.name}</span>
                </NavLink>
              ))}
            </div>
          </div>
        )}

        {/* Right side (Profile/Login/Register) */}
        <div className="hidden md:flex items-center space-x-2 pr-4">
          {user ? (
            <>
              {/* User info with avatar and name */}
              <div className="flex items-center space-x-3">
                {/* User Avatar with Initials */}
                <div className="w-8 h-8 bg-blue-400 rounded-full flex items-center justify-center text-white text-sm font-bold">
                  {getUserInitials(user.name)}
                </div>
                
                {/* Welcome message with user name */}
                <div className="flex flex-col">
                  <span className="text-blue-100 text-sm font-semibold">
                    {user.name}
                  </span>
                  <span className="text-blue-200 text-xs">
                    {user.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'User'}
                  </span>
                </div>
              </div>
              
              {/* Profile link */}
              <NavLink
                to="/profile"
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center space-x-2 ${
                    isActive
                      ? "bg-white text-blue-600 shadow-md"
                      : "text-blue-100 hover:bg-blue-500 hover:text-white"
                  }`
                }
              >
                <i className="fa-solid fa-id-badge w-4"></i>
                <span>Profile</span>
              </NavLink>
            </>
          ) : (
            <>
              {/* Login button */}
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center space-x-2 ${
                    isActive
                      ? "bg-white text-blue-600 shadow-md"
                      : "text-blue-100 hover:bg-blue-500 hover:text-white"
                  }`
                }
              >
                <i className="fa-solid fa-right-to-bracket w-4"></i>
                <span>Login</span>
              </NavLink>
              
              {/* Register button */}
              <NavLink
                to="/register"
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center space-x-2 ${
                    isActive
                      ? "bg-white text-blue-600 shadow-md"
                      : "text-blue-100 hover:bg-blue-500 hover:text-white"
                  }`
                }
              >
                <i className="fa-solid fa-user-plus w-4"></i>
                <span>Register</span>
              </NavLink>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden pr-4">
          <button
            onClick={toggleMenu}
            className="inline-flex items-center justify-center p-2 rounded-md text-blue-100 hover:text-white hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-white"
          >
            <span className="sr-only">Open main menu</span>
            <i className={`fas ${isMenuOpen ? "fa-times" : "fa-bars"} text-lg`}></i>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden transition-all duration-300 ease-in-out ${
          isMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0 overflow-hidden"
        }`}
      >
        <div className="px-2 pt-2 pb-4 space-y-1 bg-blue-600 shadow-inner">
          {/* Show navigation links only when user is logged in */}
          {user && (
            <>
              {/* User info in mobile menu */}
              <div className="px-4 py-3 border-b border-blue-500 mb-2">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-400 rounded-full flex items-center justify-center text-white font-bold">
                    {getUserInitials(user.name)}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-white font-semibold">{user.name}</span>
                    <span className="text-blue-200 text-sm">
                      {user.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'User'}
                    </span>
                  </div>
                </div>
              </div>

              {centerLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={({ isActive }) =>
                    `block px-4 py-3 rounded-lg text-base font-semibold transition-colors flex items-center space-x-3 ${
                      isActive
                        ? "bg-white text-blue-600 shadow-md"
                        : "text-blue-100 hover:bg-blue-500 hover:text-white"
                    }`
                  }
                >
                  <i className={`fas ${link.icon} w-5 text-center`}></i>
                  <span>{link.name}</span>
                </NavLink>
              ))}

              {/* Profile in mobile menu */}
              <NavLink
                to="/profile"
                onClick={() => setIsMenuOpen(false)}
                className={({ isActive }) =>
                  `block px-4 py-3 rounded-lg text-base font-semibold transition-colors flex items-center space-x-3 ${
                    isActive
                      ? "bg-white text-blue-600 shadow-md"
                      : "text-blue-100 hover:bg-blue-500 hover:text-white"
                  }`
                }
              >
                <i className="fa-solid fa-id-badge w-5 text-center"></i>
                <span>Profile</span>
              </NavLink>
            </>
          )}

          {/* Show login/register when user is not logged in */}
          {!user && (
            <>
              <NavLink
                to="/login"
                onClick={() => setIsMenuOpen(false)}
                className={({ isActive }) =>
                  `block px-4 py-3 rounded-lg text-base font-semibold transition-colors flex items-center space-x-3 ${
                    isActive
                      ? "bg-white text-blue-600 shadow-md"
                      : "text-blue-100 hover:bg-blue-500 hover:text-white"
                  }`
                }
              >
                <i className="fa-solid fa-right-to-bracket w-5 text-center"></i>
                <span>Login</span>
              </NavLink>

              <NavLink
                to="/register"
                onClick={() => setIsMenuOpen(false)}
                className={({ isActive }) =>
                  `block px-4 py-3 rounded-lg text-base font-semibold transition-colors flex items-center space-x-3 ${
                    isActive
                      ? "bg-white text-blue-600 shadow-md"
                      : "text-blue-100 hover:bg-blue-500 hover:text-white"
                  }`
                }
              >
                <i className="fa-solid fa-user-plus w-5 text-center"></i>
                <span>Register</span>
              </NavLink>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;