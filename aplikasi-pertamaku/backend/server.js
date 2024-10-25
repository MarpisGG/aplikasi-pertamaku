import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import sqlite3 from 'sqlite3';
import cors from 'cors';

const app = express();
app.use(express.json());
app.use(cors({
  origin: '*',
  optionsSuccessStatus: 200,
}));

// Connect to SQLite database
const connection = new sqlite3.Database('./db/aplikasi.db');

// Get user by ID
app.get('/api/user/:id', (req, res) => {
  const query = 'SELECT * FROM users WHERE id = ?'; // Use parameterized query for security
  const userId = req.params.id;

  connection.get(query, [userId], (error, result) => { // Use `get` instead of `all` for a single result
    if (error) {
      return res.status(500).json({ error: 'Database error' });
    }

    if (!result) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Return the user as an object (not an array)
    res.json(result);
  });
});

// Change email of user
app.post('/api/user/:id/change-email', (req, res) => {
  const newEmail = req.body.email;
  const query = 'UPDATE users SET email = ? WHERE id = ?'; // Parameterized query
  const userId = req.params.id;

  connection.run(query, [newEmail, userId], function (err) {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).send('Email updated successfully');
  });
});

// Serve files
app.get('/api/file', (req, res) => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  const filePath = path.join(__dirname, 'files', req.query.name);
  res.sendFile(filePath);
});

// Start server
app.listen(4000, () => {
  console.log('Server running on port 4000');
});

