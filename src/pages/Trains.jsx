import React, { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  ArrowRight, Filter, Train, Clock, ChevronDown, ChevronUp, 
  MapPin, AlertCircle, CheckCircle, Info, Coffee, Calendar, 
  Search, SlidersHorizontal, TrainFront
} from 'lucide-react';
import toast from 'react-hot-toast';

// --- 1. CONSTANTS & MOCK DATA GENERATOR ---

const TRAIN_TYPES = ['Rajdhani', 'Shatabdi', 'Duronto', 'SuperFast', 'Express', 'Vande Bharat'];
const QUOTAS = ['General', 'Tatkal', 'Ladies', 'Senior Citizen'];
const CLASSES = ['1A', '2A', '3A', 'SL', '2S', 'CC', 'EC'];

const STATIONS_DB = {
  'New Delhi': 'NDLS', 'Delhi': 'DLI', 'Mumbai': 'CSMT', 'Bengaluru': 'SBC', 
  'Chennai': 'MAS', 'Kolkata': 'HWH', 'Hyderabad': 'SC', 'Pune': 'PUNE',
  'Goa': 'MAO', 'Jaipur': 'JP', 'Ahmedabad': 'ADI', 'Patna': 'PNBE'
};

const getStationCode = (city) => {
  const key = Object.keys(STATIONS_DB).find(k => city.includes(k));
  return key ? STATIONS_DB[key] : city.substring(0, 3).toUpperCase();
};

const formatPrice = (price) => 
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumSignificantDigits: 3 }).format(price);

// Helper: Generate realistic availability (GNWL 45 / AVAILABLE 12)
const getAvailability = (cls, date) => {
  const r = Math.random();
  if (r > 0.7) return { status: 'AVAILABLE', count: Math.floor(Math.random() * 200) + 10, color: 'text-green-600', bg: 'bg-green-50' };
  if (r > 0.4) return { status: 'RAC', count: Math.floor(Math.random() * 50) + 1, color: 'text-orange-600', bg: 'bg-orange-50' };
  return { status: 'GNWL', count: Math.floor(Math.random() * 100) + 1, probability: '78%', color: 'text-red-600', bg: 'bg-red-50' };
};

const generateTrains = (from, to, dateStr) => {
  const seed = dateStr.split('-').reduce((a, b) => parseInt(a) + parseInt(b), 0);
  const count = 8 + (seed % 4); // 8-12 trains
  const trains = [];

  for (let i = 0; i < count; i++) {
    const type = TRAIN_TYPES[Math.floor(Math.random() * TRAIN_TYPES.length)];
    const number = Math.floor(10000 + Math.random() * 90000);
    
    // Time Logic
    const deptHour = Math.floor(Math.random() * 24);
    const deptMin = [0, 15, 30, 45][Math.floor(Math.random() * 4)];
    const deptTime = new Date();
    deptTime.setHours(deptHour, deptMin);

    const durationMins = 300 + Math.floor(Math.random() * 600); // 5h to 15h
    const arrTime = new Date(deptTime.getTime() + durationMins * 60000);

    // Classes Logic (Generate prices for this specific train)
    const trainClasses = {};
    const availableClasses = type === 'Vande Bharat' || type === 'Shatabdi' ? ['CC', 'EC'] : ['1A', '2A', '3A', 'SL'];
    
    availableClasses.forEach(cls => {
      let base = 200 + (durationMins * 0.5); // Base formula
      if (cls === 'SL') base = base * 1;
      if (cls === '3A') base = base * 2.5;
      if (cls === '2A') base = base * 3.5;
      if (cls === '1A') base = base * 5.5;
      if (cls === 'CC') base = base * 2.2;
      if (cls === 'EC') base = base * 4.0;
      
      trainClasses[cls] = {
        price: Math.floor(base),
        ...getAvailability(cls, dateStr)
      };
    });

    trains.push({
      id: number,
      name: `${to.split(',')[0].toUpperCase()} ${type.toUpperCase()}`,
      number: number.toString(),
      type: type,
      fromCity: from.split(',')[0],
      toCity: to.split(',')[0],
      fromCode: getStationCode(from.split(',')[0]),
      toCode: getStationCode(to.split(',')[0]),
      deptTime: deptTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
      arrTime: arrTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
      duration: `${Math.floor(durationMins / 60)}h ${durationMins % 60}m`,
      durationMins: durationMins,
      classes: trainClasses,
      availableClasses: availableClasses,
      pantry: Math.random() > 0.3,
      rating: (3 + Math.random() * 2).toFixed(1),
      arrivesNextDay: deptHour + (durationMins/60) >= 24
    });
  }
  return trains.sort((a, b) => a.durationMins - b.durationMins);
};

// --- 2. SUB-COMPONENTS ---

const SkeletonCard = () => (
  <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm animate-pulse mb-4">
    <div className="flex justify-between mb-4">
      <div className="w-48 h-6 bg-gray-200 rounded"></div>
      <div className="w-16 h-4 bg-gray-200 rounded"></div>
    </div>
    <div className="flex justify-between items-center px-4 mb-6">
      <div className="w-16 h-8 bg-gray-200 rounded"></div>
      <div className="w-32 h-2 bg-gray-200 rounded"></div>
      <div className="w-16 h-8 bg-gray-200 rounded"></div>
    </div>
    <div className="flex gap-2 overflow-hidden">
      {[1,2,3,4].map(i => <div key={i} className="w-32 h-20 bg-gray-100 rounded-lg"></div>)}
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
        // Indian Railway logic: Weekend doesn't change price, dynamic pricing does (simulated later)
        return (
          <button
            key={idx}
            onClick={() => onDateChange(date.toISOString().split('T')[0])}
            className={`flex-1 min-w-[120px] py-3 px-4 flex flex-col items-center justify-center border-r border-gray-100 transition-colors ${
              isSelected ? 'bg-orange-50 border-b-2 border-b-orange-600' : 'hover:bg-gray-50'
            }`}
          >
            <span className={`text-xs font-bold uppercase mb-1 ${isSelected ? 'text-orange-600' : 'text-gray-500'}`}>
              {date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
            </span>
            <span className={`text-[10px] font-bold ${isSelected ? 'text-green-600' : 'text-gray-400'}`}>
              Available
            </span>
          </button>
        );
      })}
    </div>
  );
};

// --- 3. MAIN COMPONENT ---

const Trains = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);

  // Core State
  const [loading, setLoading] = useState(true);
  const [trains, setTrains] = useState([]);
  const [filteredTrains, setFilteredTrains] = useState([]);
  
  // UI State
  const [expandedRouteId, setExpandedRouteId] = useState(null);
  const [selectedClass, setSelectedClass] = useState({}); // Stores selected class per train ID { 12345: '3A' }

  // Search Params
  const [searchParams, setSearchParams] = useState({
    from: queryParams.get('from') || 'New Delhi',
    to: queryParams.get('to') || 'Mumbai',
    date: queryParams.get('date') || new Date().toISOString().split('T')[0],
    quota: 'General'
  });

  // Filters & Sort
  const [filters, setFilters] = useState({
    types: [], // Rajdhani, etc
    time: [],
    acOnly: false
  });

  // --- EFFECT: Fetch Trains ---
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      const data = generateTrains(searchParams.from, searchParams.to, searchParams.date);
      setTrains(data);
      // Initialize default selected class (usually 3A or CC)
      const initialClasses = {};
      data.forEach(t => { initialClasses[t.id] = t.availableClasses.includes('3A') ? '3A' : t.availableClasses[0] });
      setSelectedClass(initialClasses);
      setLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, [searchParams]);

  // --- EFFECT: Filter Logic ---
  useEffect(() => {
    let result = [...trains];

    if (filters.types.length > 0) {
      result = result.filter(t => filters.types.includes(t.type));
    }

    if (filters.acOnly) {
      result = result.filter(t => t.availableClasses.some(c => ['1A', '2A', '3A', 'CC', 'EC'].includes(c)));
    }

    if (filters.time.length > 0) {
      result = result.filter(t => {
        const hour = parseInt(t.deptTime.split(':')[0]);
        if (filters.time.includes('morning') && hour >= 6 && hour < 12) return true;
        if (filters.time.includes('night') && (hour >= 18 || hour < 6)) return true;
        return false;
      });
    }

    setFilteredTrains(result);
  }, [trains, filters]);

  // --- HANDLERS ---
  const handleClassSelect = (trainId, cls) => {
    setSelectedClass(prev => ({ ...prev, [trainId]: cls }));
  };

  const handleBook = (train) => {
    const cls = selectedClass[train.id];
    const details = train.classes[cls];
    if (details.status.includes('WL') && details.probability) {
      if(!window.confirm(`This ticket is Waitlisted (${details.status}). Probability: ${details.probability}. Continue?`)) return;
    }
    toast.success(`Booking ${cls} in ${train.name}`);
    navigate('/my-bookings');
  };

  const toggleFilter = (category, value) => {
    if (category === 'acOnly') {
      setFilters(prev => ({ ...prev, acOnly: !prev.acOnly }));
      return;
    }
    setFilters(prev => {
      const current = prev[category];
      const updated = current.includes(value) ? current.filter(i => i !== value) : [...current, value];
      return { ...prev, [category]: updated };
    });
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-20 font-sans text-gray-800">
      
      {/* 1. HEADER SECTION */}
      <div className="bg-white sticky top-16 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <div className="flex items-center gap-2 text-xl font-bold text-gray-800">
                <span>{searchParams.from.split(',')[0]}</span>
                <ArrowRight size={20} className="text-gray-400"/>
                <span>{searchParams.to.split(',')[0]}</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {new Date(searchParams.date).toDateString()} • {filteredTrains.length} Trains Available
              </p>
            </div>
            
            <div className="flex gap-2">
              <div className="relative">
                <select 
                  className="appearance-none bg-gray-50 border border-gray-200 text-sm font-bold text-gray-700 py-2 pl-4 pr-8 rounded-lg focus:outline-none focus:border-orange-500"
                  value={searchParams.quota}
                  onChange={(e) => setSearchParams(prev => ({...prev, quota: e.target.value}))}
                >
                  {QUOTAS.map(q => <option key={q} value={q}>{q} Quota</option>)}
                </select>
                <ChevronDown size={14} className="absolute right-3 top-3 text-gray-400 pointer-events-none" />
              </div>
              <button onClick={() => navigate('/')} className="text-orange-600 font-bold text-sm bg-orange-50 px-4 py-2 rounded-lg hover:bg-orange-100">
                Modify
              </button>
            </div>
          </div>
        </div>
        
        <DateStrip 
          selectedDate={searchParams.date} 
          onDateChange={(date) => setSearchParams(prev => ({ ...prev, date }))} 
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-6 flex flex-col lg:flex-row gap-6">
        
        {/* 2. SIDEBAR FILTERS */}
        <div className="w-full lg:w-1/4 hidden lg:block">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 sticky top-48">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-gray-800 flex items-center gap-2">
                <Filter size={18}/> Filters
              </h3>
              <button onClick={() => setFilters({ types: [], time: [], acOnly: false })} className="text-xs font-bold text-orange-600 hover:underline">Reset</button>
            </div>

            {/* Train Type */}
            <div className="mb-6">
              <h4 className="text-sm font-bold text-gray-700 mb-3">Train Type</h4>
              <div className="space-y-2">
                {['Rajdhani', 'Shatabdi', 'Vande Bharat', 'SuperFast'].map(type => (
                  <label key={type} className="flex items-center gap-3 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={filters.types.includes(type)}
                      onChange={() => toggleFilter('types', type)}
                      className="rounded text-orange-600 focus:ring-orange-500"
                    />
                    <span className="text-sm text-gray-600">{type}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Time Filter */}
            <div className="mb-6">
              <h4 className="text-sm font-bold text-gray-700 mb-3">Departure Time</h4>
              <div className="space-y-2">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" checked={filters.time.includes('morning')} onChange={() => toggleFilter('time', 'morning')} className="rounded text-orange-600"/>
                  <span className="text-sm text-gray-600">Morning (6 AM - 12 PM)</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" checked={filters.time.includes('night')} onChange={() => toggleFilter('time', 'night')} className="rounded text-orange-600"/>
                  <span className="text-sm text-gray-600">Night (6 PM - 6 AM)</span>
                </label>
              </div>
            </div>

            {/* AC Filter */}
            <div className="pt-4 border-t">
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-sm font-bold text-gray-700">AC Classes Only</span>
                <div className={`w-10 h-6 rounded-full p-1 transition-colors ${filters.acOnly ? 'bg-orange-500' : 'bg-gray-300'}`}>
                  <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${filters.acOnly ? 'translate-x-4' : ''}`}></div>
                </div>
                <input type="checkbox" className="hidden" checked={filters.acOnly} onChange={() => toggleFilter('acOnly', 'acOnly')} />
              </label>
            </div>

          </div>
        </div>

        {/* 3. TRAIN RESULTS */}
        <div className="w-full lg:w-3/4 space-y-4">
          
          {loading ? (
            <>
              <SkeletonCard />
              <SkeletonCard />
            </>
          ) : filteredTrains.length === 0 ? (
             <div className="text-center py-20 bg-white rounded-xl border border-dashed">
                <TrainFront size={48} className="mx-auto text-gray-300 mb-4" />
                <h3 className="text-xl font-bold text-gray-800">No trains found</h3>
                <p className="text-gray-500">Try changing the date or filters.</p>
             </div>
          ) : (
            filteredTrains.map((train) => (
              <div key={train.id} className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition duration-300">
                
                {/* Header: Name & Rating */}
                <div className="p-4 bg-gray-50 border-b border-gray-100 rounded-t-xl flex justify-between items-center">
                  <div>
                    <h3 className="font-bold text-gray-800 flex items-center gap-2">
                      {train.name} <span className="bg-gray-200 text-gray-600 px-2 py-0.5 rounded text-xs font-mono">{train.number}</span>
                    </h3>
                    <p className="text-xs text-gray-500 flex items-center gap-3 mt-1">
                      <span>Runs Daily</span>
                      {train.pantry && <span className="flex items-center gap-1 text-green-700"><Coffee size={10}/> Pantry Car</span>}
                    </p>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="bg-green-600 text-white text-xs font-bold px-2 py-1 rounded flex items-center gap-1">
                      {train.rating} ★
                    </span>
                  </div>
                </div>

                {/* Body: Time & Duration */}
                <div className="p-5 flex flex-col md:flex-row items-center gap-6">
                  
                  {/* Timeline */}
                  <div className="flex-1 flex items-center justify-between w-full">
                    <div className="text-center">
                      <p className="text-xl font-bold text-gray-800">{train.deptTime}</p>
                      <p className="text-xs font-bold text-gray-500">{train.fromCode}</p>
                      <p className="text-[10px] text-gray-400 mt-1">{train.fromCity}</p>
                    </div>

                    <div className="flex-1 px-4 flex flex-col items-center">
                      <p className="text-xs text-gray-500 mb-1">{train.duration}</p>
                      <div className="w-full h-[2px] bg-gray-300 relative">
                         <Train size={14} className="absolute -top-3 left-1/2 -ml-1.5 text-gray-400" />
                      </div>
                      <button 
                        onClick={() => setExpandedRouteId(expandedRouteId === train.id ? null : train.id)}
                        className="text-[10px] text-blue-600 font-bold mt-2 hover:underline"
                      >
                        View Route
                      </button>
                    </div>

                    <div className="text-center">
                      <p className="text-xl font-bold text-gray-800">{train.arrTime}</p>
                      <p className="text-xs font-bold text-gray-500">{train.toCode}</p>
                      <p className="text-[10px] text-gray-400 mt-1">{train.toCity}</p>
                    </div>
                  </div>

                </div>

                {/* CLASS SELECTOR GRID */}
                <div className="px-5 pb-5 overflow-x-auto">
                  <div className="flex gap-3 min-w-max">
                    {train.availableClasses.map(cls => {
                      const details = train.classes[cls];
                      const isSelected = selectedClass[train.id] === cls;
                      
                      return (
                        <button
                          key={cls}
                          onClick={() => handleClassSelect(train.id, cls)}
                          className={`min-w-[140px] text-left border rounded-lg p-3 transition-all ${
                            isSelected 
                              ? 'border-orange-500 bg-orange-50 ring-1 ring-orange-500' 
                              : 'border-gray-200 hover:border-gray-400 bg-white'
                          }`}
                        >
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-bold text-gray-800">{cls}</span>
                            <span className="font-bold text-gray-900">₹{formatPrice(details.price)}</span>
                          </div>
                          <div className={`text-xs font-bold ${details.color} flex items-center gap-1`}>
                            {details.status} {details.count}
                            {details.status === 'AVAILABLE' && <CheckCircle size={10}/>}
                            {details.status.includes('WL') && <AlertCircle size={10}/>}
                          </div>
                          {details.probability && <p className="text-[10px] text-gray-500 mt-1">Prob: {details.probability}</p>}
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* BOOK ACTION BAR */}
                <div className="bg-gray-50 px-5 py-3 border-t border-gray-100 flex justify-between items-center rounded-b-xl">
                  <div>
                    {selectedClass[train.id] && ['1A', '2A'].includes(selectedClass[train.id]) && (
                      <span className="text-xs text-green-700 flex items-center gap-1 font-bold">
                        <CheckCircle size={12}/> Free Cancellation
                      </span>
                    )}
                  </div>
                  <button 
                    onClick={() => handleBook(train)}
                    className="bg-orange-600 text-white px-8 py-2 rounded-lg font-bold hover:bg-orange-700 shadow-md transition transform active:scale-95"
                  >
                    Book {selectedClass[train.id]}
                  </button>
                </div>

                {/* ROUTE DRAWER */}
                {expandedRouteId === train.id && (
                  <div className="border-t border-gray-200 p-6 bg-gray-50 animate-fade-in">
                    <h4 className="font-bold text-sm text-gray-800 mb-4">Route Schedule</h4>
                    <div className="relative border-l-2 border-gray-300 ml-3 space-y-6">
                      <div className="pl-6 relative">
                        <div className="absolute -left-[21px] top-1 w-3 h-3 bg-gray-800 rounded-full border-2 border-white"></div>
                        <p className="text-sm font-bold">{train.fromCity} ({train.fromCode})</p>
                        <p className="text-xs text-gray-500">Departure: {train.deptTime}</p>
                      </div>
                      <div className="pl-6 relative">
                        <div className="absolute -left-[21px] top-1 w-3 h-3 bg-gray-400 rounded-full border-2 border-white"></div>
                        <p className="text-sm text-gray-600">Intermediate Stations (Mock)</p>
                        <p className="text-xs text-gray-400">Halts at 4 stations</p>
                      </div>
                      <div className="pl-6 relative">
                        <div className="absolute -left-[21px] top-1 w-3 h-3 bg-green-600 rounded-full border-2 border-white"></div>
                        <p className="text-sm font-bold">{train.toCity} ({train.toCode})</p>
                        <p className="text-xs text-gray-500">Arrival: {train.arrTime}</p>
                      </div>
                    </div>
                  </div>
                )}

              </div>
            ))
          )}

        </div>
      </div>
    </div>
  );
};

export default Trains;