const express = require('express');
const router = express.Router();
const db = require('../../db'); // Import your database connection

// Get all products
router.get('/products', (req, res) => {
  const query = 'SELECT * FROM products';
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to fetch products' });
    }
    res.json(results); // Return the list of products
  });
});

module.exports = router;
