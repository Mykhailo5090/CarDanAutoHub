import express from 'express';
import cors from 'cors';
import pkg from 'pg';
import bcrypt from 'bcryptjs';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';
import fs from 'fs';
import decode from 'heic-decode';
import 'dotenv/config';

import { getInsuranceOffers, createPolisContract } from './insurance.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const { Pool } = pkg;
const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'cardan',
  password: process.env.DB_PASSWORD || 'postgres',
  port: 5432,
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, 'uploads/');
    if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => cb(null, `temp-${Date.now()}-${file.originalname}`)
});
const upload = multer({ storage });

// --- СТРАХУВАННЯ ---
app.post('/api/insurance/get-price', async (req, res) => {
  try {
    const data = await getInsuranceOffers(req.body.plate);
    res.json({ success: true, ...data });
  } catch (err) {
    console.error("Polis Error:", err.message);
    res.status(500).json({ success: false, error: "Помилка Polis API" });
  }
});

app.post('/api/insurance/create-contract', async (req, res) => {
  try {
    const result = await createPolisContract(req.body);
    res.json(result);
  } catch (err) {
    res.status(400).json({ result: "error", details: err.response?.data });
  }
});

// --- МАРКЕТПЛЕЙС (ДОДАВАННЯ АВТО) ---
app.post('/api/cars', upload.array('images', 10), async (req, res) => {
  try {
    const { user_id, brand, model, year, price, mileage, fuel_type, transmission, engine_volume, region, description, license_plate } = req.body;
    
    const processedImages = await Promise.all(req.files.map(async (file) => {
      const fileName = `ready-${Date.now()}-${Math.round(Math.random() * 1E9)}.jpg`;
      const filePath = path.join(__dirname, 'uploads', fileName);
      
      if (file.originalname.toLowerCase().endsWith('.heic')) {
        const inputBuffer = fs.readFileSync(file.path);
        const { data, width, height } = await decode({ buffer: inputBuffer });
        await sharp(data, { raw: { width, height, channels: 4 } })
          .rotate()
          .resize(1000, 750, { fit: 'inside' })
          .jpeg({ quality: 80 })
          .toFile(filePath);
      } else {
        await sharp(file.path)
          .rotate()
          .resize(1000, 750, { fit: 'inside' })
          .jpeg({ quality: 80 })
          .toFile(filePath);
      }
      
      if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
      return `/uploads/${fileName}`;
    }));

    const result = await pool.query(
      `INSERT INTO cars (user_id, brand, model, year, price, mileage, fuel_type, transmission, engine_volume, region, description, images, license_plate) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *`,
      [user_id, brand, model, year, price, mileage, fuel_type, transmission, engine_volume, region, description, JSON.stringify(processedImages), license_plate]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Insert Car Error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// --- ОТРИМАННЯ АВТО (ТУТ БУЛА ПОМИЛКА - ВИПРАВЛЕНО) ---
app.get('/api/cars', async (req, res) => {
  try {
    const allCars = await pool.query('SELECT * FROM cars ORDER BY created_at DESC');
    res.json(allCars.rows);
  } catch (err) {
    res.status(500).json({ error: "Error fetching cars" });
  }
});

app.get('/api/my-cars/:userId', async (req, res) => {
  try {
    const myCars = await pool.query('SELECT * FROM cars WHERE user_id = $1 ORDER BY created_at DESC', [req.params.userId]);
    res.json(myCars.rows);
  } catch (err) {
    res.status(500).json({ error: "Error fetching my cars" });
  }
});

// --- ВИБРАНЕ ТА АВТОРИЗАЦІЯ ---
app.post('/api/favorites', async (req, res) => {
  const { user_id, car_id } = req.body;
  await pool.query('INSERT INTO favorites (user_id, car_id) VALUES ($1, $2) ON CONFLICT DO NOTHING', [user_id, car_id]);
  res.json({ message: "Added" });
});

app.get('/api/favorites/:userId', async (req, res) => {
  const favorites = await pool.query(`SELECT cars.* FROM cars JOIN favorites ON cars.id = favorites.car_id WHERE favorites.user_id = $1`, [req.params.userId]);
  res.json(favorites.rows);
});

app.post('/register', async (req, res) => {
  const { email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const result = await pool.query('INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email', [email, hashedPassword]);
  res.json(result.rows[0]);
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  if (result.rows[0] && await bcrypt.compare(password, result.rows[0].password_hash)) {
    const { password_hash, ...userData } = result.rows[0];
    res.json(userData);
  } else {
    res.status(401).json({ error: "Wrong credentials" });
  }
});
app.delete('/api/cars/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM cars WHERE id = $1', [id]);
    res.json({ message: "Авто видалено успішно" });
  } catch (err) {
    res.status(500).json({ error: "Не вдалося видалити авто" });
  }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));