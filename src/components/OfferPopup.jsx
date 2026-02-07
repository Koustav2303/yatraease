import React, { useState, useEffect } from 'react';
import { X, Gift, Copy, CheckCircle, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

const OfferPopup = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [copied, setCopied] = useState(false);

  // Show after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText("YATRANEW");
    setCopied(true);
    toast.success("Coupon Code Copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-[100] max-w-sm w-full px-4 md:px-0 animate-fade-in-up">
      
      {/* Container with Gold Gradient Glow */}
      <div className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl blur opacity-60 group-hover:opacity-100 transition duration-1000"></div>
        
        <div className="relative bg-gray-900 rounded-2xl p-6 shadow-2xl border border-gray-800">
          
          {/* Header */}
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-3">
              <div className="bg-orange-500/20 p-2 rounded-lg border border-orange-500/30">
                <Gift size={24} className="text-orange-400 animate-bounce" />
              </div>
              <div>
                <h3 className="text-white font-bold text-lg">Flat 15% OFF! 🔥</h3>
                <p className="text-gray-400 text-xs">First Booking Special</p>
              </div>
            </div>
            <button 
              onClick={() => setIsVisible(false)}
              className="text-gray-500 hover:text-white transition"
            >
              <X size={20} />
            </button>
          </div>

          {/* Description */}
          <p className="text-gray-300 text-sm mb-5 leading-relaxed">
            Planning a trip? Use this code to get instant discount on <span className="text-white font-bold">Flights & Hotels</span>. Max discount ₹1500.
          </p>

          {/* Coupon Code Box */}
          <div 
            onClick={handleCopy}
            className="bg-black/50 border border-dashed border-gray-600 rounded-xl p-3 flex justify-between items-center cursor-pointer hover:border-orange-500 transition group/box mb-4"
          >
            <div className="flex flex-col">
              <span className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Coupon Code</span>
              <span className="text-xl font-mono font-bold text-yellow-400 tracking-widest">YATRANEW</span>
            </div>
            <button className="bg-gray-800 p-2 rounded-lg text-white group-hover/box:bg-orange-600 transition">
              {copied ? <CheckCircle size={18} /> : <Copy size={18} />}
            </button>
          </div>

          {/* Action Button */}
          <button 
            onClick={() => {
              setIsVisible(false);
              toast("Code applied! Start searching.", { icon: '🚀' });
            }}
            className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold py-3 rounded-xl shadow-lg hover:shadow-orange-500/20 transition transform active:scale-95 flex items-center justify-center gap-2"
          >
            Claim Offer Now <ArrowRight size={16}/>
          </button>

        </div>
      </div>
    </div>
  );
};

export default OfferPopup;