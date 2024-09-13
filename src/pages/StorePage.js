import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './StorePage.css';

const StorePage = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Hook for navigation

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/products');
        setProducts(response.data); // Set products data
      } catch (error) {
        setError('Failed to fetch products. Please try again.');
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  // Add product to cart
  const addToCart = (product) => {
    setCart((prevCart) => {
      const productExists = prevCart.find((item) => item.id === product.id);

      if (productExists) {
        // If the product already exists in the cart, increase its quantity
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        // Add new product to the cart
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });
  };

  // View cart handler
  const viewCart = () => {
    navigate('/cart', { state: { cart } }); // Navigate to cart page and pass the cart as state
  };

  return (
    <div>
      <h1>Store</h1>
      {error && <p>{error}</p>}

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

      {/* View Cart Button */}
      {cart.length > 0 && (
        <button onClick={viewCart} style={{ marginTop: '20px' }}>
          View Cart ({cart.length} items)
        </button>
      )}
    </div>
  );
};

export default StorePage;
