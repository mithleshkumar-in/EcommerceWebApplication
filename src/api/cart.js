import axios from 'axios';

const API_URL = 'https://api.example.com/cart';

export const getCartItems = async (token) => {
  const response = await axios.get(API_URL, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};
