import React, { useState } from 'react';
import { loginUser } from '../services/api';

export default function Login({ setToken }) {
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
           
            const formBody = new URLSearchParams();
            formBody.append('username', formData.username);
            formBody.append('password', formData.password);

            const response = await loginUser(formBody);
            const token = response.data.access_token;
            
            
            localStorage.setItem('token', token);
            if (setToken) setToken(token);

            setMessage('Login successful! Token saved.');
        } catch (error) {
            setMessage('Login failed: ' + (error.response?.data?.detail || error.message));
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
            <h2>ResQ Bangladesh - Login</h2>
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '10px' }}>
                    <label>Email (Username):</label>
                    <input type="email" name="username" value={formData.username} onChange={handleChange} required style={{ width: '100%', padding: '8px' }} />
                </div>
                <div style={{ marginBottom: '10px' }}>
                    <label>Password:</label>
                    <input type="password" name="password" value={formData.password} onChange={handleChange} required style={{ width: '100%', padding: '8px' }} />
                </div>
                <button type="submit" style={{ width: '100%', padding: '10px', background: '#28A745', color: '#fff', border: 'none', borderRadius: '4px' }}>Login</button>
            </form>
            {message && <p style={{ marginTop: '15px', color: message.includes('successful') ? 'green' : 'red' }}>{message}</p>}
        </div>
    );
}