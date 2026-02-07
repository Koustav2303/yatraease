import React, { useState, useEffect, useRef } from 'react';
import { MapPin } from 'lucide-react';
// IMPORT THE HUGE DATA FILE
import { indianCities } from '../../data/allCities'; 

const CityInput = ({ label, placeholder, value, onChange }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const wrapperRef = useRef(null);

  // Close dropdown if clicked outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [wrapperRef]);

  const handleChange = (e) => {
    const input = e.target.value;
    onChange(input); // Update parent state with raw input
    
    if (input.length > 0) {
      // Filter the huge list based on input
      const filtered = indianCities.filter(city => 
        city.name.toLowerCase().includes(input.toLowerCase())
      );
      // Limit to top 8 results to keep dropdown clean
      setSuggestions(filtered.slice(0, 8)); 
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSelect = (city) => {
    // IMPORTANT: Send "City, State" so we can validate intrastate travel later
    onChange(`${city.name}, ${city.state}`);
    setShowSuggestions(false);
  };

  return (
    <div className="flex flex-col relative" ref={wrapperRef}>
      <label className="text-xs text-gray-500 font-bold mb-1 uppercase tracking-wide">{label}</label>
      
      <div className="flex items-center gap-2 border-b-2 border-gray-200 py-2 hover:border-primary transition group focus-within:border-primary">
        <MapPin size={18} className="text-gray-400 group-focus-within:text-primary transition" />
        <input 
          type="text" 
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          className="w-full outline-none font-bold text-lg text-gray-800 bg-transparent placeholder-gray-300"
          autoComplete="off"
        />
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full left-0 w-full bg-white shadow-2xl rounded-lg mt-2 z-50 max-h-60 overflow-y-auto border border-gray-100 animate-fade-in">
          {suggestions.map((city, idx) => (
            <div 
              key={idx} 
              onClick={() => handleSelect(city)}
              className="p-3 hover:bg-blue-50 cursor-pointer flex justify-between items-center border-b border-gray-50 last:border-none group"
            >
              <div>
                <p className="font-bold text-gray-800 text-sm group-hover:text-primary">{city.name}</p>
                <p className="text-xs text-gray-500">{city.state}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CityInput;