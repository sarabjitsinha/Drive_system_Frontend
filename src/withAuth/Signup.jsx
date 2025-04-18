import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const user=localStorage.getItem("user");

  const handleSubmit = async (e) => {
    e.preventDefault();
    await API.post('/auth/signup', { email, password });
    navigate('/login');
  };

  return ((!user)?
    (<div className="p-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Signup</h2>
      <form onSubmit={handleSubmit}>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="w-full mb-2 p-2 border rounded" />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="w-full mb-2 p-2 border rounded" />
        <button type="submit" className="w-full bg-green-500 text-white p-2 rounded">Signup</button>
      </form>
    </div>):<div>You are already registered</div>
  );
}
