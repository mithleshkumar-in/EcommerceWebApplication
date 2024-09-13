const mysql = require('mysql2');

// Create a connection to the MySQL database
const db = mysql.createConnection({
  host: 'localhost',    // Database host
  user: 'root',         // Your MySQL username
  password: 'root', // Your MySQL password
  database: 'ecommerce' // The name of your database
});

// Connect to the database
db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    process.exit(1); // Exit the process with failure
  } else {
    console.log('Connected to the MySQL database.');
  }
});

module.exports = db;
