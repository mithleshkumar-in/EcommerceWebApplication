import React from 'react';
import { Link } from 'react-router-dom';

const OrderSuccessPage = () => {
  return (
    <div className="order-success-container">
      <h2>Order Successful!</h2>
      <p>Thank you for your purchase. Your order has been placed successfully.</p>
      <Link to="/store">Go back to Store</Link>
    </div>
  );
};

export default OrderSuccessPage;
