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

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
