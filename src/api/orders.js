import axios from 'axios';

const API_URL = 'https://api.example.com/orders';

export const createOrder = async (orderDetails, token) => {
  const response = await axios.post(API_URL, orderDetails, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};
