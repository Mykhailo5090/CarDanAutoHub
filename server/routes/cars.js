import { Router } from 'express';
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import decode from 'heic-decode';
import { pool } from '../config/db.js';
import { upload, __dirname } from '../config/upload.js';

const router = Router();

// Додавання авто
router.post('/', upload.array('images', 10), async (req, res) => {
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

// Отримання всіх авто
router.get('/', async (req, res) => {
  try {
    const allCars = await pool.query('SELECT * FROM cars ORDER BY created_at DESC');
    res.json(allCars.rows);
  } catch (err) {
    res.status(500).json({ error: "Error fetching cars" });
  }
});

// Отримання авто конкретного користувача
router.get('/my-cars/:userId', async (req, res) => {
  try {
    const myCars = await pool.query('SELECT * FROM cars WHERE user_id = $1 ORDER BY created_at DESC', [req.params.userId]);
    res.json(myCars.rows);
  } catch (err) {
    res.status(500).json({ error: "Error fetching my cars" });
  }
});

// Видалення авто
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM cars WHERE id = $1', [id]);
    res.json({ message: "Авто видалено успішно" });
  } catch (err) {
    res.status(500).json({ error: "Не вдалося видалити авто" });
  }
});

// --- ОБРАНЕ (FAVORITES) ---
router.post('/favorites', async (req, res) => {
  const { user_id, car_id } = req.body;
  await pool.query('INSERT INTO favorites (user_id, car_id) VALUES ($1, $2) ON CONFLICT DO NOTHING', [user_id, car_id]);
  res.json({ message: "Added" });
});

router.get('/favorites/:userId', async (req, res) => {
  const favorites = await pool.query(`SELECT cars.* FROM cars JOIN favorites ON cars.id = favorites.car_id WHERE favorites.user_id = $1`, [req.params.userId]);
  res.json(favorites.rows);
});

router.delete('/favorites/:userId/:carId', async (req, res) => {
  try {
    const { userId, carId } = req.params;
    await pool.query('DELETE FROM favorites WHERE user_id = $1 AND car_id = $2', [userId, carId]);
    res.json({ success: true, message: "Видалено з обраного" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Помилка сервера" });
  }
});

export default router;