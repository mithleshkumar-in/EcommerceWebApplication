import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './CartPage.css';  // Import the CSS file

const CartPage = () => {
  const location = useLocation();
  const cart = location.state?.cart || [];
  const navigate = useNavigate();

  const handleCheckout = () => {
    alert('Proceeding to checkout...');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="container">
      <h1>Your Cart</h1>
      {cart.length > 0 ? (
        <div className="cart-container">
          <div className="cart-list">
            <ul>
              {cart.map((item) => (
                <li key={item.id}>
                  <span className="product-name">{item.name}</span>
                  <span className="product-price">${item.price}</span>
                  <span className="product-quantity">x {item.quantity}</span>
                  <button
                    className="remove-button"
                    onClick={() => alert('Remove product')}
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="checkout-container">
            <span className="total-price">Total: ${cart.reduce((total, item) => total + item.price * item.quantity, 0)}</span>
            <button className="checkout-button" onClick={handleCheckout}>
              Proceed to Checkout
            </button>
          </div>
        </div>
      ) : (
        <p>Your cart is empty</p>
      )}

      <button onClick={handleLogout} style={{ marginTop: '20px' }}>
        Logout
      </button>
    </div>
  );
};

export default CartPage;
