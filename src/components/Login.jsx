import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './login.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8095/api/auth/login', {
        username,
        password,
      });

      if (response.status === 200) {
        localStorage.setItem('token', 'basic-authenticated');
        navigate('/orders');
      }
    } catch (err) {
      setError('Invalid username or password');
      setTimeout(() => setError(''), 3000);
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      {error && <div className="toast-error">{error}</div>}
      <form onSubmit={handleLogin} className="login-form">
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
