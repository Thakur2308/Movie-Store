import React, { useState } from 'react';
import './style.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ProducerLogin = ({ setUsername }) => {
  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const formData = new FormData();
      formData.append('username', user);
      formData.append('password', password);

      const response = await axios.post(
        "http://localhost:8000/token",
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      localStorage.setItem('token', response.data.access_token);
      localStorage.setItem('username', user);
      setUsername(user);
      navigate("/dashboard");
    } catch (err) {
      console.error("Login error:", err.response?.data);
      setError(err.response?.data?.detail || 'Invalid Credentials');
    }
  };

  return (
    <div className="form-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Login</h2>
        <input 
          type="text" 
          placeholder="Username" 
          value={user} 
          onChange={(e) => setUser(e.target.value)} 
          required 
        />
        <br />
        <input 
          type="password" 
          placeholder="Password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          required
        />
        <br />
        <button type="submit">Login</button>
        {error && <p className="error">{error}</p>}
      </form>
    </div>
  );
};

export default ProducerLogin;