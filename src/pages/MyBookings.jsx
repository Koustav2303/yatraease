import React from 'react';
import { Plane, Train, UtensilsCrossed, Calendar, MapPin, CheckCircle, Clock } from 'lucide-react';

const MyBookings = () => {
  // Mock Booking Data
  const bookings = [
    {
      id: 1,
      type: 'flight',
      title: 'New Delhi → Mumbai',
      date: '14 Oct 2026',
      status: 'Upcoming',
      details: 'IndiGo 6E-2341 • Seat 12A',
      price: '₹4,500',
      icon: <Plane className="text-blue-600" size={24} />
    },
    {
      id: 2,
      type: 'train',
      title: 'Howrah → Puri',
      date: '20 Sep 2026',
      status: 'Completed',
      details: 'Vande Bharat Exp • Coach C4',
      price: '₹1,200',
      icon: <Train className="text-orange-600" size={24} />
    },
    {
      id: 3,
      type: 'food',
      title: 'Food Order (Train 12301)',
      date: '20 Sep 2026',
      status: 'Delivered',
      details: 'Veg Thali • Seat 45',
      price: '₹250',
      icon: <UtensilsCrossed className="text-red-600" size={24} />
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">My Bookings</h1>

      <div className="space-y-6">
        {bookings.map((booking) => (
          <div key={booking.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col md:flex-row justify-between items-center hover:shadow-md transition">
            
            {/* Left: Icon & Title */}
            <div className="flex items-center gap-4 w-full md:w-1/2">
              <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center">
                {booking.icon}
              </div>
              <div>
                <h3 className="font-bold text-lg text-gray-800">{booking.title}</h3>
                <p className="text-sm text-gray-500 flex items-center gap-1">
                  <Calendar size={14} /> {booking.date}
                </p>
              </div>
            </div>

            {/* Middle: Details */}
            <div className="w-full md:w-1/4 mt-4 md:mt-0">
              <p className="text-sm font-medium text-gray-700">{booking.details}</p>
              <p className="text-xs text-gray-400">Paid: {booking.price}</p>
            </div>

            {/* Right: Status */}
            <div className="w-full md:w-1/4 mt-4 md:mt-0 flex justify-end">
              <span className={`px-4 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${
                booking.status === 'Upcoming' 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'bg-green-100 text-green-700'
              }`}>
                {booking.status === 'Upcoming' ? <Clock size={12}/> : <CheckCircle size={12}/>}
                {booking.status}
              </span>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
};

export default MyBookings;