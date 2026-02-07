import React, { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Car, Fuel, User, CheckCircle, Info, AlertTriangle, Map, 
  Filter, ArrowRight, ShieldCheck, Briefcase, Star, 
  Navigation, Clock, Settings, X, ChevronDown, SlidersHorizontal
} from 'lucide-react';
import toast from 'react-hot-toast';

// --- 1. CONFIGURATION & MOCK DATA ---

const CAR_TYPES = [
  { id: 'Hatchback', label: 'Hatchback', icon: <Car size={16}/>, desc: 'Compact & Pocket Friendly' },
  { id: 'Sedan', label: 'Sedan', icon: <Car size={16}/>, desc: 'Comfortable for small families' },
  { id: 'SUV', label: 'SUV', icon: <Car size={16}/>, desc: 'Spacious & Premium' },
];

const INCLUSIONS = [
  'Base Fare & Fuel Charges',
  'Driver Allowance',
  'State Taxes & GST'
];

const EXCLUSIONS = [
  'Toll Tax & Parking',
  'Night Charges (if applicable)'
];

const generateCabs = (distance) => {
  const baseData = [
    { model: 'Maruti WagonR', type: 'Hatchback', seats: 4, bags: 2, rate: 12 },
    { model: 'Tata Indica', type: 'Hatchback', seats: 4, bags: 2, rate: 11.5 },
    { model: 'Swift Dzire', type: 'Sedan', seats: 4, bags: 3, rate: 14 },
    { model: 'Toyota Etios', type: 'Sedan', seats: 4, bags: 3, rate: 15 },
    { model: 'Hyundai Aura', type: 'Sedan', seats: 4, bags: 3, rate: 14.5 },
    { model: 'Toyota Innova', type: 'SUV', seats: 6, bags: 4, rate: 22 },
    { model: 'Maruti Ertiga', type: 'SUV', seats: 6, bags: 4, rate: 19 },
    { model: 'Mahindra Xylo', type: 'SUV', seats: 7, bags: 5, rate: 20 },
  ];

  // Generate 5-8 random options from baseData
  const count = 5 + Math.floor(Math.random() * 4);
  const cabs = [];

  for(let i=0; i<count; i++) {
    const car = baseData[Math.floor(Math.random() * baseData.length)];
    const price = Math.floor(distance * car.rate) + 500; // Base + Driver charges
    
    cabs.push({
      id: `CAB-${i}-${Date.now()}`,
      ...car,
      price,
      rating: (4.0 + Math.random()).toFixed(1),
      ratingCount: Math.floor(Math.random() * 500) + 50,
      features: ['AC', Math.random() > 0.5 ? 'Automatic' : 'Manual', 'Diesel'],
      isSanitized: true,
      isPrimo: Math.random() > 0.7
    });
  }
  return cabs.sort((a,b) => a.price - b.price);
};

// --- 2. SUB-COMPONENTS ---

const SkeletonCard = () => (
  <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm animate-pulse mb-4">
    <div className="flex justify-between">
      <div className="flex gap-4">
        <div className="w-24 h-24 bg-gray-200 rounded-lg"></div>
        <div className="space-y-2">
          <div className="w-32 h-6 bg-gray-200 rounded"></div>
          <div className="w-20 h-4 bg-gray-200 rounded"></div>
          <div className="flex gap-2 pt-2">
            <div className="w-12 h-4 bg-gray-200 rounded"></div>
            <div className="w-12 h-4 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
      <div className="space-y-2 text-right">
        <div className="w-24 h-8 bg-gray-200 rounded ml-auto"></div>
        <div className="w-32 h-8 bg-gray-200 rounded"></div>
      </div>
    </div>
  </div>
);

// Reusable Error Screen
const ErrorScreen = ({ icon, title, msg, onBack }) => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
    <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md animate-fade-in-up border border-gray-100">
      <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
        {icon}
      </div>
      <h2 className="text-2xl font-bold text-gray-800 mb-2">{title}</h2>
      <p className="text-gray-500 mb-8 leading-relaxed">{msg}</p>
      <button onClick={onBack} className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-200">
        Go Back Home
      </button>
    </div>
  </div>
);

// --- 3. MAIN COMPONENT ---

const Cabs = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  
  // Data extraction
  const fromRaw = queryParams.get('from') || '';
  const toRaw = queryParams.get('to') || '';
  const dateStr = queryParams.get('date') || new Date().toISOString().split('T')[0];

  const getState = (str) => str.includes(',') ? str.split(',')[1].trim() : '';
  const getCity = (str) => str.includes(',') ? str.split(',')[0].trim() : str;

  const fromCity = getCity(fromRaw);
  const toCity = getCity(toRaw);
  const fromState = getState(fromRaw);
  const toState = getState(toRaw);

  // State
  const [loading, setLoading] = useState(true);
  const [cabs, setCabs] = useState([]);
  const [filteredCabs, setFilteredCabs] = useState([]);
  const [distance, setDistance] = useState(0);

  // Filters
  const [filters, setFilters] = useState({ types: [] });
  const [sortBy, setSortBy] = useState('CHEAPEST'); // CHEAPEST, RATING
  const [showMobileFilter, setShowMobileFilter] = useState(false);

  // --- LOGIC GATES (The Strict Requirements) ---
  const isLocal = fromCity.toLowerCase() === toCity.toLowerCase();
  const isInterstate = fromState && toState && fromState !== toState;

  // --- EFFECT: Load Data ---
  useEffect(() => {
    if (isLocal || isInterstate) {
      setLoading(false); 
      return; 
    }

    setLoading(true);
    // Mock Distance Calculation
    const dist = Math.floor(Math.random() * (500 - 150 + 1) + 150);
    setDistance(dist);

    setTimeout(() => {
      const data = generateCabs(dist);
      setCabs(data);
      setLoading(false);
    }, 1200);
  }, [fromCity, toCity, fromState, toState, isLocal, isInterstate]);

  // --- EFFECT: Filtering ---
  useEffect(() => {
    let result = [...cabs];

    if (filters.types.length > 0) {
      result = result.filter(c => filters.types.includes(c.type));
    }

    if (sortBy === 'CHEAPEST') result.sort((a, b) => a.price - b.price);
    if (sortBy === 'RATING') result.sort((a, b) => b.rating - a.rating);

    setFilteredCabs(result);
  }, [cabs, filters, sortBy]);


  // --- HANDLERS ---
  const handleBook = (cab) => {
    toast.success(`Booking ${cab.model}`);
    navigate('/my-bookings');
  };

  const toggleFilter = (typeId) => {
    setFilters(prev => ({
      ...prev,
      types: prev.types.includes(typeId) 
        ? prev.types.filter(t => t !== typeId) 
        : [...prev.types, typeId]
    }));
  };

  // --- ERROR RENDERING ---
  if (isLocal) {
    return <ErrorScreen 
      icon={<Car size={40} className="text-red-500"/>}
      title="Local Travel Not Supported"
      msg="You selected the same city for pickup and drop. For local rides, please use Uber or Ola."
      onBack={() => navigate('/')}
    />;
  }

  if (isInterstate) {
    return <ErrorScreen 
      icon={<AlertTriangle size={40} className="text-orange-500"/>}
      title="Interstate Travel Restricted"
      msg={`We currently only support inner-state travel. You selected ${fromState} to ${toState}. Please choose cities within the same state.`}
      onBack={() => navigate('/')}
    />;
  }

  // --- MAIN CONTENT RENDERING ---

  const FilterContent = () => (
    <div className="space-y-4">
      <div>
        <h4 className="font-bold text-sm text-gray-700 mb-3">Car Type</h4>
        <div className="space-y-2">
          {CAR_TYPES.map(t => (
            <label key={t.id} className="flex items-center gap-3 cursor-pointer group p-2 hover:bg-gray-50 rounded-lg">
              <input 
                type="checkbox" 
                checked={filters.types.includes(t.id)}
                onChange={() => toggleFilter(t.id)}
                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
              />
              <div className="flex-1">
                <span className="text-sm font-bold text-gray-700">{t.label}</span>
                <p className="text-[10px] text-gray-400">{t.desc}</p>
              </div>
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-gray-50 min-h-screen pb-20 font-sans text-gray-800">
      
      {/* 1. STICKY HEADER */}
      <div className="bg-white sticky top-16 z-30 shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <div className="flex items-center gap-2 text-lg md:text-xl font-bold text-gray-800">
              <span>{fromCity}</span>
              <ArrowRight size={20} className="text-gray-400"/>
              <span>{toCity}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
              <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded font-bold">Intrastate</span>
              <span>•</span>
              <span>{distance} kms</span>
              <span>•</span>
              <span>{new Date(dateStr).toDateString()}</span>
            </div>
          </div>
          <button onClick={() => navigate('/')} className="text-blue-600 font-bold text-xs md:text-sm bg-blue-50 px-4 py-2 rounded-lg hover:bg-blue-100">
            Modify
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-6 flex flex-col lg:flex-row gap-8">
        
        {/* 2. SIDEBAR (Filters & Trip Details) */}
        <div className="w-full lg:w-1/3 space-y-6">
          
          {/* Filters Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hidden lg:block">
            <div className="flex justify-between items-center mb-4 border-b pb-3">
              <h3 className="font-bold text-gray-800 flex items-center gap-2"><Filter size={18}/> Filters</h3>
              <button onClick={() => setFilters({ types: [] })} className="text-xs font-bold text-blue-600 hover:underline">Reset</button>
            </div>
            <FilterContent />
          </div>

          {/* Trip Summary Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
             <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
               <Map size={18}/> Trip Summary
             </h3>
             <div className="relative border-l-2 border-dashed border-gray-300 ml-2 space-y-6">
                <div className="pl-6 relative">
                  <div className="absolute -left-[9px] top-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                  <p className="text-sm font-bold">{fromCity}</p>
                  <p className="text-xs text-gray-500">Pickup anywhere in city</p>
                </div>
                <div className="pl-6 relative">
                  <div className="absolute -left-[9px] top-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white"></div>
                  <p className="text-sm font-bold">{toCity}</p>
                  <p className="text-xs text-gray-500">Drop anywhere in city</p>
                </div>
             </div>
             <div className="mt-6 bg-blue-50 p-4 rounded-lg flex gap-3 items-start">
                <Info size={16} className="text-blue-600 mt-0.5 flex-shrink-0"/>
                <p className="text-xs text-blue-700 leading-relaxed">
                  Price includes Driver Allowance & Fuel. Tolls & Parking are extra.
                </p>
             </div>
          </div>

          {/* Safety Card */}
          <div className="bg-green-50 rounded-xl border border-green-200 p-5">
             <h3 className="font-bold text-green-800 flex items-center gap-2 mb-2">
               <ShieldCheck size={18}/> Safety Promise
             </h3>
             <ul className="space-y-2">
               {['Vaccinated Drivers', 'Sanitized Cars', '24x7 Support'].map((item, i) => (
                 <li key={i} className="flex items-center gap-2 text-xs text-green-700 font-medium">
                   <CheckCircle size={12}/> {item}
                 </li>
               ))}
             </ul>
          </div>
        </div>

        {/* 3. CABS LIST */}
        <div className="w-full lg:w-2/3">
          
          {/* Sorting Header */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold text-xl text-gray-800">Available Cabs ({filteredCabs.length})</h2>
            <div className="hidden md:flex bg-white rounded-lg border border-gray-200 p-1">
              {['CHEAPEST', 'RATING'].map(sort => (
                <button
                  key={sort}
                  onClick={() => setSortBy(sort)}
                  className={`px-4 py-1.5 text-xs font-bold rounded-md transition ${
                    sortBy === sort ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  {sort}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <>
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </>
          ) : filteredCabs.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-xl border border-dashed">
              <Car size={48} className="mx-auto text-gray-300 mb-4"/>
              <h3 className="text-xl font-bold text-gray-800">No cabs available</h3>
              <p className="text-gray-500">Try changing your filters.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredCabs.map((cab) => (
                <div key={cab.id} className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition duration-300 overflow-hidden group">
                  
                  {/* Card Body */}
                  <div className="p-5 flex flex-col md:flex-row gap-6">
                    
                    {/* Image & Type */}
                    <div className="w-full md:w-1/4 flex flex-col items-center justify-center bg-gray-50 rounded-xl p-4">
                       <Car size={48} className="text-gray-400 mb-2 group-hover:text-blue-600 transition"/>
                       <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">{cab.type}</span>
                       {cab.isPrimo && (
                         <span className="mt-2 bg-yellow-100 text-yellow-700 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                           <Star size={10} fill="currentColor"/> Top Rated
                         </span>
                       )}
                    </div>

                    {/* Details */}
                    <div className="flex-1">
                       <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-lg font-bold text-gray-900">{cab.model} <span className="text-gray-400 font-normal">or equivalent</span></h3>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="bg-green-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1">
                                {cab.rating} <Star size={8} fill="currentColor"/>
                              </span>
                              <span className="text-xs text-gray-400">{cab.ratingCount} ratings</span>
                            </div>
                          </div>
                          
                          <div className="text-right md:hidden">
                            <h3 className="text-xl font-bold text-gray-900">₹{cab.price.toLocaleString()}</h3>
                          </div>
                       </div>

                       <div className="grid grid-cols-2 gap-y-2 gap-x-4 mt-4">
                          <div className="flex items-center gap-2 text-xs text-gray-600">
                             <User size={14} className="text-gray-400"/> {cab.seats} Seater
                          </div>
                          <div className="flex items-center gap-2 text-xs text-gray-600">
                             <Briefcase size={14} className="text-gray-400"/> {cab.bags} Bags
                          </div>
                          <div className="flex items-center gap-2 text-xs text-gray-600">
                             <CheckCircle size={14} className="text-gray-400"/> {cab.features[0]}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-gray-600">
                             <Settings size={14} className="text-gray-400"/> {cab.features[1]}
                          </div>
                       </div>
                    </div>

                    {/* Price & Action (Desktop) */}
                    <div className="hidden md:flex w-1/4 flex-col items-end justify-between border-l border-dashed pl-6">
                       <div className="text-right">
                         <h3 className="text-2xl font-bold text-gray-900">₹{cab.price.toLocaleString()}</h3>
                         <p className="text-xs text-green-600 font-bold">up to {distance} km</p>
                       </div>
                       <button 
                         onClick={() => handleBook(cab)}
                         className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 transition active:scale-95"
                       >
                         Book Now
                       </button>
                    </div>

                    {/* Mobile Button */}
                    <button 
                       onClick={() => handleBook(cab)}
                       className="md:hidden w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 shadow-md"
                    >
                       Book for ₹{cab.price.toLocaleString()}
                    </button>

                  </div>

                  {/* Card Footer */}
                  <div className="bg-gray-50 px-5 py-2 border-t border-gray-100 flex gap-4 text-[10px] text-gray-500 font-medium">
                     <span className="flex items-center gap-1"><CheckCircle size={10} className="text-green-600"/> Free Cancellation</span>
                     <span className="flex items-center gap-1"><CheckCircle size={10} className="text-green-600"/> Instant Refund</span>
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* --- MOBILE STICKY FILTER BAR --- */}
      <div className="lg:hidden fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 p-2 flex gap-2 z-40 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
        <button 
          onClick={() => setShowMobileFilter(true)}
          className="flex-1 bg-gray-100 text-gray-800 py-3 rounded-lg font-bold flex items-center justify-center gap-2"
        >
          <SlidersHorizontal size={16}/> Filter
        </button>
        <button 
          onClick={() => {
             const nextSort = sortBy === 'CHEAPEST' ? 'RATING' : 'CHEAPEST';
             setSortBy(nextSort);
             toast.success(`Sorted by ${nextSort === 'CHEAPEST' ? 'Price' : 'Rating'}`);
          }}
          className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2 capitalize"
        >
          Sort: {sortBy === 'CHEAPEST' ? 'Price' : 'Rating'}
        </button>
      </div>

      {/* --- MOBILE FILTER MODAL --- */}
      {showMobileFilter && (
        <div className="fixed inset-0 z-[60] bg-white flex flex-col animate-fade-in-up">
          <div className="flex justify-between items-center p-4 border-b border-gray-200 bg-gray-50">
            <h2 className="text-lg font-bold text-gray-800">Filters</h2>
            <button onClick={() => setShowMobileFilter(false)}><X size={24} className="text-gray-500"/></button>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
             <FilterContent />
          </div>
          <div className="p-4 border-t border-gray-200">
            <button 
              onClick={() => setShowMobileFilter(false)}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold shadow-lg"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default Cabs;