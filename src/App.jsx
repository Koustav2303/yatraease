import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// --- COMPONENTS ---
import Navbar from './components/Navbar';
import DevNotice from './components/DevNotice'; // Top Banner (Work in Progress)
import OfferPopup from './components/OfferPopup'; // Bottom Right Popup (Discounts)

// --- PAGES ---
import Home from './pages/Home';
import Flights from './pages/Flights';
import Trains from './pages/Trains';
import Hotels from './pages/Hotels';
import Cabs from './pages/Cabs';
import Bus from './pages/Bus';
import FoodOnTrain from './pages/FoodOnTrain';
import Login from './pages/Login';
import MyBookings from './pages/MyBookings';
import ProfileSettings from './pages/ProfileSettings';

function App() {
  const [user, setUser] = useState(null); 

  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-gray-50 font-sans text-gray-900 relative">
        
        {/* 1. Global Toast Notifications */}
        <Toaster position="top-center" reverseOrder={false} />

        {/* 2. Top "Work In Progress" Banner */}
        <DevNotice />

        {/* 3. Floating Offer Popup (Appears after 3 seconds) */}
        <OfferPopup />

        {/* 4. Navigation Bar */}
        <Navbar user={user} setUser={setUser} />

        {/* 5. Main Content Area */}
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/flights" element={<Flights />} />
            <Route path="/trains" element={<Trains />} />
            <Route path="/hotels" element={<Hotels />} />
            <Route path="/cabs" element={<Cabs />} />
            <Route path="/bus" element={<Bus />} />
            <Route path="/food" element={<FoodOnTrain />} />
            
            <Route path="/login" element={<Login setUser={setUser} />} />
            <Route path="/my-bookings" element={<MyBookings />} />
            <Route path="/profile" element={<ProfileSettings user={user} setUser={setUser} />} />
          </Routes>
        </div>

        {/* 6. Footer */}
        <footer className="bg-gray-800 text-white py-10 mt-auto border-t border-gray-700">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              
              <div className="text-center md:text-left">
                <h2 className="text-2xl font-bold tracking-tight">YatraEase</h2>
                <p className="text-gray-400 text-sm mt-1">Your all-in-one travel companion for India.</p>
              </div>
              
              <div className="flex gap-6 text-sm text-gray-400 font-medium">
                <a href="#" className="hover:text-white transition duration-200">About Us</a>
                <a href="#" className="hover:text-white transition duration-200">Privacy Policy</a>
                <a href="#" className="hover:text-white transition duration-200">Terms of Service</a>
                <a href="#" className="hover:text-white transition duration-200">Customer Support</a>
              </div>
              
              <div className="text-sm text-gray-500">
                © 2026 Made with ❤️ for India | Koustav Pan
              </div>
            </div>
          </div>
        </footer>

      </div>
    </Router>
  );
}

export default App;