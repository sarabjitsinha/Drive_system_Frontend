import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/Authcontext';
import API from '../services/api';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();
  // const user=localStorage.getItem("user");
const {user}=useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { data } = await API.post('/auth/login', { email, password });
    if(data.error=="Invalid credentials")
      {
        alert("invalid username/password") ;
        return
      }
    login(data);
    navigate('/');
  };

  return (!(user) ?
    (<div className="p-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Login</h2>
      <form onSubmit={handleSubmit}>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="w-full mb-2 p-2 border rounded" />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="w-full mb-2 p-2 border rounded" />
        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">Login</button>
      </form>
    </div>):<div>You are logged in</div>
  );
}
