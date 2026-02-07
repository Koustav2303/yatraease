import React, { useState } from 'react';
import { AlertTriangle, Hammer, X } from 'lucide-react';

const DevNotice = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="bg-amber-50 border-b border-amber-200 text-amber-900 px-4 py-3 relative z-50">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-sm">
        
        {/* Left: Icon & Message */}
        <div className="flex items-center gap-3 text-center md:text-left">
          <div className="bg-amber-100 p-2 rounded-full hidden md:block">
            <Hammer size={16} className="text-amber-600" />
          </div>
          <p>
            <span className="font-bold flex items-center justify-center md:justify-start gap-2">
              <AlertTriangle size={14} className="md:hidden"/> 
              Work in Progress:
            </span> 
            <span className="ml-1 opacity-90">
              You are viewing the <strong>Beta Version</strong>. Payments & Bookings are simulated. 
              More features are being added daily! 🚧
            </span>
          </p>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-4">
          <span className="hidden md:inline text-xs font-bold px-2 py-1 bg-amber-200 rounded text-amber-800 uppercase tracking-wider">
            v0.5.0 Beta
          </span>
          
          <button 
            onClick={() => setIsVisible(false)}
            className="p-1 hover:bg-amber-200 rounded-full transition text-amber-700"
            aria-label="Dismiss notice"
          >
            <X size={18} />
          </button>
        </div>

      </div>
    </div>
  );
};

export default DevNotice;