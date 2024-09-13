import React, { useState, useContext } from 'react';
import { login } from '../../api/auth';
import { AuthContext } from '../../context/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const { login: loginUser } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { token } = await login(formData);
      loginUser(token);
      alert('Login successful!');
    } catch (err) {
      setError('Login failed');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="email" placeholder="Email" onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
      <input type="password" placeholder="Password" onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
      {error && <p>{error}</p>}
      <button type="submit">Login</button>
    </form>
  );
};

export default Login;
