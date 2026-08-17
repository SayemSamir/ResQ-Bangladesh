import React, { useState } from 'react';
import { loginUser, registerUser } from './api';

export default function Login({ onLoginSuccess }) {
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
    phone_number: '',
  });
  const [message, setMessage] = useState({ text: '', type: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: '', type: '' });

    try {
      if (isRegister) {
        await registerUser(formData);
        setMessage({ text: 'Registration successful! Please login.', type: 'success' });
        setIsRegister(false);
        setFormData({ full_name: '', email: '', password: '', phone_number: '' });
      } else {
        // ব্যাকএন্ডের UserLogin মডেল অনুযায়ী সঠিক 'email' এবং 'password' পাঠানো হচ্ছে
        const response = await loginUser({
          email: formData.email,
          password: formData.password
        });
        localStorage.setItem('token', response.data.access_token);
        if (onLoginSuccess) {
          onLoginSuccess();
        }
      }
    } catch (error) {
      const errorDetail = error.response?.data?.detail;
      let errorMessage = isRegister ? 'Registration failed' : 'Login failed';

      if (typeof errorDetail === 'string') {
        errorMessage = errorDetail;
      } else if (Array.isArray(errorDetail)) {
        errorMessage = errorDetail.map(err => err.msg).join(', ');
      }

      setMessage({ text: errorMessage, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-2xl shadow-sm border border-slate-200 mt-10">
      <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">
        {isRegister ? 'Create an Account' : 'Welcome Back'}
      </h2>

      {message.text && (
        <div className={`mb-4 p-3 rounded-lg text-sm font-medium border ${
          message.type === 'success' 
            ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
            : 'bg-red-50 text-red-600 border-red-200'
        }`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {isRegister && (
          <>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Full Name</label>
              <input 
                type="text" 
                name="full_name" 
                value={formData.full_name} 
                onChange={handleChange} 
                required 
                placeholder="Sayem Uddin Samir"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Phone Number</label>
              <input 
                type="text" 
                name="phone_number" 
                value={formData.phone_number} 
                onChange={handleChange} 
                required 
                placeholder="01817712442"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
              />
            </div>
          </>
        )}

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

        <button 
          type="submit"
          disabled={loading}
          className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition duration-200 cursor-pointer shadow-sm disabled:opacity-50 text-sm"
        >
          {loading ? (isRegister ? 'Registering...' : 'Logging in...') : (isRegister ? 'Register' : 'Login')}
        </button>
      </form>

      <div className="text-center mt-4">
        <button 
          type="button"
          onClick={() => {
            setIsRegister(!isRegister);
            setMessage({ text: '', type: '' });
          }}
          className="text-xs text-red-600 hover:underline font-semibold cursor-pointer"
        >
          {isRegister ? 'Already have an account? Login' : "Don't have an account? Register"}
        </button>
      </div>
    </div>
  );
}