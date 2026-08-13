import React, { useState } from 'react';

function Auth({ onLoginSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    const endpoint = isLogin ? 'http://localhost:5000/api/login' : 'http://localhost:5000/api/register';
    const payload = isLogin ? { email, password } : { fullName, email, phone, password };

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Something went wrong');
      }

      if (isLogin) {
        localStorage.setItem('token', data.access_token);
        setSuccessMsg('Login successful!');
        if (onLoginSuccess) onLoginSuccess(data.access_token);
      } else {
        setSuccessMsg('Registration successful! Please login.');
        setIsLogin(true);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex justify-center items-center p-4">
      <div className="bg-slate-900 border border-slate-800 p-8 rounded-xl w-full max-w-md shadow-lg">
        <h2 className="text-2xl font-bold text-red-500 mb-2 text-center">
          {isLogin ? 'ResQ Bangladesh - Login' : 'ResQ Bangladesh - Register'}
        </h2>
        <p className="text-sm text-gray-400 text-center mb-6">Emergency Response & Monitoring Portal</p>

        {error && <div className="bg-red-500/20 border border-red-500/40 text-red-400 p-3 rounded mb-4 text-sm">{error}</div>}
        {successMsg && <div className="bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 p-3 rounded mb-4 text-sm">{successMsg}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  className="w-full bg-slate-800 border border-slate-700 rounded p-2.5 text-sm text-white focus:outline-none focus:border-red-500"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Phone Number</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded p-2.5 text-sm text-white focus:outline-none focus:border-red-500"
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-xs text-gray-400 mb-1">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-slate-800 border border-slate-700 rounded p-2.5 text-sm text-white focus:outline-none focus:border-red-500"
            />
          </div>

          <div>
            <label className="block text-xs text-gray-400 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-slate-800 border border-slate-700 rounded p-2.5 text-sm text-white focus:outline-none focus:border-red-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-red-600 hover:bg-red-700 transition text-white font-semibold py-2.5 rounded text-sm mt-2"
          >
            {isLogin ? 'Login' : 'Register'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-400">
          {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-red-400 hover:underline font-medium ml-1"
          >
            {isLogin ? 'Register here' : 'Login here'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Auth;