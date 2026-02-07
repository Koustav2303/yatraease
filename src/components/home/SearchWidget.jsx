import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plane, Train, Bus, Building2, Car, UtensilsCrossed, Calendar, ArrowRightLeft } from 'lucide-react';
import CityInput from './CityInput';
import toast from 'react-hot-toast';
import { getFareTrend } from '../../data/cities';

const SearchWidget = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('flights');
  
  const [formData, setFormData] = useState({
    from: '',
    to: '',
    date: '',
    travelers: 1,
    class: 'Economy',
    pnr: ''
  });

  const [fareTrend, setFareTrend] = useState(null);

  const handleDateChange = (e) => {
    const date = e.target.value;
    setFormData({ ...formData, date });
    setFareTrend(getFareTrend(date));
  };

  const swapCities = () => {
    setFormData({ ...formData, from: formData.to, to: formData.from });
  };

  const handleSearch = () => {
    if (activeTab === 'food') {
      if (formData.pnr.length !== 10) return toast.error("PNR must be 10 digits");
      navigate(`/food?pnr=${formData.pnr}`);
      return;
    }

    if (activeTab !== 'hotels' && (!formData.from || !formData.to)) {
      return toast.error("Please select Origin and Destination");
    }
    
    if (activeTab === 'hotels' && !formData.to) {
      return toast.error("Please select a Destination City");
    }

    if (!formData.date) {
      return toast.error("Please select a Travel Date");
    }

    if (formData.from === formData.to && activeTab !== 'hotels') {
      return toast.error("Source and Destination cannot be same");
    }

    const query = `?from=${encodeURIComponent(formData.from)}&to=${encodeURIComponent(formData.to)}&date=${formData.date}`;
    toast.success(`Searching ${activeTab}...`);
    navigate(`/${activeTab}${query}`);
  };

  return (
    <div className="relative z-20 -mt-24 md:-mt-32 max-w-6xl mx-auto px-4 mb-10">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        
        {/* TABS HEADER - Scrollable on mobile */}
        <div className="flex overflow-x-auto bg-white border-b border-gray-100 no-scrollbar">
          {[
            { id: 'flights', icon: <Plane size={18} />, label: 'Flights' },
            { id: 'trains', icon: <Train size={18} />, label: 'Trains' },
            { id: 'bus', icon: <Bus size={18} />, label: 'Bus' },
            { id: 'hotels', icon: <Building2 size={18} />, label: 'Hotels' },
            { id: 'cabs', icon: <Car size={18} />, label: 'Cabs' },
            { id: 'food', icon: <UtensilsCrossed size={18} />, label: 'Food' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex flex-col items-center justify-center py-3 md:py-4 gap-2 transition-all min-w-[80px] md:min-w-[100px] ${
                activeTab === tab.id 
                  ? 'bg-blue-50 text-primary border-b-4 border-primary' 
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'
              }`}
            >
              <div className={`p-2 rounded-full ${activeTab === tab.id ? 'bg-blue-100' : 'bg-transparent'}`}>
                {tab.icon}
              </div>
              <span className="text-[10px] md:text-xs font-bold uppercase tracking-wider">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* FORM AREA */}
        <div className="p-4 md:p-8">
          
          {/* FOOD TAB (Updated for Mobile) */}
          {activeTab === 'food' ? (
            <div className="flex flex-col items-center justify-center py-4 md:py-8 animate-fade-in text-center">
              <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">Order Food on Train</h3>
              <p className="text-sm md:text-base text-gray-500 mb-6">Enter your 10-digit PNR to browse menus.</p>
              
              {/* Responsive Input Container */}
              <div className="w-full max-w-lg flex flex-col md:flex-row gap-3">
                <input 
                  type="text" 
                  maxLength="10"
                  placeholder="Enter PNR Number"
                  className="w-full p-4 border-2 border-gray-200 rounded-xl text-lg font-bold outline-none focus:border-secondary transition text-center md:text-left"
                  onChange={(e) => setFormData({...formData, pnr: e.target.value.replace(/\D/g, '')})}
                  value={formData.pnr}
                />
                <button 
                  onClick={handleSearch}
                  className="w-full md:w-auto bg-secondary text-white px-8 py-4 rounded-xl font-bold hover:bg-orange-600 transition shadow-lg active:scale-95 whitespace-nowrap"
                >
                  ORDER FOOD
                </button>
              </div>
            </div>
          ) : (
            
            // STANDARD TRAVEL FORM
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 items-end animate-fade-in">
              {activeTab !== 'hotels' && (
                <>
                  <div className="md:col-span-3">
                    <CityInput 
                      label={activeTab === 'cabs' ? "Pick-up" : "From"} 
                      placeholder="Origin" 
                      value={formData.from}
                      onChange={(val) => setFormData({...formData, from: val})}
                    />
                  </div>

                  <div className="md:col-span-1 flex justify-center -my-2 md:my-0 relative z-10">
                    <button onClick={swapCities} className="p-2 bg-white md:bg-gray-50 rounded-full shadow-md md:shadow-none border border-gray-200 text-primary transition hover:rotate-180">
                      <ArrowRightLeft size={16} className="rotate-90 md:rotate-0"/>
                    </button>
                  </div>

                  <div className="md:col-span-3">
                    <CityInput 
                      label={activeTab === 'cabs' ? "Drop" : "To"} 
                      placeholder="Destination" 
                      value={formData.to}
                      onChange={(val) => setFormData({...formData, to: val})}
                    />
                  </div>
                </>
              )}

              {activeTab === 'hotels' && (
                <div className="md:col-span-7">
                  <CityInput 
                    label="Destination" 
                    placeholder="Enter City, Hotel, or Area" 
                    value={formData.to}
                    onChange={(val) => setFormData({...formData, to: val})}
                  />
                </div>
              )}

              <div className="md:col-span-3 relative">
                <label className="text-xs text-gray-500 font-bold mb-1 uppercase tracking-wide">
                  {activeTab === 'hotels' ? 'Check-in' : 'Date'}
                </label>
                <div className="flex items-center gap-2 border-b-2 border-gray-200 py-2 hover:border-primary transition group focus-within:border-primary">
                  <Calendar size={18} className="text-gray-400 group-focus-within:text-primary"/>
                  <input 
                    type="date" 
                    className="w-full outline-none font-bold text-gray-800 bg-transparent"
                    onChange={handleDateChange}
                  />
                </div>
                {fareTrend && activeTab !== 'hotels' && (
                  <div className={`hidden md:flex absolute -bottom-6 left-0 text-[10px] font-bold items-center gap-1 ${fareTrend.color}`}>
                    <span>{fareTrend.icon}</span> {fareTrend.label}
                  </div>
                )}
              </div>

              <div className="md:col-span-2 mt-2 md:mt-0">
                <button 
                  onClick={handleSearch}
                  className="w-full h-12 md:h-14 bg-primary text-white font-bold text-lg rounded-xl shadow-lg shadow-blue-200 hover:bg-blue-700 hover:shadow-xl transition flex items-center justify-center gap-2"
                >
                  SEARCH
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchWidget;