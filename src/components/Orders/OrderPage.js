import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const OrderPage = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch products from backend when the component loads
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/products');
        setProducts(response.data);  // Set the products in state
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  const addToCart = (product) => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.push(product);
    localStorage.setItem('cart', JSON.stringify(cart)); // Save cart to local storage
    alert(`${product.name} added to cart`);
  };

  const viewCart = () => {
    navigate('/cart'); // Navigate to Cart page
  };

  return (
    <div>
      <h1>Order Page</h1>
      <div className="product-list">
        {products.length > 0 ? (
          products.map((product) => (
            <div key={product.id} className="product-item">
              <h2>{product.name}</h2>
              <p>{product.description}</p>
              <p>${product.price}</p>
              <button onClick={() => addToCart(product)}>Add to Cart</button>
            </div>
          ))
        ) : (
          <p>No products available</p>
        )}
      </div>
      <button onClick={viewCart}>View Cart</button>
    </div>
  );
};

export default OrderPage;
