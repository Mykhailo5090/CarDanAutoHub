import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { pool } from '../config/db.js';

const router = Router();

router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query('INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email', [email, hashedPassword]);
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Error registering user" });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows[0] && await bcrypt.compare(password, result.rows[0].password_hash)) {
      const { password_hash, ...userData } = result.rows[0];
      res.json(userData);
    } else {
      res.status(401).json({ error: "Wrong credentials" });
    }
  } catch (err) {
    res.status(500).json({ error: "Server error during login" });
  }
});

export default router;