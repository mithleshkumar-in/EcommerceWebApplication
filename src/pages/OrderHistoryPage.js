import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const OrderHistoryPage = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrderHistory = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/orders', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setOrders(data);
        } else {
          setError('Failed to fetch order history');
        }
      } catch (error) {
        console.error('Error fetching order history:', error);
        setError('An error occurred while fetching order history');
      }
    };

    fetchOrderHistory();
  }, []);

  return (
    <div className="order-history-page">
      <h1>Order History</h1>

      {error && <p className="error">{error}</p>}

      {orders.length > 0 ? (
        orders.map((order) => (
          <div key={order.id} className="order-card">
            <h2>Order ID: {order.id}</h2>
            <p>Total Amount: ${order.total_amount}</p>
            <p>Order Date: {new Date(order.created_at).toLocaleDateString()}</p>
            <ul>
              {order.items.map((item) => (
                <li key={item.id}>
                  Product ID: {item.product_id}, Quantity: {item.quantity}, Price: ${item.price}
                </li>
              ))}
            </ul>
          </div>
        ))
      ) : (
        <p>No orders found</p>
      )}
    </div>
  );
};

export default OrderHistoryPage;
