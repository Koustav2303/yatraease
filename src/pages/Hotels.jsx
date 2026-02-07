import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Star, MapPin, Wifi, Coffee, Waves, Check } from 'lucide-react';

const Hotels = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const city = queryParams.get('to') || 'Goa'; // Default fallback
  const checkInDate = queryParams.get('date');

  // MOCK DATA: Simulating a database
  const allHotels = [
    {
      id: 1,
      name: `Grand Hyatt ${city}`,
      location: 'City Center',
      rating: 4.8,
      reviews: 1240,
      price: 12500,
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      amenities: ['Pool', 'Spa', 'Breakfast'],
      tag: 'Luxury'
    },
    {
      id: 2,
      name: `Lemon Tree Premier`,
      location: 'Near Airport',
      rating: 4.2,
      reviews: 850,
      price: 4500,
      image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      amenities: ['WiFi', 'Gym'],
      tag: 'Best Seller'
    },
    {
      id: 3,
      name: `The Backpackers Hostel`,
      location: 'Market Road',
      rating: 3.9,
      reviews: 400,
      price: 999,
      image: 'https://plus.unsplash.com/premium_photo-1675745329378-5573c360f69f?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      amenities: ['WiFi', 'Bunk Beds'],
      tag: 'Budget'
    },
    {
      id: 4,
      name: `Radisson Blu`,
      location: 'Business District',
      rating: 4.6,
      reviews: 2100,
      price: 8200,
      image: 'https://images.unsplash.com/photo-1657349226767-66c983d7df39?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      amenities: ['Pool', 'Bar', 'Breakfast'],
      tag: 'Business'
    }
  ];

  // Dynamic Pricing Logic: Increase price if it's a weekend
  const getDynamicPrice = (basePrice) => {
    if (!checkInDate) return basePrice;
    const day = new Date(checkInDate).getDay();
    if (day === 0 || day === 6) return basePrice + 1500; // Weekend Surcharge
    return basePrice;
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-10">
      
      {/* 1. Header Section */}
      <div className="bg-blue-900 text-white p-6 shadow-md">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold">Hotels in {city}</h1>
          <div className="flex gap-4 text-blue-200 text-sm mt-1">
            <span>{checkInDate ? new Date(checkInDate).toDateString() : 'Select Dates'}</span>
            <span>•</span>
            <span>1 Room, 2 Guests</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-6 flex flex-col md:flex-row gap-6">
        
        {/* 2. Filters Sidebar */}
        <div className="w-full md:w-1/4">
          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 sticky top-20">
            <h3 className="font-bold text-lg mb-4 text-gray-800">Filters</h3>
            
            {/* Price Range */}
            <div className="mb-6">
              <h4 className="font-semibold text-sm mb-2 text-gray-600">Price Range</h4>
              <input type="range" min="1000" max="20000" className="w-full accent-primary" />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>₹1000</span>
                <span>₹20000+</span>
              </div>
            </div>

            {/* Star Rating */}
            <div className="mb-6">
              <h4 className="font-semibold text-sm mb-2 text-gray-600">Star Rating</h4>
              {[5, 4, 3].map(star => (
                <label key={star} className="flex items-center gap-2 mb-2 cursor-pointer">
                  <input type="checkbox" className="rounded text-primary focus:ring-primary"/>
                  <div className="flex text-yellow-400">
                    {[...Array(star)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                  </div>
                </label>
              ))}
            </div>

            {/* Amenities */}
            <div>
              <h4 className="font-semibold text-sm mb-2 text-gray-600">Amenities</h4>
              {['WiFi', 'Breakfast Included', 'Swimming Pool', 'Parking'].map(amenity => (
                <label key={amenity} className="flex items-center gap-2 mb-2 cursor-pointer">
                  <input type="checkbox" className="rounded text-primary focus:ring-primary"/>
                  <span className="text-sm text-gray-600">{amenity}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* 3. Hotel List */}
        <div className="w-full md:w-3/4 space-y-6">
          {allHotels.map((hotel) => (
            <div key={hotel.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition flex flex-col md:flex-row h-auto md:h-64">
              
              {/* Image */}
              <div className="w-full md:w-1/3 relative">
                <img src={hotel.image} alt={hotel.name} className="w-full h-full object-cover" />
                {hotel.tag && (
                  <span className="absolute top-3 left-3 bg-white/90 backdrop-blur text-xs font-bold px-2 py-1 rounded text-gray-800 uppercase tracking-wide">
                    {hotel.tag}
                  </span>
                )}
              </div>

              {/* Content */}
              <div className="w-full md:w-2/3 p-6 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">{hotel.name}</h3>
                      <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                        <MapPin size={14} className="text-blue-500"/> {hotel.location}
                      </p>
                    </div>
                    <div className="flex flex-col items-end">
                      <div className="bg-blue-600 text-white text-sm font-bold px-2 py-1 rounded flex items-center gap-1">
                        {hotel.rating} <Star size={10} fill="currentColor"/>
                      </div>
                      <span className="text-xs text-gray-400 mt-1">{hotel.reviews} Ratings</span>
                    </div>
                  </div>

                  {/* Amenities Icons */}
                  <div className="flex gap-4 mt-4 text-gray-500">
                    {hotel.amenities.includes('WiFi') && <div className="flex items-center gap-1 text-xs"><Wifi size={14}/> WiFi</div>}
                    {hotel.amenities.includes('Breakfast') && <div className="flex items-center gap-1 text-xs"><Coffee size={14}/> Breakfast</div>}
                    {hotel.amenities.includes('Pool') && <div className="flex items-center gap-1 text-xs"><Waves size={14}/> Pool</div>}
                  </div>
                </div>

                {/* Price & Action */}
                <div className="flex justify-between items-end mt-4 border-t border-dashed pt-4">
                  <div className="text-xs text-green-600 font-bold flex items-center gap-1">
                    <Check size={12}/> Free Cancellation
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-400 line-through">₹{getDynamicPrice(hotel.price) + 2000}</p>
                    <p className="text-2xl font-bold text-gray-800">₹{getDynamicPrice(hotel.price)}</p>
                    <p className="text-xs text-gray-500">+ ₹540 taxes & fees</p>
                    <button className="mt-2 bg-secondary text-white px-6 py-2 rounded-lg font-bold hover:bg-orange-600 transition">
                      View Room
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default Hotels;