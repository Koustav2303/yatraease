import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, User, LogOut, ChevronDown, Calendar, Settings } from 'lucide-react';

const Navbar = ({ user, setUser }) => {
  const [isOpen, setIsOpen] = useState(false); // Mobile menu state
  const [showProfileMenu, setShowProfileMenu] = useState(false); // Dropdown state

  const handleLogout = () => {
    setUser(null); // Clear global user state
    setShowProfileMenu(false); // Close menu
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          
          {/* 1. Logo */}
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-primary">
              Yatra<span className="text-secondary">Ease</span>
            </Link>
          </div>

          {/* 2. Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-primary font-medium">Home</Link>
            <Link to="/flights" className="text-gray-700 hover:text-primary font-medium">Flights</Link>
            <Link to="/trains" className="text-gray-700 hover:text-primary font-medium">Trains</Link>
            <Link to="/food" className="text-gray-700 hover:text-primary font-medium">E-Catering</Link>
            
            {/* 3. Conditional Authentication UI */}
            {user ? (
              // --- STATE A: LOGGED IN (User Avatar + Dropdown) ---
              <div className="relative">
                <button 
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center gap-2 focus:outline-none"
                >
                  {/* Avatar Circle: Shows Image if available, else Initials */}
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full text-white flex items-center justify-center font-bold shadow-md overflow-hidden border border-white">
                    {user.avatar && user.avatar.length > 2 ? (
                      <img src={user.avatar} alt="User" className="w-full h-full object-cover" />
                    ) : (
                      user.name.charAt(0).toUpperCase()
                    )}
                  </div>

                  {/* Name Text */}
                  <div className="text-left hidden lg:block">
                    <p className="text-sm font-bold text-gray-700">{user.name}</p>
                    <p className="text-xs text-gray-500">My Account</p>
                  </div>
                  <ChevronDown size={16} className="text-gray-400" />
                </button>

                {/* Dropdown Menu */}
                {showProfileMenu && (
                  <div className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-2xl py-2 border border-gray-100 animate-fade-in z-50">
                    {/* Header */}
                    <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                      <p className="text-sm font-bold text-gray-800">Hello, {user.name.split(' ')[0]}</p>
                      <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    </div>
                    
                    {/* Menu Links */}
                    <Link 
                      to="/my-bookings" 
                      onClick={() => setShowProfileMenu(false)}
                      className="block px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-primary flex items-center gap-2"
                    >
                      <Calendar size={16}/> My Bookings
                    </Link>
                    
                    <Link 
                      to="/profile" 
                      onClick={() => setShowProfileMenu(false)}
                      className="block px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-primary flex items-center gap-2"
                    >
                      <Settings size={16}/> Profile Settings
                    </Link>
                    
                    {/* Logout Button */}
                    <div className="border-t border-gray-100 mt-1">
                      <button 
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                      >
                        <LogOut size={16} /> Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              // --- STATE B: LOGGED OUT (Login Button) ---
              <Link to="/login" className="bg-primary text-white px-6 py-2 rounded-full flex items-center gap-2 hover:bg-blue-700 transition shadow-lg shadow-blue-200 font-bold">
                <User size={18} /> Login
              </Link>
            )}
          </div>
          
          {/* 4. Mobile Menu Button (Hamburger) */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-700">
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* 5. Mobile Dropdown Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t animate-fade-in-up">
          <Link to="/" className="block px-4 py-3 text-gray-700 border-b hover:bg-gray-50" onClick={() => setIsOpen(false)}>Home</Link>
          <Link to="/flights" className="block px-4 py-3 text-gray-700 border-b hover:bg-gray-50" onClick={() => setIsOpen(false)}>Flights</Link>
          <Link to="/trains" className="block px-4 py-3 text-gray-700 border-b hover:bg-gray-50" onClick={() => setIsOpen(false)}>Trains</Link>
          <Link to="/food" className="block px-4 py-3 text-gray-700 border-b hover:bg-gray-50" onClick={() => setIsOpen(false)}>Food on Train</Link>
          
          {user ? (
            <>
              <Link to="/my-bookings" className="block px-4 py-3 text-gray-700 border-b hover:bg-gray-50 font-bold" onClick={() => setIsOpen(false)}>My Bookings</Link>
              <Link to="/profile" className="block px-4 py-3 text-gray-700 border-b hover:bg-gray-50 font-bold" onClick={() => setIsOpen(false)}>Profile Settings</Link>
              <button onClick={() => { handleLogout(); setIsOpen(false); }} className="w-full text-left px-4 py-3 text-red-600 font-bold">Logout</button>
            </>
          ) : (
            <Link to="/login" className="block px-4 py-3 text-primary font-bold hover:bg-gray-50" onClick={() => setIsOpen(false)}>Login / Sign Up</Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;