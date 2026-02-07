import React, { useState } from 'react';
import { Camera, Save, User } from 'lucide-react';
import toast from 'react-hot-toast'; // <--- Import toast

const ProfileSettings = ({ user, setUser }) => {
  const [preview, setPreview] = useState(user?.avatar || null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setPreview(imageUrl);
    }
  };

  const handleSave = () => {
    if (user) {
      setUser({ ...user, avatar: preview });
      toast.success("Profile updated successfully!"); // <--- Toast
    }
  };

  if (!user) return <div className="text-center mt-10">Please login first.</div>;

  return (
    <div className="max-w-2xl mx-auto px-4 py-10 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Profile Settings</h1>

      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
        
        <div className="flex flex-col items-center">
          <div className="relative group">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-xl bg-gray-100 flex items-center justify-center">
              {preview && preview.length > 2 ? (
                <img src={preview} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <span className="text-4xl font-bold text-gray-400">{user.name.charAt(0)}</span>
              )}
            </div>
            
            <label className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 transition shadow-md">
              <Camera size={20} />
              <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
            </label>
          </div>
          
          <h2 className="mt-4 text-xl font-bold text-gray-800">{user.name}</h2>
          <p className="text-gray-500">{user.email}</p>
        </div>

        <div className="mt-8 space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Full Name</label>
            <div className="p-3 bg-gray-50 border rounded-lg text-gray-500 cursor-not-allowed flex items-center gap-2">
              <User size={18}/> {user.name} (Read Only)
            </div>
          </div>
          
          <button 
            onClick={handleSave}
            className="w-full mt-6 bg-secondary text-white font-bold py-3 rounded-lg hover:bg-orange-600 transition flex items-center justify-center gap-2"
          >
            <Save size={18} /> SAVE CHANGES
          </button>
        </div>

      </div>
    </div>
  );
};

export default ProfileSettings;