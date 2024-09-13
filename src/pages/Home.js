import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div>
      <h1>Welcome to the E-commerce Application</h1>
      <div>
        <Link to="/login">
          <button>Login</button>
        </Link>
        <Link to="/register">
          <button>Register</button>
        </Link>
      </div>
    </div>
  );
};

export default HomePage;
