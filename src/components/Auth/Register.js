import React, { useState } from 'react';
import { register } from '../../api/auth';

const Register = () => {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(formData);
      alert('Registration successful!');
    } catch (err) {
      setError('Registration failed');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" placeholder="Username" onChange={(e) => setFormData({ ...formData, username: e.target.value })} />
      <input type="email" placeholder="Email" onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
      <input type="password" placeholder="Password" onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
      {error && <p>{error}</p>}
      <button type="submit">Register</button>
    </form>
  );
};

export default Register;
