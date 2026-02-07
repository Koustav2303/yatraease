import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast'; // <--- Import toast

const Login = ({ setUser }) => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const userData = {
      name: isLogin ? "Koustav Pan" : name,
      email: email,
      avatar: "" // Empty initially
    };

    setUser(userData);

    // --- TOAST NOTIFICATION ---
    if(isLogin) {
      toast.success("Welcome back, Traveler!");
    } else {
      toast.success("Account created successfully!");
    }
    
    navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="max-w-4xl w-full bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[600px]">
        
        {/* Left Side */}
        <div className="w-full md:w-1/2 bg-gradient-to-br from-blue-600 to-indigo-800 p-10 flex flex-col justify-between text-white relative">
           <div className="relative z-10">
             <h1 className="text-4xl font-bold mb-2">YatraEase</h1>
             <p className="text-blue-200">Your journey begins here.</p>
          </div>
          <div className="relative z-10 mb-10">
            <h2 className="text-3xl font-bold mb-4">{isLogin ? "Welcome Back!" : "Join the Adventure"}</h2>
            <p className="text-blue-100">Access your bookings and exclusive deals.</p>
          </div>
        </div>

        {/* Right Side */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">{isLogin ? "Sign in" : "Create Account"}</h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div className="relative">
                <User size={18} className="absolute top-4 left-3 text-gray-400" />
                <input type="text" placeholder="Full Name" value={name} onChange={e=>setName(e.target.value)} className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-primary" required />
              </div>
            )}
            <div className="relative">
              <Mail size={18} className="absolute top-4 left-3 text-gray-400" />
              <input type="email" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-primary" required />
            </div>
            <div className="relative">
              <Lock size={18} className="absolute top-4 left-3 text-gray-400" />
              <input type="password" placeholder="Password" className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-primary" required />
            </div>

            <button type="submit" className="w-full bg-primary text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2">
              {isLogin ? "LOGIN" : "SIGN UP"} <ArrowRight size={18} />
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-gray-600">
             <button onClick={() => setIsLogin(!isLogin)} className="text-primary font-bold hover:underline">
              {isLogin ? "New here? Create account" : "Have an account? Log in"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;