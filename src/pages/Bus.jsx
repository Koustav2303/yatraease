import React, { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  ArrowRight, Filter, Bus as BusIcon, Wifi, Plug, Star, 
  MapPin, Clock, ChevronDown, ChevronUp, Navigation, 
  ShieldCheck, Coffee, Sun, Moon, CheckCircle, Info
} from 'lucide-react';
import toast from 'react-hot-toast';

// --- 1. MOCK DATA & GENERATORS ---

const AMENITIES = [
  { label: 'Wifi', icon: <Wifi size={12}/> },
  { label: 'Charging Point', icon: <Plug size={12}/> },
  { label: 'Water Bottle', icon: <Coffee size={12}/> },
  { label: 'Reading Light', icon: <Sun size={12}/> },
  { label: 'Live Tracking', icon: <Navigation size={12}/> }
];

const BOARDING_POINTS = [
  { location: 'Majestic', time: '21:00' },
  { location: 'Anand Rao Circle', time: '21:15' },
  { location: 'Madiwala', time: '21:45' },
  { location: 'Silk Board', time: '22:00' },
  { location: 'Electronic City', time: '22:30' }
];

const DROPPING_POINTS = [
  { location: 'Mapusa', time: '06:00' },
  { location: 'Panjim', time: '06:30' },
  { location: 'Madgaon', time: '07:30' }
];

const generateBuses = (from, to, dateStr) => {
  const count = 10 + Math.floor(Math.random() * 5);
  const buses = [];
  const operators = ['VRL Travels', 'SRS Travels', 'Orange Travels', 'KSRTC (Airavat)', 'InterCity SmartBus', 'National Travels'];

  for (let i = 0; i < count; i++) {
    const isSleeper = Math.random() > 0.4;
    const isAC = Math.random() > 0.2;
    const operator = operators[Math.floor(Math.random() * operators.length)];
    
    // Time
    const deptHour = 18 + Math.floor(Math.random() * 6); // Evening buses (6PM - 12AM)
    const deptMin = [0, 15, 30, 45][Math.floor(Math.random() * 4)];
    const deptTime = new Date();
    deptTime.setHours(deptHour, deptMin);
    
    const duration = 480 + Math.floor(Math.random() * 120); // 8-10 hours
    const arrTime = new Date(deptTime.getTime() + duration * 60000);

    // Price
    let price = 800 + Math.floor(Math.random() * 1000);
    if (isAC) price += 300;
    if (isSleeper) price += 500;

    buses.push({
      id: `BUS-${i}`,
      operator: operator,
      type: `${isAC ? 'A/C' : 'Non-A/C'} ${isSleeper ? 'Sleeper (2+1)' : 'Seater (2+2)'}`,
      isSleeper,
      isAC,
      deptTime: deptTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
      arrTime: arrTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
      duration: `${Math.floor(duration / 60)}h ${duration % 60}m`,
      rating: (3.5 + Math.random() * 1.5).toFixed(1),
      ratingCount: Math.floor(Math.random() * 500),
      price: price,
      seatsLeft: Math.floor(Math.random() * 20) + 5,
      amenities: AMENITIES.sort(() => 0.5 - Math.random()).slice(0, 3),
      isPrimo: Math.random() > 0.8, // Top rated tag
      liveTracking: Math.random() > 0.5
    });
  }
  return buses.sort((a, b) => a.price - b.price);
};

// --- 2. SUB-COMPONENTS ---

const SkeletonCard = () => (
  <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm animate-pulse mb-4">
    <div className="flex justify-between mb-4">
      <div className="w-1/3 h-6 bg-gray-200 rounded"></div>
      <div className="w-1/4 h-6 bg-gray-200 rounded"></div>
    </div>
    <div className="flex justify-between items-center px-4 mb-6">
      <div className="w-16 h-8 bg-gray-200 rounded"></div>
      <div className="w-32 h-2 bg-gray-200 rounded"></div>
      <div className="w-16 h-8 bg-gray-200 rounded"></div>
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
        return (
          <button
            key={idx}
            onClick={() => onDateChange(date.toISOString().split('T')[0])}
            className={`flex-1 min-w-[120px] py-3 px-4 flex flex-col items-center justify-center border-r border-gray-100 transition-colors ${
              isSelected ? 'bg-red-50 border-b-2 border-b-red-600' : 'hover:bg-gray-50'
            }`}
          >
            <span className={`text-xs font-bold uppercase mb-1 ${isSelected ? 'text-red-600' : 'text-gray-500'}`}>
              {date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
            </span>
            <span className={`text-[10px] font-bold ${isSelected ? 'text-gray-800' : 'text-gray-400'}`}>
              {idx % 2 === 0 ? 'Filling Fast' : 'Available'}
            </span>
          </button>
        );
      })}
    </div>
  );
};

// --- 3. MAIN COMPONENT ---

const Bus = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  
  // Params
  const [searchParams, setSearchParams] = useState({
    from: queryParams.get('from') || 'Bengaluru',
    to: queryParams.get('to') || 'Goa',
    date: queryParams.get('date') || new Date().toISOString().split('T')[0]
  });

  // Data State
  const [buses, setBuses] = useState([]);
  const [filteredBuses, setFilteredBuses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter State
  const [filters, setFilters] = useState({
    ac: false,
    sleeper: false,
    primo: false,
    pickup: []
  });
  const [sortBy, setSortBy] = useState('price'); // price, rating, departure

  // UI State
  const [expandedBusId, setExpandedBusId] = useState(null); // Which bus's seats/details are open
  const [activeTab, setActiveTab] = useState('seats'); // 'seats', 'policy', 'points'
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [deckType, setDeckType] = useState('lower'); // 'lower' or 'upper'

  // --- EFFECT: Load Data ---
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      const data = generateBuses(searchParams.from, searchParams.to, searchParams.date);
      setBuses(data);
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, [searchParams]);

  // --- EFFECT: Filtering & Sorting ---
  useEffect(() => {
    let result = [...buses];

    if (filters.ac) result = result.filter(b => b.isAC);
    if (filters.sleeper) result = result.filter(b => b.isSleeper);
    if (filters.primo) result = result.filter(b => b.isPrimo);

    if (sortBy === 'price') result.sort((a, b) => a.price - b.price);
    if (sortBy === 'rating') result.sort((a, b) => b.rating - a.rating);
    if (sortBy === 'departure') result.sort((a, b) => parseInt(a.deptTime) - parseInt(b.deptTime));

    setFilteredBuses(result);
  }, [buses, filters, sortBy]);

  // --- HANDLERS ---
  const handleSelectSeat = (seatId) => {
    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(selectedSeats.filter(s => s !== seatId));
    } else {
      if(selectedSeats.length >= 6) return toast.error("Max 6 seats allowed");
      setSelectedSeats([...selectedSeats, seatId]);
    }
  };

  const handleBook = (bus) => {
    if (selectedSeats.length === 0) return toast.error("Please select a seat");
    toast.success(`Booking ${selectedSeats.length} seats on ${bus.operator}`);
    navigate('/my-bookings');
  };

  // --- SEAT LAYOUT RENDERER ---
  const renderSeatLayout = (bus) => {
    const isSleeper = bus.isSleeper;
    // Generate Mock Seat Grid
    // Sleeper: 1 column left, aisle, 2 columns right
    // Seater: 2 columns left, aisle, 2 columns right
    
    const rows = 6;
    const colsLeft = isSleeper ? 1 : 2;
    const colsRight = 2;

    const renderSeat = (r, c, side) => {
      const seatNo = `${deckType === 'lower' ? 'L' : 'U'}-${side}-${r}-${c}`;
      const isBooked = (r + c) % 5 === 0; // Mock booking
      const isSelected = selectedSeats.includes(seatNo);
      
      // Visual Logic
      const seatClass = isSleeper 
        ? "w-8 h-16 border rounded-md mb-2 flex flex-col justify-end p-1" // Sleeper Shape (Rect)
        : "w-8 h-8 border rounded mb-2 flex items-center justify-center"; // Seater Shape (Square)

      return (
        <button
          key={seatNo}
          disabled={isBooked}
          onClick={() => handleSelectSeat(seatNo)}
          className={`
            ${seatClass} transition-all relative
            ${isBooked ? 'bg-gray-300 border-gray-300 cursor-not-allowed' : 
              isSelected ? 'bg-red-500 border-red-600 text-white' : 
              'bg-white border-gray-400 hover:border-red-500'}
          `}
        >
          {isSleeper && <div className="w-full h-1 bg-gray-200 rounded-full mb-auto"></div>} {/* Pillow */}
          <span className="text-[9px] font-bold">{seatNo.split('-')[2]}</span>
        </button>
      );
    };

    return (
      <div className="flex justify-between w-64 mx-auto border-2 border-gray-300 rounded-xl p-4 bg-gray-50 relative">
        <div className="absolute top-2 right-2"><Navigation size={20} className="text-gray-300 transform rotate-45"/></div>
        
        {/* Left Row */}
        <div className="flex gap-2">
          {[...Array(colsLeft)].map((_, c) => (
             <div key={c} className="flex flex-col">
               {[...Array(rows)].map((_, r) => renderSeat(r, c, 'L'))}
             </div>
          ))}
        </div>

        {/* Aisle */}
        <div className="w-8 flex items-center justify-center text-xs text-gray-300 font-vertical tracking-widest uppercase">
          Walking Way
        </div>

        {/* Right Row */}
        <div className="flex gap-2">
          {[...Array(colsRight)].map((_, c) => (
             <div key={c} className="flex flex-col">
               {[...Array(rows)].map((_, r) => renderSeat(r, c, 'R'))}
             </div>
          ))}
        </div>
      </div>
    );
  };


  return (
    <div className="bg-gray-50 min-h-screen pb-20 font-sans text-gray-800">
      
      {/* 1. HEADER */}
      <div className="bg-white sticky top-16 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
             <div className="flex items-center gap-2 text-xl font-bold">
               <span>{searchParams.from}</span>
               <ArrowRight size={20} className="text-gray-400"/>
               <span>{searchParams.to}</span>
             </div>
             <p className="text-xs text-gray-500 mt-1">{new Date(searchParams.date).toDateString()} • {filteredBuses.length} Buses</p>
          </div>
          <button onClick={() => navigate('/')} className="text-red-600 font-bold text-sm bg-red-50 px-4 py-2 rounded-lg hover:bg-red-100">Modify</button>
        </div>
        <DateStrip 
          selectedDate={searchParams.date} 
          onDateChange={(d) => setSearchParams(prev => ({...prev, date: d}))} 
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-6 flex flex-col lg:flex-row gap-6">
        
        {/* 2. SIDEBAR FILTERS */}
        <div className="w-full lg:w-1/4 hidden lg:block">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 sticky top-48">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-gray-800 flex items-center gap-2"><Filter size={18}/> Filters</h3>
              <button onClick={() => setFilters({ ac: false, sleeper: false, primo: false })} className="text-xs font-bold text-red-600 hover:underline">Reset</button>
            </div>
            
            <div className="space-y-4">
               <label className="flex items-center justify-between cursor-pointer p-2 hover:bg-gray-50 rounded">
                 <div className="flex items-center gap-2">
                    <Sun size={18} className="text-gray-400"/>
                    <span className="text-sm font-semibold">AC Buses</span>
                 </div>
                 <input type="checkbox" checked={filters.ac} onChange={() => setFilters(prev => ({...prev, ac: !prev.ac}))} className="accent-red-600 w-4 h-4"/>
               </label>
               
               <label className="flex items-center justify-between cursor-pointer p-2 hover:bg-gray-50 rounded">
                 <div className="flex items-center gap-2">
                    <Moon size={18} className="text-gray-400"/>
                    <span className="text-sm font-semibold">Sleeper</span>
                 </div>
                 <input type="checkbox" checked={filters.sleeper} onChange={() => setFilters(prev => ({...prev, sleeper: !prev.sleeper}))} className="accent-red-600 w-4 h-4"/>
               </label>
               
               <label className="flex items-center justify-between cursor-pointer p-2 hover:bg-gray-50 rounded">
                 <div className="flex items-center gap-2">
                    <ShieldCheck size={18} className="text-yellow-500"/>
                    <span className="text-sm font-semibold">Primo (Top Rated)</span>
                 </div>
                 <input type="checkbox" checked={filters.primo} onChange={() => setFilters(prev => ({...prev, primo: !prev.primo}))} className="accent-red-600 w-4 h-4"/>
               </label>
            </div>
          </div>
        </div>

        {/* 3. BUS RESULTS */}
        <div className="w-full lg:w-3/4 space-y-4">
          
          {/* Sort Bar */}
          <div className="bg-white p-3 rounded-lg border border-gray-200 flex gap-4 text-sm font-medium overflow-x-auto">
            {['price', 'rating', 'departure'].map(s => (
              <button 
                key={s} 
                onClick={() => setSortBy(s)}
                className={`px-4 py-1.5 rounded-full capitalize whitespace-nowrap ${sortBy === s ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              >
                Sort by {s}
              </button>
            ))}
          </div>

          {loading ? (
            <>
              <SkeletonCard />
              <SkeletonCard />
            </>
          ) : filteredBuses.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-xl border border-dashed">
              <BusIcon size={48} className="mx-auto text-gray-300 mb-4"/>
              <h3 className="text-xl font-bold text-gray-800">No buses found</h3>
              <p className="text-gray-500">Try changing filters or date.</p>
            </div>
          ) : (
            filteredBuses.map((bus) => (
              <div key={bus.id} className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition duration-300 overflow-hidden">
                
                {/* Main Card */}
                <div className="p-5 flex flex-col md:flex-row gap-4">
                  
                  {/* Operator & Type */}
                  <div className="w-full md:w-1/3">
                    <h3 className="font-bold text-lg text-gray-900 flex items-center gap-2">
                      {bus.operator}
                      {bus.isPrimo && <span className="bg-yellow-100 text-yellow-700 text-[10px] px-1.5 py-0.5 rounded flex items-center gap-1"><ShieldCheck size={10}/> Primo</span>}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">{bus.type}</p>
                    
                    <div className="flex gap-2 mt-3">
                      {bus.amenities.map((am, i) => (
                        <div key={i} className="bg-gray-50 text-gray-500 p-1 rounded hover:bg-gray-100" title={am.label}>
                          {am.icon}
                        </div>
                      ))}
                      {bus.liveTracking && (
                        <div className="bg-green-50 text-green-600 p-1 rounded flex items-center gap-1 text-[10px] font-bold px-2">
                           <Navigation size={10}/> Live Track
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Timing */}
                  <div className="w-full md:w-1/3 flex items-center justify-between text-center px-2">
                    <div>
                      <p className="text-xl font-bold text-gray-800">{bus.deptTime}</p>
                      <p className="text-xs text-gray-400">Departure</p>
                    </div>
                    <div className="flex flex-col items-center w-full px-4">
                      <p className="text-xs text-gray-400 mb-1">{bus.duration}</p>
                      <div className="w-full h-[1px] bg-gray-300 relative"></div>
                    </div>
                    <div>
                      <p className="text-xl font-bold text-gray-800">{bus.arrTime}</p>
                      <p className="text-xs text-gray-400">Arrival</p>
                    </div>
                  </div>

                  {/* Price & Rating */}
                  <div className="w-full md:w-1/3 flex flex-col items-end justify-between pl-4 border-l border-dashed border-gray-200">
                    <div className="text-right">
                      <p className="text-2xl font-bold text-gray-800">₹{bus.price}</p>
                      <div className="flex items-center justify-end gap-2 mt-1">
                        <span className="bg-green-500 text-white text-xs font-bold px-1.5 py-0.5 rounded flex items-center gap-1">
                          {bus.rating} <Star size={8} fill="currentColor"/>
                        </span>
                        <span className="text-xs text-gray-400">{bus.ratingCount} ratings</span>
                      </div>
                    </div>
                    <button 
                      onClick={() => {
                        setExpandedBusId(expandedBusId === bus.id ? null : bus.id);
                        setActiveTab('seats');
                        setSelectedSeats([]);
                      }}
                      className="bg-red-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-red-700 transition w-full md:w-auto mt-4"
                    >
                      {expandedBusId === bus.id ? 'Hide Seats' : 'Select Seats'}
                    </button>
                  </div>
                </div>

                {/* EXPANDED DRAWER */}
                {expandedBusId === bus.id && (
                  <div className="border-t border-gray-200 bg-gray-50 animate-fade-in">
                    
                    {/* Drawer Tabs */}
                    <div className="flex border-b border-gray-200 bg-white">
                      {[
                        { id: 'seats', label: 'Select Seats' },
                        { id: 'points', label: 'Boarding & Dropping' },
                        { id: 'policy', label: 'Cancellation Policy' }
                      ].map(tab => (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id)}
                          className={`px-6 py-3 text-sm font-bold transition-colors ${
                            activeTab === tab.id 
                              ? 'text-red-600 border-b-2 border-red-600 bg-red-50' 
                              : 'text-gray-500 hover:text-gray-800'
                          }`}
                        >
                          {tab.label}
                        </button>
                      ))}
                    </div>

                    {/* CONTENT: SEATS */}
                    {activeTab === 'seats' && (
                      <div className="p-6 flex flex-col md:flex-row gap-8">
                        
                        {/* 1. Seat Price Legend & Total */}
                        <div className="w-full md:w-1/3 space-y-4">
                          <h4 className="font-bold text-gray-800 text-sm">Seat Legend</h4>
                          <div className="flex gap-4 text-xs text-gray-600">
                             <div className="flex items-center gap-2"><div className="w-4 h-4 border border-gray-400 bg-white rounded"></div> Available</div>
                             <div className="flex items-center gap-2"><div className="w-4 h-4 bg-gray-300 rounded"></div> Booked</div>
                             <div className="flex items-center gap-2"><div className="w-4 h-4 bg-red-500 rounded"></div> Selected</div>
                          </div>

                          {/* Deck Toggle for Sleeper */}
                          {bus.isSleeper && (
                            <div className="mt-4 p-1 bg-gray-200 rounded-lg inline-flex">
                              {['lower', 'upper'].map(d => (
                                <button
                                  key={d}
                                  onClick={() => setDeckType(d)}
                                  className={`px-4 py-1.5 text-xs font-bold rounded-md capitalize transition ${
                                    deckType === d ? 'bg-white shadow-sm text-gray-800' : 'text-gray-500'
                                  }`}
                                >
                                  {d} Deck
                                </button>
                              ))}
                            </div>
                          )}

                          {/* Booking Summary */}
                          <div className="mt-8 border-t pt-4">
                            <div className="flex justify-between mb-2">
                              <span className="text-gray-600 text-sm">Selected Seats</span>
                              <span className="font-bold text-gray-800">{selectedSeats.length > 0 ? selectedSeats.join(', ') : '-'}</span>
                            </div>
                            <div className="flex justify-between mb-4">
                              <span className="text-gray-600 text-sm">Total Amount</span>
                              <span className="font-bold text-xl text-gray-900">₹{selectedSeats.length * bus.price}</span>
                            </div>
                            <button onClick={() => handleBook(bus)} className="w-full bg-red-600 text-white py-3 rounded-lg font-bold hover:bg-red-700">
                              PROCEED TO BOOK
                            </button>
                          </div>
                        </div>

                        {/* 2. Seat Layout UI */}
                        <div className="w-full md:w-2/3 flex justify-center bg-white p-4 rounded-xl border border-gray-200">
                           {renderSeatLayout(bus)}
                        </div>
                      </div>
                    )}

                    {/* CONTENT: POINTS */}
                    {activeTab === 'points' && (
                      <div className="p-6 grid grid-cols-2 gap-8">
                         <div>
                            <h4 className="font-bold text-gray-800 mb-4 border-b pb-2">Boarding Points</h4>
                            <div className="space-y-3">
                              {BOARDING_POINTS.map((pt, i) => (
                                <label key={i} className="flex justify-between items-center cursor-pointer p-2 hover:bg-white rounded border border-transparent hover:border-gray-200">
                                   <div className="flex items-center gap-3">
                                      <input type="radio" name="board" className="accent-red-600"/>
                                      <span className="text-sm font-medium text-gray-700">{pt.location}</span>
                                   </div>
                                   <span className="text-sm font-bold text-gray-900">{pt.time}</span>
                                </label>
                              ))}
                            </div>
                         </div>
                         <div>
                            <h4 className="font-bold text-gray-800 mb-4 border-b pb-2">Dropping Points</h4>
                            <div className="space-y-3">
                              {DROPPING_POINTS.map((pt, i) => (
                                <label key={i} className="flex justify-between items-center cursor-pointer p-2 hover:bg-white rounded border border-transparent hover:border-gray-200">
                                   <div className="flex items-center gap-3">
                                      <input type="radio" name="drop" className="accent-red-600"/>
                                      <span className="text-sm font-medium text-gray-700">{pt.location}</span>
                                   </div>
                                   <span className="text-sm font-bold text-gray-900">{pt.time}</span>
                                </label>
                              ))}
                            </div>
                         </div>
                      </div>
                    )}

                    {/* CONTENT: POLICY */}
                    {activeTab === 'policy' && (
                      <div className="p-6">
                        <table className="w-full text-sm text-left">
                          <thead className="bg-gray-100 text-gray-700">
                            <tr>
                              <th className="p-3 rounded-l-lg">Cancellation Time</th>
                              <th className="p-3 rounded-r-lg">Penalty</th>
                            </tr>
                          </thead>
                          <tbody className="text-gray-600">
                            <tr className="border-b"><td className="p-3">Before 24 hrs</td><td className="p-3 font-bold text-green-600">10%</td></tr>
                            <tr className="border-b"><td className="p-3">12 to 24 hrs</td><td className="p-3 font-bold text-orange-500">25%</td></tr>
                            <tr className="border-b"><td className="p-3">0 to 12 hrs</td><td className="p-3 font-bold text-red-600">50%</td></tr>
                          </tbody>
                        </table>
                      </div>
                    )}

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

export default Bus;