import React from 'react';
import SearchWidget from '../components/home/SearchWidget';
import { ShieldCheck, Clock, CreditCard, Headset } from 'lucide-react';

const Home = () => {
  return (
    <div className="bg-gray-50 min-h-screen">
      
      {/* 1. HERO SECTION */}
      <div className="relative h-[600px] bg-blue-900 overflow-hidden">
        {/* Abstract Shapes/Background Image */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 opacity-90"></div>
        <div className="absolute top-0 right-0 w-1/2 h-full bg-white opacity-5 rounded-l-full blur-3xl transform translate-x-20"></div>
        <div className="absolute bottom-0 left-0 w-1/2 h-full bg-pink-500 opacity-10 rounded-r-full blur-3xl transform -translate-x-20"></div>
        
        {/* Hero Text */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 pt-32 text-center text-white">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight">
            Explore the World with <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-cyan-200">YatraEase</span>
          </h1>
          <p className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto mb-10 leading-relaxed">
            India's most comprehensive travel platform. Book flights, trains, buses, and hotels seamlessly with our AI-powered fare prediction.
          </p>
        </div>
      </div>

      {/* 2. SEARCH WIDGET (Overlaps the Hero) */}
      <SearchWidget />

      {/* 3. LAST MILE CONNECTIVITY (Local Travel) */}
      <div className="max-w-7xl mx-auto px-4 mt-20">
        <div className="flex items-center justify-between mb-8">
           <h2 className="text-2xl font-bold text-gray-800">Local City Connectivity</h2>
           <span className="text-xs font-bold bg-green-100 text-green-700 px-3 py-1 rounded-full">Intra-City</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Uber */}
          <a href="https://m.uber.com/ul" target="_blank" rel="noreferrer" className="group bg-black text-white p-8 rounded-2xl flex items-center justify-between hover:shadow-2xl hover:-translate-y-1 transition duration-300">
             <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Ride Now</p>
                <h3 className="text-3xl font-bold group-hover:text-blue-400 transition">Uber</h3>
                <p className="text-sm text-gray-500 mt-2">Intercity & Local Rides</p>
             </div>
             <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center group-hover:bg-white group-hover:text-black transition">
                <ArrowUpRightIcon />
             </div>
          </a>

          {/* Ola */}
          <a href="https://book.olacabs.com/" target="_blank" rel="noreferrer" className="group bg-[#CDDC39] text-black p-8 rounded-2xl flex items-center justify-between hover:shadow-2xl hover:-translate-y-1 transition duration-300">
             <div>
                <p className="text-xs font-bold text-gray-700 uppercase tracking-widest mb-1">Book Cab</p>
                <h3 className="text-3xl font-bold group-hover:text-white transition">Ola</h3>
                <p className="text-sm text-gray-800 mt-2">Cabs, Autos & Bikes</p>
             </div>
             <div className="w-12 h-12 rounded-full bg-black/10 flex items-center justify-center group-hover:bg-black group-hover:text-white transition">
                <ArrowUpRightIcon />
             </div>
          </a>

          {/* Rapido */}
          <a href="https://rapido.bike/" target="_blank" rel="noreferrer" className="group bg-[#F9C933] text-black p-8 rounded-2xl flex items-center justify-between hover:shadow-2xl hover:-translate-y-1 transition duration-300">
             <div>
                <p className="text-xs font-bold text-gray-700 uppercase tracking-widest mb-1">Bike Taxi</p>
                <h3 className="text-3xl font-bold group-hover:text-white transition">Rapido</h3>
                <p className="text-sm text-gray-800 mt-2">Fastest way to travel</p>
             </div>
             <div className="w-12 h-12 rounded-full bg-black/10 flex items-center justify-center group-hover:bg-black group-hover:text-white transition">
                <ArrowUpRightIcon />
             </div>
          </a>
        </div>
      </div>

      {/* 4. WHY CHOOSE US (Trust Signals) */}
      <div className="max-w-7xl mx-auto px-4 py-20">
        <h2 className="text-2xl font-bold text-gray-800 mb-10 text-center">Why Book With YatraEase?</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {[
            { icon: <ShieldCheck size={40} className="text-blue-500"/>, title: "100% Secure", desc: "Bank-grade security for all payments." },
            { icon: <Clock size={40} className="text-orange-500"/>, title: "24/7 Support", desc: "We are here for you, anytime, anywhere." },
            { icon: <CreditCard size={40} className="text-green-500"/>, title: "Instant Refunds", desc: "Get refunds processed within 1 hour." },
            { icon: <Headset size={40} className="text-purple-500"/>, title: "Expert Guidance", desc: "Personalized travel advice for free." },
          ].map((item, idx) => (
            <div key={idx} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-lg transition text-center border border-gray-100">
               <div className="bg-gray-50 w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-4">{item.icon}</div>
               <h3 className="font-bold text-lg mb-2">{item.title}</h3>
               <p className="text-sm text-gray-500">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

// Helper Icon for Links
const ArrowUpRightIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg>
);

export default Home;