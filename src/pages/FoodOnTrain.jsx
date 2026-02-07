import React, { useState, useEffect } from 'react'; // <--- Import useEffect
import { Search, ShoppingBag, Star, Clock, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate, useLocation } from 'react-router-dom'; // <--- Import useLocation

const FoodOnTrain = () => {
  const navigate = useNavigate();
  const location = useLocation(); // Hook to read URL
  
  const [pnr, setPnr] = useState('');
  const [loading, setLoading] = useState(false);
  const [trainDetails, setTrainDetails] = useState(null); 
  const [cart, setCart] = useState([]);
  const [isOrderPlaced, setIsOrderPlaced] = useState(false);

  // --- 1. AUTO-FETCH LOGIC ---
  useEffect(() => {
    // Read PNR from URL (e.g., /food?pnr=12345)
    const params = new URLSearchParams(location.search);
    const urlPnr = params.get('pnr');

    if (urlPnr && urlPnr.length === 10) {
      setPnr(urlPnr); // Set the input box value
      fetchPnrDetails(urlPnr); // Trigger the fetch automatically
    }
  }, [location]);

  const fetchPnrDetails = (pnrValue) => {
    setLoading(true);
    // Simulate API Call
    setTimeout(() => {
      setLoading(false);
      setTrainDetails({
        trainNo: "12309",
        trainName: "Rajdhani Express",
        station: "Kanpur Central (CNB)",
        coach: "B4",
        seat: "12",
        eta: "1:30 PM"
      });
      toast.success("PNR Verified! Showing restaurants.");
    }, 1500);
  };
  // ---------------------------

  const handleFetchPNR = (e) => {
    e.preventDefault();
    if (pnr.length !== 10) {
      toast.error("Please enter a valid 10-digit PNR");
      return;
    }
    fetchPnrDetails(pnr);
  };

  // ... (REST OF THE LOGIC IS SAME AS BEFORE: Restaurants Array, Cart Logic, etc.)
  const restaurants = [
    {
      id: 1,
      name: "Domino's Pizza",
      rating: 4.5,
      minOrder: 300,
      image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
      menu: [
        { id: 101, name: "Farmhouse Pizza (Med)", price: 459, type: "veg", desc: "Crunchy, crisp capsicum, succulent mushrooms and fresh tomatoes" },
        { id: 102, name: "Peppy Paneer (Med)", price: 429, type: "veg", desc: "Chunky paneer with crisp capsicum and spicy red pepper" },
        { id: 103, name: "Chicken Dominator (Med)", price: 579, type: "non-veg", desc: "Loaded with double pepper barbecue chicken" }
      ]
    },
    {
      id: 2,
      name: "Haldiram's",
      rating: 4.8,
      minOrder: 200,
      image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
      menu: [
        { id: 201, name: "Special Veg Thali", price: 280, type: "veg", desc: "Paneer, Dal Makhani, Mix Veg, Rice, 2 Roti, Sweet" },
        { id: 202, name: "Raj Kachori", price: 140, type: "veg", desc: "King of all kachoris, filled with potato & sprouts" },
        { id: 203, name: "Chole Bhature", price: 180, type: "veg", desc: "Spicy chick peas served with fried bread" }
      ]
    },
    {
      id: 3,
      name: "Behrouz Biryani",
      rating: 4.3,
      minOrder: 400,
      image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
      menu: [
        { id: 301, name: "Subz-e-Biryani", price: 345, type: "veg", desc: "Vegetables marinated in secret spices & layered with rice" },
        { id: 302, name: "Lazeez Bhuna Murgh Biryani", price: 475, type: "non-veg", desc: "Boneless chicken marinated in roasted spices" }
      ]
    }
  ];

  const addToCart = (item, restaurantName) => {
    if (cart.length > 0 && cart[0].restaurant !== restaurantName) {
      if(!window.confirm("Start a new basket? Orders can only be from one restaurant.")) return;
      setCart([{ ...item, qty: 1, restaurant: restaurantName }]);
      return;
    }
    const existingItem = cart.find(cartItem => cartItem.id === item.id);
    if (existingItem) {
      setCart(cart.map(cartItem => 
        cartItem.id === item.id ? { ...cartItem, qty: cartItem.qty + 1 } : cartItem
      ));
    } else {
      setCart([...cart, { ...item, qty: 1, restaurant: restaurantName }]);
      toast.success(`${item.name} added!`);
    }
  };

  const removeFromCart = (itemId) => {
    const existingItem = cart.find(item => item.id === itemId);
    if (existingItem.qty === 1) {
      setCart(cart.filter(item => item.id !== itemId));
    } else {
      setCart(cart.map(item => 
        item.id === itemId ? { ...item, qty: item.qty - 1 } : item
      ));
    }
  };

  const placeOrder = () => {
    setIsOrderPlaced(true);
    toast.success("Order Placed Successfully!");
  };

  if (isOrderPlaced) {
    return (
      <div className="min-h-screen bg-green-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-sm w-full animate-fade-in-up">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} className="text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Order Confirmed!</h2>
          <p className="text-gray-500 mb-6">Your food will be delivered at <strong>{trainDetails.station}</strong>.</p>
          <div className="bg-gray-50 p-4 rounded-xl border border-dashed border-gray-300 mb-6 text-left">
            <p className="text-xs text-gray-500 uppercase font-bold">Delivery Code</p>
            <p className="text-3xl font-mono font-bold text-gray-800 tracking-widest">8492</p>
          </div>
          <button onClick={() => navigate('/')} className="bg-primary text-white w-full py-3 rounded-xl font-bold hover:bg-blue-700">Go Home</button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-24">
      {!trainDetails ? (
        <div className="relative bg-gradient-to-r from-orange-600 to-red-600 h-[400px] flex flex-col justify-center items-center text-center px-4">
          <div className="relative z-10 max-w-2xl w-full">
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">Delicious Food at Your Seat</h1>
            <p className="text-orange-100 text-lg mb-8">Order from Top Restaurants | Hygienic | On-Time Delivery</p>
            <div className="bg-white p-2 rounded-full shadow-2xl flex pl-6 items-center">
              <input 
                type="text" 
                maxLength="10" 
                value={pnr} 
                onChange={(e) => setPnr(e.target.value.replace(/\D/g, ''))} 
                placeholder="Enter 10-digit PNR Number" 
                className="flex-grow text-gray-800 font-bold text-lg focus:outline-none placeholder-gray-400"
              />
              <button 
                onClick={handleFetchPNR} 
                disabled={loading}
                className="bg-gray-900 text-white rounded-full px-8 py-4 font-bold hover:scale-105 transition flex items-center gap-2 disabled:bg-gray-500"
              >
                {loading ? 'Fetching...' : 'SUBMIT'}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto px-4 pt-6 animate-fade-in-up">
          <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-orange-500 mb-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
               <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Ordering for</p>
               <h2 className="text-2xl font-bold text-gray-800">{trainDetails.station}</h2>
               <p className="text-green-600 font-medium flex items-center gap-1"><Clock size={16}/> ETA: {trainDetails.eta}</p>
            </div>
            <div className="text-right bg-gray-50 px-4 py-2 rounded-lg">
               <p className="font-bold text-gray-800">{trainDetails.trainName} ({trainDetails.trainNo})</p>
               <p className="text-sm text-gray-500">Coach: {trainDetails.coach} • Seat: {trainDetails.seat}</p>
            </div>
          </div>
          
          <div className="space-y-6">
            {restaurants.map((restaurant) => (
              <div key={restaurant.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 flex gap-4 items-center bg-gray-50 border-b border-gray-100">
                  <img src={restaurant.image} alt={restaurant.name} className="w-16 h-16 rounded-lg object-cover" />
                  <div>
                    <h3 className="font-bold text-lg text-gray-800">{restaurant.name}</h3>
                    <div className="flex items-center gap-3 text-sm text-gray-500">
                      <span className="flex items-center gap-1 bg-green-100 text-green-700 px-1.5 rounded font-bold text-xs"><Star size={10} fill="currentColor"/> {restaurant.rating}</span>
                      <span>Min Order ₹{restaurant.minOrder}</span>
                    </div>
                  </div>
                </div>
                <div className="p-4 space-y-4">
                  {restaurant.menu.map((item) => (
                    <div key={item.id} className="flex justify-between items-start">
                      <div className="w-3/4">
                        <div className="flex items-center gap-2">
                           <div className={`w-4 h-4 border flex items-center justify-center ${item.type === 'veg' ? 'border-green-600' : 'border-red-600'}`}>
                             <div className={`w-2 h-2 rounded-full ${item.type === 'veg' ? 'bg-green-600' : 'bg-red-600'}`}></div>
                           </div>
                           <h4 className="font-bold text-gray-700">{item.name}</h4>
                        </div>
                        <p className="text-sm text-gray-500 mt-1 line-clamp-1">{item.desc}</p>
                        <p className="font-bold text-gray-800 mt-1">₹{item.price}</p>
                      </div>
                      <div className="relative">
                        {cart.find(c => c.id === item.id) ? (
                          <div className="flex items-center bg-white border border-orange-500 rounded text-orange-600 font-bold overflow-hidden shadow-sm">
                            <button onClick={() => removeFromCart(item.id)} className="px-2 py-1 hover:bg-orange-50">-</button>
                            <span className="px-2 text-sm">{cart.find(c => c.id === item.id).qty}</span>
                            <button onClick={() => addToCart(item, restaurant.name)} className="px-2 py-1 hover:bg-orange-50">+</button>
                          </div>
                        ) : (
                          <button onClick={() => addToCart(item, restaurant.name)} className="bg-white border border-gray-300 text-green-600 px-6 py-1.5 rounded-lg font-bold shadow-sm text-sm hover:border-green-600 transition uppercase">ADD</button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {cart.length > 0 && (
        <div className="fixed bottom-0 left-0 w-full bg-white border-t shadow-2xl z-50 p-4 animate-fade-in-up">
          <div className="max-w-4xl mx-auto flex justify-between items-center">
            <div>
              <p className="text-xs text-gray-500 font-bold uppercase">{cart.length} items | {cart[0].restaurant}</p>
              <h3 className="text-xl font-bold text-gray-800">₹{cart.reduce((total, item) => total + (item.price * item.qty), 0)} <span className="text-xs font-normal text-gray-400">(plus taxes)</span></h3>
            </div>
            <button onClick={placeOrder} className="bg-green-600 text-white px-8 py-3 rounded-lg font-bold shadow-lg hover:bg-green-700 transition flex items-center gap-2">PAY & ORDER <ShoppingBag size={18}/></button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FoodOnTrain;