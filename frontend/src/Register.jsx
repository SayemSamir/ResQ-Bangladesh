import React, { useState } from 'react';
import { registerUser } from './api';

export default function Register({ onRegisterSuccess }) {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
    phone: '',
  });
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const response = await registerUser(formData);
      setMessage(response.data.message || 'Registration Successful! Redirecting to login...');
      setIsError(false);
      
      // সফল হওয়ার পর ১.৫ সেকেন্ড পর স্বয়ংক্রিয়ভাবে লগইন ভিউতে নিয়ে যাবে
      if (onRegisterSuccess) {
        setTimeout(() => {
          onRegisterSuccess();
        }, 1500);
      }
    } catch (error) {
      setMessage(error.response?.data?.detail || 'Registration failed');
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-2xl shadow-sm border border-slate-200 mt-10">
      <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">Create an Account</h2>
      
      {message && (
        <div className={`mb-4 p-3 rounded-lg text-sm font-medium ${isError ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-emerald-50 text-emerald-600 border border-emerald-200'}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Full Name</label>
          <input 
            type="text" 
            name="full_name" 
            value={formData.full_name} 
            onChange={handleChange} 
            required 
            placeholder="Your Name"
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Email Address</label>
          <input 
            type="email" 
            name="email" 
            value={formData.email} 
            onChange={handleChange} 
            required 
            placeholder="name@example.com"
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Password</label>
          <input 
            type="password" 
            name="password" 
            value={formData.password} 
            onChange={handleChange} 
            required 
            placeholder="••••••••"
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Phone Number</label>
          <input 
            type="text" 
            name="phone" 
            value={formData.phone} 
            onChange={handleChange} 
            required 
            placeholder="01XXXXXXXXX"
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
          />
        </div>
        <button 
          type="submit"
          disabled={loading}
          className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition duration-200 cursor-pointer shadow-sm disabled:opacity-50 text-sm"
        >
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>
    </div>
  );
}