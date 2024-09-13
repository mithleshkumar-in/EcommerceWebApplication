const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use('/api', require('.//server/routes/productRoutes'));




// MySQL Connection
const db = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'root',
  database: process.env.DB_NAME || 'ecommerce'
});

db.connect(err => {
  if (err) throw err;
  console.log('MySQL Connected...');
});

// Secret for JWT
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

// Routes
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer token

  if (!token) {
    return res.status(401).json({ message: 'Access Denied, Token Missing' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or Expired Token' });
    }
    req.user = user; // Store user info in req object
    next();
  });
}
// Registration Route
app.post('/api/register', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const query = 'INSERT INTO users (email, password) VALUES (?, ?)';
    db.query(query, [email, hashedPassword], (err, result) => {
      if (err) {
        if (err.code === 'ER_DUP_ENTRY') {
          return res.status(400).json({ message: 'User already exists' });
        }
        return res.status(500).json({ message: 'Internal server error' });
      }
      res.status(201).json({ message: 'User registered successfully' });
    });
  } catch (err) {
    res.status(500).json({ message: 'Error registering user' });
  }
});

// Login Route
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  const query = 'SELECT * FROM users WHERE email = ?';
  db.query(query, [email], async (err, result) => {
    if (err) return res.status(500).json({ message: 'Internal server error' });

    if (result.length === 0) {
      return res.status(400).json({ message: 'User not found' });
    }

    const user = result[0];

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });

    res.json({ token, message: 'Login successful' });
  });
});

app.get('/api/cart', authenticateToken, async (req, res) => {
  const userId = req.user.id; // Assuming you have user information in the JWT token
  try {
    const [cartItems] = await pool.query('SELECT * FROM cart WHERE user_id = ?', [userId]);
    res.json(cartItems); // Send the cart items as JSON
  } catch (error) {
    console.error('Error fetching cart items:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Endpoint to proceed with checkout
app.post('/api/checkout', authenticateToken, async (req, res) => {
  const userId = req.user.id;

  try {
    // Get all items in the user's cart
    const [cartItems] = await pool.query('SELECT * FROM cart WHERE user_id = ?', [userId]);

    if (cartItems.length === 0) {
      return res.status(400).json({ message: 'No items in cart' });
    }

    // Calculate total amount
    const totalAmount = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

    // Insert order into orders table
    const [orderResult] = await pool.query('INSERT INTO orders (user_id, total_amount) VALUES (?, ?)', [userId, totalAmount]);
    const orderId = orderResult.insertId;

    // Insert each cart item into order_items table and update product stock
    for (const item of cartItems) {
      await pool.query('INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)', [
        orderId,
        item.product_id,
        item.quantity,
        item.price
      ]);

      // Update product stock
      await pool.query('UPDATE products SET stock = stock - ? WHERE id = ?', [item.quantity, item.product_id]);
    }

    // Clear cart after checkout
    await pool.query('DELETE FROM cart WHERE user_id = ?', [userId]);

    res.status(200).json({ message: 'Order placed successfully' });
  } catch (error) {
    console.error('Error during checkout:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
