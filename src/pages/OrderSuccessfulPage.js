import React from 'react';
import { useNavigate } from 'react-router-dom';

const OrderSuccessfulPage = () => {
  const navigate = useNavigate();

  return (
    <div className="order-successful-page">
      <h1>Order Successful!</h1>
      <p>Your order has been placed successfully.</p>
      <button onClick={() => navigate('/orders')}>View Order History</button>
    </div>
  );
};

export default OrderSuccessfulPage;
