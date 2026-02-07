import React, { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  ArrowRight, Filter, Plane, Clock, ChevronDown, ChevronUp, 
  Briefcase, AlertCircle, CheckCircle, Info, X, Utensils, 
  Luggage, Calendar, Sunrise, Sun, Sunset, Moon, MapPin
} from 'lucide-react';
import toast from 'react-hot-toast';

// --- 1. CONFIGURATION & MOCK DATA ---

const AIRLINES = [
  { name: 'IndiGo', code: '6E', color: 'text-blue-600', bg: 'bg-blue-50', logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/9/9f/IndiGo_Logo_2.svg/1200px-IndiGo_Logo_2.svg.png' },
  { name: 'Air India', code: 'AI', color: 'text-red-600', bg: 'bg-red-50', logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/e/e3/Air_India_Logo.svg/1200px-Air_India_Logo.svg.png' },
  { name: 'Vistara', code: 'UK', color: 'text-purple-800', bg: 'bg-purple-50', logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/b/b1/Vistara_Logo.svg/1200px-Vistara_Logo.svg.png' },
  { name: 'Akasa Air', code: 'QP', color: 'text-orange-600', bg: 'bg-orange-50', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Akasa_Air_Logo.svg/1200px-Akasa_Air_Logo.svg.png' },
];

const AIRCRAFT_TYPES = ['Airbus A320neo', 'Boeing 737 MAX', 'Airbus A321', 'Boeing 787 Dreamliner'];

// Helper to format currency
const formatPrice = (price) => 
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumSignificantDigits: 3 }).format(price);

// Helper to calculate duration in minutes
const getDurationMins = (durationStr) => {
  const [h, m] = durationStr.split(' ').map(s => parseInt(s));
  return (h * 60) + (m || 0);
};

// --- 2. DATA GENERATOR ENGINE ---

const generateFlights = (from, to, dateStr) => {
  const seed = dateStr.split('-').reduce((a, b) => parseInt(a) + parseInt(b), 0);
  const count = 12 + (seed % 5); // Generate 12-17 flights
  const flights = [];

  for (let i = 0; i < count; i++) {
    const airline = AIRLINES[Math.floor(Math.random() * AIRLINES.length)];
    
    // Time Logic
    const hour = Math.floor(Math.random() * 24);
    const minute = [0, 15, 30, 45][Math.floor(Math.random() * 4)];
    const deptDate = new Date();
    deptDate.setHours(hour, minute, 0);

    // Duration & Stops Logic
    const isDirect = Math.random() > 0.3;
    const durationMins = isDirect ? 110 + Math.floor(Math.random() * 50) : 300 + Math.floor(Math.random() * 180);
    const arrDate = new Date(deptDate.getTime() + durationMins * 60000);
    
    // Price Logic (Complex)
    let basePrice = 3500 + Math.floor(Math.random() * 4000);
    if (!isDirect) basePrice -= 800; // Connecting flights usually cheaper/longer
    if (hour < 6 || hour > 22) basePrice -= 500; // Red-eye cheaper
    if (airline.code === 'UK' || airline.code === 'AI') basePrice += 1200; // Full service premium

    flights.push({
      id: `FL-${i}-${Date.now()}`,
      airline: airline,
      flightNumber: `${airline.code}-${100 + Math.floor(Math.random() * 899)}`,
      aircraft: AIRCRAFT_TYPES[Math.floor(Math.random() * AIRCRAFT_TYPES.length)],
      fromCode: from.substring(0, 3).toUpperCase(),
      toCode: to.substring(0, 3).toUpperCase(),
      fromCity: from.split(',')[0],
      toCity: to.split(',')[0],
      deptTime: deptDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
      arrTime: arrDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
      duration: `${Math.floor(durationMins / 60)}h ${durationMins % 60}m`,
      durationMins: durationMins,
      stops: isDirect ? 0 : 1,
      layover: isDirect ? null : { city: 'New Delhi (DEL)', duration: '1h 45m' },
      price: basePrice,
      seats: Math.floor(Math.random() * 15) + 2,
      features: {
        meal: airline.code === 'UK' || airline.code === 'AI',
        wifi: Math.random() > 0.7,
        power: true
      },
      tags: basePrice < 4000 ? ['Cheapest'] : (durationMins < 130 ? ['Fastest'] : [])
    });
  }
  return flights.sort((a, b) => a.price - b.price);
};

// --- 3. SUB-COMPONENTS ---

const SkeletonCard = () => (
  <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm animate-pulse mb-4">
    <div className="flex justify-between items-center mb-6">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
        <div className="space-y-2">
          <div className="w-24 h-4 bg-gray-200 rounded"></div>
          <div className="w-16 h-3 bg-gray-200 rounded"></div>
        </div>
      </div>
      <div className="w-32 h-8 bg-gray-200 rounded"></div>
    </div>
    <div className="flex justify-between items-center px-4">
      <div className="w-16 h-6 bg-gray-200 rounded"></div>
      <div className="w-32 h-2 bg-gray-200 rounded"></div>
      <div className="w-16 h-6 bg-gray-200 rounded"></div>
    </div>
  </div>
);

const DateStrip = ({ selectedDate, onDateChange }) => {
  const dates = useMemo(() => {
    const arr = [];
    for (let i = -2; i <= 2; i++) {
      const d = new Date(selectedDate);
      d.setDate(d.getDate() + i);
      arr.push(d);
    }
    return arr;
  }, [selectedDate]);

  return (
    <div className="flex bg-white border-b border-gray-200 overflow-x-auto no-scrollbar">
      {dates.map((date, idx) => {
        const isSelected = date.toDateString() === new Date(selectedDate).toDateString();
        const price = 4000 + Math.floor(Math.random() * 2000);
        return (
          <button
            key={idx}
            onClick={() => onDateChange(date.toISOString().split('T')[0])}
            className={`flex-1 min-w-[100px] py-3 px-4 flex flex-col items-center justify-center border-r border-gray-100 transition-colors ${
              isSelected ? 'bg-blue-50 border-b-2 border-b-blue-600' : 'hover:bg-gray-50'
            }`}
          >
            <span className={`text-xs font-bold uppercase mb-1 ${isSelected ? 'text-blue-600' : 'text-gray-500'}`}>
              {date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
            </span>
            <span className={`text-sm font-bold ${isSelected ? 'text-gray-900' : 'text-gray-400'}`}>
              ₹{price}
            </span>
          </button>
        );
      })}
    </div>
  );
};

// --- 4. MAIN PAGE COMPONENT ---

const Flights = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);

  // Core State
  const [loading, setLoading] = useState(true);
  const [flights, setFlights] = useState([]);
  const [filteredFlights, setFilteredFlights] = useState([]);
  const [expandedId, setExpandedId] = useState(null);

  // Search Params
  const [searchParams, setSearchParams] = useState({
    from: queryParams.get('from') || 'Delhi',
    to: queryParams.get('to') || 'Mumbai',
    date: queryParams.get('date') || new Date().toISOString().split('T')[0]
  });

  // Filters & Sort State
  const [filters, setFilters] = useState({
    stops: [],      // '0', '1'
    airlines: [],   // 'IndiGo', etc
    time: [],       // 'morning', 'night'
    maxPrice: 15000
  });
  const [sortBy, setSortBy] = useState('CHEAPEST'); // CHEAPEST, FASTEST, RECOMMENDED

  // --- EFFECT: Fetch Flights ---
  useEffect(() => {
    setLoading(true);
    // Simulate Network Request
    const timer = setTimeout(() => {
      const data = generateFlights(searchParams.from, searchParams.to, searchParams.date);
      setFlights(data);
      setLoading(false);
    }, 1200); // 1.2s loading simulation
    return () => clearTimeout(timer);
  }, [searchParams]);

  // --- EFFECT: Filter & Sort ---
  useEffect(() => {
    let result = [...flights];

    // 1. Filter: Stops
    if (filters.stops.length > 0) {
      result = result.filter(f => filters.stops.includes(String(f.stops)));
    }
    // 2. Filter: Airlines
    if (filters.airlines.length > 0) {
      result = result.filter(f => filters.airlines.includes(f.airline.name));
    }
    // 3. Filter: Price
    result = result.filter(f => f.price <= filters.maxPrice);
    
    // 4. Filter: Time
    if (filters.time.length > 0) {
      result = result.filter(f => {
        const hour = parseInt(f.deptTime.split(':')[0]);
        if (filters.time.includes('morning') && hour >= 6 && hour < 12) return true;
        if (filters.time.includes('afternoon') && hour >= 12 && hour < 18) return true;
        if (filters.time.includes('evening') && hour >= 18 && hour < 24) return true;
        return false;
      });
    }

    // 5. Sort
    if (sortBy === 'CHEAPEST') result.sort((a, b) => a.price - b.price);
    else if (sortBy === 'FASTEST') result.sort((a, b) => a.durationMins - b.durationMins);
    else if (sortBy === 'RECOMMENDED') {
      // Custom logic: Price * 0.7 + Duration * 0.3
      result.sort((a, b) => (a.price + a.durationMins) - (b.price + b.durationMins));
    }

    setFilteredFlights(result);
  }, [flights, filters, sortBy]);


  // --- HANDLERS ---
  const handleToggleFilter = (key, value) => {
    setFilters(prev => {
      const current = prev[key];
      const updated = current.includes(value) 
        ? current.filter(item => item !== value)
        : [...current, value];
      return { ...prev, [key]: updated };
    });
  };

  const handleBook = (flight) => {
    toast.success(`Booking initiated for ${flight.airline.name}`);
    navigate('/my-bookings');
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-20 font-sans">
      
      {/* HEADER SECTION */}
      <div className="bg-white sticky top-16 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <div className="flex items-center gap-2 text-gray-800 font-bold text-xl">
              <span>{searchParams.from.split(',')[0]}</span>
              <ArrowRight size={20} className="text-gray-400"/>
              <span>{searchParams.to.split(',')[0]}</span>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              {new Date(searchParams.date).toDateString()} • 1 Adult • Economy
            </p>
          </div>
          <button onClick={() => navigate('/')} className="text-blue-600 font-bold text-sm bg-blue-50 px-4 py-2 rounded-lg hover:bg-blue-100 transition">
            Modify Search
          </button>
        </div>
        
        {/* Date Strip */}
        <DateStrip 
          selectedDate={searchParams.date} 
          onDateChange={(date) => setSearchParams(prev => ({ ...prev, date }))} 
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-6 flex flex-col lg:flex-row gap-6">
        
        {/* SIDEBAR FILTERS (Sticky) */}
        <div className="w-full lg:w-1/4 hidden lg:block">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 sticky top-48">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-gray-800 flex items-center gap-2">
                <Filter size={18}/> Filters
              </h3>
              <button 
                onClick={() => setFilters({ stops: [], airlines: [], time: [], maxPrice: 15000 })}
                className="text-xs font-bold text-blue-600 hover:underline"
              >
                Reset All
              </button>
            </div>

            {/* Stop Filter */}
            <div className="mb-6">
              <h4 className="text-sm font-bold text-gray-700 mb-3">Stops</h4>
              <div className="space-y-2">
                {[
                  { label: "Non Stop", val: '0' },
                  { label: "1 Stop", val: '1' }
                ].map(opt => (
                  <label key={opt.val} className="flex items-center gap-3 cursor-pointer group">
                    <input 
                      type="checkbox" 
                      checked={filters.stops.includes(opt.val)}
                      onChange={() => handleToggleFilter('stops', opt.val)}
                      className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-600 group-hover:text-gray-900">{opt.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Departure Time */}
            <div className="mb-6">
              <h4 className="text-sm font-bold text-gray-700 mb-3">Departure Time</h4>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: "Morning", icon: <Sunrise size={16}/>, val: 'morning', desc: '6AM - 12PM' },
                  { label: "Afternoon", icon: <Sun size={16}/>, val: 'afternoon', desc: '12PM - 6PM' },
                  { label: "Evening", icon: <Sunset size={16}/>, val: 'evening', desc: '6PM - 12AM' },
                  { label: "Night", icon: <Moon size={16}/>, val: 'night', desc: '12AM - 6AM' },
                ].map(t => (
                  <button
                    key={t.val}
                    onClick={() => handleToggleFilter('time', t.val)}
                    className={`border rounded-lg p-2 flex flex-col items-center text-center transition ${
                      filters.time.includes(t.val) 
                        ? 'bg-blue-50 border-blue-500 text-blue-700' 
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    <div className="mb-1 text-gray-400">{t.icon}</div>
                    <span className="text-xs font-bold">{t.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Price Slider */}
            <div className="mb-6">
              <h4 className="text-sm font-bold text-gray-700 mb-3">Max Price</h4>
              <input 
                type="range" 
                min="3000" max="15000" step="500"
                value={filters.maxPrice}
                onChange={(e) => setFilters(prev => ({ ...prev, maxPrice: parseInt(e.target.value) }))}
                className="w-full accent-blue-600 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-2">
                <span>₹3,000</span>
                <span className="font-bold text-gray-900">₹{filters.maxPrice}</span>
              </div>
            </div>

            {/* Airline Filter */}
            <div>
              <h4 className="text-sm font-bold text-gray-700 mb-3">Airlines</h4>
              <div className="space-y-2">
                {AIRLINES.map(airline => (
                  <label key={airline.name} className="flex items-center gap-3 cursor-pointer group">
                    <input 
                      type="checkbox" 
                      checked={filters.airlines.includes(airline.name)}
                      onChange={() => handleToggleFilter('airlines', airline.name)}
                      className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <div className="flex items-center gap-2">
                      <div className={`w-5 h-5 rounded-full ${airline.bg} flex items-center justify-center text-[10px] font-bold ${airline.color}`}>
                        {airline.code}
                      </div>
                      <span className="text-sm text-gray-600 group-hover:text-gray-900">{airline.name}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* RESULTS SECTION */}
        <div className="w-full lg:w-3/4">
          
          {/* SORT TABS */}
          <div className="bg-white p-1 rounded-xl shadow-sm border border-gray-200 mb-6 flex">
            {[
              { id: 'CHEAPEST', label: 'Cheapest', desc: 'Save money', icon: <Luggage size={16}/> },
              { id: 'FASTEST', label: 'Fastest', desc: 'Save time', icon: <Clock size={16}/> },
              { id: 'RECOMMENDED', label: 'Best', desc: 'Balanced', icon: <CheckCircle size={16}/> },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setSortBy(tab.id)}
                className={`flex-1 py-3 px-4 rounded-lg flex items-center justify-center gap-3 transition-all ${
                  sortBy === tab.id 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'text-gray-500 hover:bg-gray-50'
                }`}
              >
                {tab.icon}
                <div className="text-left">
                  <p className="text-sm font-bold leading-none">{tab.label}</p>
                  <p className={`text-[10px] mt-1 ${sortBy === tab.id ? 'text-blue-100' : 'text-gray-400'}`}>{tab.desc}</p>
                </div>
              </button>
            ))}
          </div>

          {/* FLIGHT CARDS */}
          {loading ? (
            <>
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </>
          ) : filteredFlights.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Plane size={32} className="text-gray-300" />
              </div>
              <h3 className="text-xl font-bold text-gray-800">No flights found</h3>
              <p className="text-gray-500 mt-2">Try adjusting your filters or date.</p>
              <button 
                onClick={() => setFilters({ stops: [], airlines: [], time: [], maxPrice: 15000 })}
                className="mt-6 text-blue-600 font-bold hover:underline"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredFlights.map((flight) => (
                <div 
                  key={flight.id} 
                  className={`bg-white rounded-2xl border transition-all duration-300 overflow-hidden ${
                    expandedId === flight.id ? 'shadow-lg border-blue-200 ring-1 ring-blue-100' : 'shadow-sm border-gray-200 hover:shadow-md'
                  }`}
                >
                  {/* CARD HEADER / TAGS */}
                  {flight.tags.length > 0 && (
                    <div className="bg-gray-50 px-4 py-1 flex gap-2 border-b border-gray-100">
                      {flight.tags.map(tag => (
                        <span key={tag} className="text-[10px] font-bold text-green-700 bg-green-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <CheckCircle size={10}/> {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* CARD BODY */}
                  <div className="p-5 flex flex-col md:flex-row items-center gap-6">
                    
                    {/* 1. Airline Info */}
                    <div className="w-full md:w-1/4 flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${flight.airline.bg}`}>
                         {/* Fallback to code if image fails (though standard images usually work) */}
                         <span className={`text-sm font-bold ${flight.airline.color}`}>{flight.airline.code}</span>
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900">{flight.airline.name}</h4>
                        <p className="text-xs text-gray-500">{flight.flightNumber}</p>
                        <p className="text-[10px] text-gray-400 mt-0.5">{flight.aircraft}</p>
                      </div>
                    </div>

                    {/* 2. Flight Path */}
                    <div className="w-full md:w-2/4 flex items-center justify-between px-2">
                      <div className="text-center">
                        <p className="text-xl font-bold text-gray-900">{flight.deptTime}</p>
                        <p className="text-xs font-bold text-gray-500">{flight.fromCode}</p>
                      </div>
                      
                      <div className="flex-1 px-4 flex flex-col items-center">
                        <p className="text-xs text-gray-400 mb-1">{flight.duration}</p>
                        <div className="w-full h-[2px] bg-gray-200 relative">
                          {/* Dot logic for stops */}
                          {flight.stops === 0 ? (
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-green-500"></div>
                          ) : (
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-orange-500 ring-4 ring-white"></div>
                          )}
                          {/* Plane Icon */}
                          <Plane size={14} className="absolute -top-3 left-1/2 -ml-1.5 text-gray-300 transform rotate-90" />
                        </div>
                        <p className={`text-[10px] font-bold mt-2 ${flight.stops === 0 ? 'text-green-600' : 'text-orange-500'}`}>
                          {flight.stops === 0 ? 'Non-stop' : `${flight.stops} Stop`}
                        </p>
                      </div>

                      <div className="text-center">
                        <p className="text-xl font-bold text-gray-900">{flight.arrTime}</p>
                        <p className="text-xs font-bold text-gray-500">{flight.toCode}</p>
                      </div>
                    </div>

                    {/* 3. Price & Button */}
                    <div className="w-full md:w-1/4 flex flex-col items-end border-l border-dashed pl-6 border-gray-200">
                      <h3 className="text-2xl font-bold text-gray-900">{formatPrice(flight.price)}</h3>
                      <p className="text-xs text-gray-400 mb-3">per adult</p>
                      
                      <button 
                        onClick={() => handleBook(flight)}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-lg shadow-lg shadow-blue-200 transition active:scale-95"
                      >
                        Book Now
                      </button>
                      
                      {flight.seats < 5 && (
                        <p className="text-[10px] font-bold text-red-500 mt-2 animate-pulse">
                          Only {flight.seats} seats left!
                        </p>
                      )}
                    </div>
                  </div>

                  {/* CARD FOOTER (Toggle) */}
                  <div className="bg-gray-50 px-5 py-2.5 border-t border-gray-100 flex justify-between items-center">
                    <div className="flex gap-4">
                      {flight.features.meal && (
                        <span className="text-[10px] font-bold text-gray-600 flex items-center gap-1">
                          <Utensils size={12} className="text-gray-400"/> Free Meal
                        </span>
                      )}
                      {flight.features.wifi && (
                        <span className="text-[10px] font-bold text-gray-600 flex items-center gap-1">
                          <CheckCircle size={12} className="text-gray-400"/> WiFi
                        </span>
                      )}
                    </div>
                    
                    <button 
                      onClick={() => setExpandedId(expandedId === flight.id ? null : flight.id)}
                      className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
                    >
                      {expandedId === flight.id ? 'Hide Details' : 'View Flight Details'}
                      {expandedId === flight.id ? <ChevronUp size={14}/> : <ChevronDown size={14}/>}
                    </button>
                  </div>

                  {/* EXPANDED DETAILS */}
                  {expandedId === flight.id && (
                    <div className="border-t border-gray-200 p-6 bg-white animate-fade-in">
                      
                      {/* Layover Alert */}
                      {flight.layover && (
                        <div className="bg-orange-50 border border-orange-100 p-3 rounded-lg flex items-center gap-3 mb-6">
                          <Info size={18} className="text-orange-600"/>
                          <div>
                            <p className="text-sm font-bold text-orange-800">Layover in {flight.layover.city}</p>
                            <p className="text-xs text-orange-600">Change of planes required. Layover time: {flight.layover.duration}</p>
                          </div>
                        </div>
                      )}

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        
                        {/* Baggage */}
                        <div className="border rounded-xl p-4">
                          <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                             <Luggage size={16}/> Baggage
                          </h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-500">Cabin Baggage</span>
                              <span className="font-bold text-gray-800">7 Kgs</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-500">Check-in</span>
                              <span className="font-bold text-gray-800">15 Kgs</span>
                            </div>
                          </div>
                        </div>

                        {/* Cancellation Policy */}
                        <div className="border rounded-xl p-4">
                          <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                             <AlertCircle size={16}/> Cancellation
                          </h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-500">Cancel Fee</span>
                              <span className="font-bold text-red-600">₹3,500</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-500">Reschedule</span>
                              <span className="font-bold text-blue-600">₹2,800</span>
                            </div>
                          </div>
                        </div>

                        {/* Amenities / Map */}
                        <div className="border rounded-xl p-4 bg-gray-50 flex flex-col items-center justify-center text-center">
                           <MapPin size={24} className="text-gray-300 mb-2"/>
                           <p className="text-xs text-gray-500 mb-2">Detailed Seat Map Available</p>
                           <button className="text-xs font-bold text-blue-600 hover:underline">Preview Seats</button>
                        </div>

                      </div>
                    </div>
                  )}

                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Flights;