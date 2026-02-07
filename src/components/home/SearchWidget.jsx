import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// FIX: Imported ArrowRightLeft instead of ArrowRightArrowLeft
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
    pnr: '' // We will use this
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
    // --- 1. FOOD TAB LOGIC UPDATE ---
    if (activeTab === 'food') {
      if (formData.pnr.length !== 10) return toast.error("PNR must be 10 digits");
      // Navigate WITH the PNR in the URL
      navigate(`/food?pnr=${formData.pnr}`);
      return;
    }
    // --------------------------------

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
    <div className="relative z-20 -mt-32 max-w-6xl mx-auto px-4">
      <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
        
        {/* TABS HEADER */}
        <div className="flex overflow-x-auto bg-white border-b border-gray-100">
          {[
            { id: 'flights', icon: <Plane size={20} />, label: 'Flights' },
            { id: 'trains', icon: <Train size={20} />, label: 'Trains' },
            { id: 'bus', icon: <Bus size={20} />, label: 'Bus' },
            { id: 'hotels', icon: <Building2 size={20} />, label: 'Hotels' },
            { id: 'cabs', icon: <Car size={20} />, label: 'Outstation Cabs' },
            { id: 'food', icon: <UtensilsCrossed size={20} />, label: 'E-Catering' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex flex-col items-center justify-center py-4 gap-2 transition-all min-w-[100px] ${
                activeTab === tab.id 
                  ? 'bg-blue-50 text-primary border-b-4 border-primary' 
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'
              }`}
            >
              <div className={`p-2 rounded-full ${activeTab === tab.id ? 'bg-blue-100' : 'bg-transparent'}`}>
                {tab.icon}
              </div>
              <span className="text-xs font-bold uppercase tracking-wider">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* FORM AREA */}
        <div className="p-8">
          
          {/* FOOD TAB (Special Layout) */}
          {activeTab === 'food' ? (
            <div className="flex flex-col items-center justify-center py-8 animate-fade-in">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Order Food on Train</h3>
              <p className="text-gray-500 mb-6">Enter your PNR to see restaurants delivering to your seat.</p>
              <div className="flex w-full max-w-lg border-2 border-gray-200 rounded-lg overflow-hidden focus-within:border-secondary transition">
                <input 
                  type="text" 
                  maxLength="10"
                  placeholder="Enter 10-digit PNR"
                  className="flex-grow p-4 text-lg font-bold outline-none"
                  // Update state on typing
                  onChange={(e) => setFormData({...formData, pnr: e.target.value.replace(/\D/g, '')})}
                  value={formData.pnr}
                />
                <button 
                  onClick={handleSearch}
                  className="bg-secondary text-white px-8 font-bold hover:bg-orange-600 transition"
                >
                  ORDER
                </button>
              </div>
            </div>
          ) : (
            
            // STANDARD TRAVEL FORM
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end animate-fade-in">
              {activeTab !== 'hotels' && (
                <>
                  <div className="md:col-span-3">
                    <CityInput 
                      label={activeTab === 'cabs' ? "Pick-up City" : "From"} 
                      placeholder="Origin" 
                      value={formData.from}
                      onChange={(val) => setFormData({...formData, from: val})}
                    />
                  </div>

                  <div className="md:col-span-1 flex justify-center">
                    <button onClick={swapCities} className="p-2 bg-gray-50 rounded-full hover:bg-gray-100 border border-gray-200 text-primary transition hover:rotate-180">
                      <ArrowRightLeft size={16} />
                    </button>
                  </div>

                  <div className="md:col-span-3">
                    <CityInput 
                      label={activeTab === 'cabs' ? "Drop City" : "To"} 
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
                    label="Where do you want to stay?" 
                    placeholder="Enter City, Hotel, or Area" 
                    value={formData.to}
                    onChange={(val) => setFormData({...formData, to: val})}
                  />
                </div>
              )}

              <div className="md:col-span-3 relative">
                <label className="text-xs text-gray-500 font-bold mb-1 uppercase tracking-wide">
                  {activeTab === 'hotels' ? 'Check-in' : 'Departure'}
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
                  <div className={`absolute -bottom-6 left-0 text-xs font-bold flex items-center gap-1 ${fareTrend.color}`}>
                    <span>{fareTrend.icon}</span> {fareTrend.label}
                  </div>
                )}
              </div>

              <div className="md:col-span-2">
                <button 
                  onClick={handleSearch}
                  className="w-full h-14 bg-primary text-white font-bold text-lg rounded-lg shadow-lg shadow-blue-200 hover:bg-blue-700 hover:shadow-xl hover:-translate-y-1 transition flex items-center justify-center gap-2"
                >
                  SEARCH
                </button>
              </div>
            </div>
          )}
          
          {/* Options Row */}
          {activeTab !== 'food' && activeTab !== 'cabs' && (
             <div className="mt-6 pt-6 border-t border-dashed border-gray-200 flex gap-6 text-sm">
                <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 px-3 py-1 rounded">
                   <input type="radio" name="fare" defaultChecked className="text-primary focus:ring-primary"/>
                   <span className="font-semibold text-gray-700">Regular Fare</span>
                </div>
                <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 px-3 py-1 rounded">
                   <input type="radio" name="fare" className="text-primary focus:ring-primary"/>
                   <span className="font-semibold text-gray-700">Student <span className="text-xs text-gray-400">(Extra off)</span></span>
                </div>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchWidget;