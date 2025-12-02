// src/components/ProfileForm.jsx
import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/authContext';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate, Link } from 'react-router-dom';

const ProfileForm = () => {
  const navigate = useNavigate();
  const { user, loading, logout } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
  });
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || '',
        email: user.email || '',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      const res = await axios.put('http://localhost:8000/api/auth/profile', formData, { withCredentials: true });
      
      Swal.fire({
        icon: 'success',
        title: 'Profile updated successfully!',
        text: `Welcome back, ${res.data.data.user.username}!`,
        confirmButtonText: 'OK',
      }).then(() => {
        navigate('/'); 
      });

    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Update Failed',
        text: err.response?.data?.message || 'Something went wrong!',
      });
    } finally {
      setUpdating(false);
    }
  };

if (loading) return <p className="text-center mt-10">Loading...</p>;
if (!user) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md text-center">
        <h2 className="text-2xl font-bold mb-4 text-red-600">You are not logged in</h2>
        <p className="mb-6 text-gray-700">
          Please log in to access your profile.
        </p>
        <Link
          to="/login"
          className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
        >
          Go to Login
        </Link>
      </div>
    </div>
  );
}

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-indigo-600 text-white p-4 flex justify-between items-center">
        <h1 className="font-bold text-xl">Profile Page</h1>
        <div className="space-x-4">
          <button
            onClick={logout}
            className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Profile Form */}
      <div className="flex items-center justify-center p-4 mt-10">
        <div className="bg-white shadow-lg rounded-lg w-full max-w-md p-6 relative">
          <div className="flex justify-center">
            <img
              src={user.avatar || 'https://avatars0.githubusercontent.com/u/35900628?v=4'}
              alt="avatar"
              className="rounded-full w-32 h-32 shadow-md border-4 border-white -mt-16"
            />
          </div>
          <h2 className="text-3xl font-bold text-center mt-4">{user.username}</h2>
          <p className="text-center text-gray-500 mb-6">{user.email}</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-700 font-medium mb-1">Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={updating}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 rounded-lg transition-colors"
            >
              {updating ? 'Updating...' : 'Update Profile'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfileForm;
