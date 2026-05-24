import express from 'express';
import cors from 'cors';
import pkg from 'pg';
import bcrypt from 'bcryptjs';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';
import fs from 'fs';
import decode from 'heic-decode'; // Додано для підтримки iPhone фото

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const { Pool } = pkg;
const app = express();

// 1. MIDDLEWARE
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 2. DATABASE
const pool = new Pool({
  user: 'postgres',           
  host: 'localhost',
  database: 'cardan', 
  password: 'postgres',  
  port: 5432,
});

pool.connect((err) => {
  if (err) console.error('Помилка БД:', err.stack);
  else console.log('Успішно підключено до PostgreSQL');
});

// 3. MULTER
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, 'uploads/');
    if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, 'temp-' + Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });

// --- ЕНДПОЇНТИ ---

app.post('/register', async (req, res) => {
  const { email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await pool.query('INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING *', [email, hashedPassword]);
    res.json({ message: "Success", user: newUser.rows[0] });
  } catch (err) { res.status(500).json({ error: "User already exists" }); }
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (user.rows.length > 0 && await bcrypt.compare(password, user.rows[0].password_hash)) {
      const { password_hash, ...userData } = user.rows[0];
      res.json({ message: "Login successful", user: userData });
    } else { res.status(401).json({ error: "Wrong credentials" }); }
  } catch (err) { res.status(500).json({ error: "Server error" }); }
});

// ДОДАТИ АВТО + ПІДТРИМКА HEIC
app.post('/api/cars', upload.array('images', 5), async (req, res) => {
  try {
    const { user_id, brand, model, year, price, mileage, fuel_type, transmission, engine_volume, region, description } = req.body;

    const processedImages = await Promise.all(req.files.map(async (file) => {
      const fileName = `ready-${Date.now()}-${Math.round(Math.random() * 1E9)}.jpg`;
      const filePath = path.join(__dirname, 'uploads', fileName);

      let sharpInstance;
      const fileBuffer = fs.readFileSync(file.path);

      // Якщо це HEIC - декодуємо вручну
      if (file.originalname.toLowerCase().endsWith('.heic')) {
        try {
          const { width, height, data } = await decode({ buffer: fileBuffer });
          sharpInstance = sharp(data, { raw: { width, height, channels: 4 } });
        } catch (e) {
          console.error("Помилка HEIC, спроба стандартної обробки:", e);
          sharpInstance = sharp(file.path);
        }
      } else {
        sharpInstance = sharp(file.path);
      }

      await sharpInstance
        .rotate()
        .resize(1000, 750, { fit: 'inside', withoutEnlargement: true })
        .jpeg({ quality: 80 })
        .toFile(filePath);

      if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
      return `/uploads/${fileName}`;
    }));

    const newCar = await pool.query(
      `INSERT INTO cars (user_id, brand, model, year, price, mileage, fuel_type, transmission, engine_volume, region, description, images) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *`,
      [user_id, brand, model, year, price, mileage, fuel_type, transmission, engine_volume, region, description, JSON.stringify(processedImages)]
    );
    res.json(newCar.rows[0]);
  } catch (err) {
    console.error("Помилка завантаження:", err);
    res.status(500).json({ error: "Internal server error during upload" });
  }
});

app.get('/api/cars', async (req, res) => {
  try {
    const allCars = await pool.query('SELECT * FROM cars ORDER BY created_at DESC');
    res.json(allCars.rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/my-cars/:userId', async (req, res) => {
  try {
    const myCars = await pool.query('SELECT * FROM cars WHERE user_id = $1 ORDER BY created_at DESC', [req.params.userId]);
    res.json(myCars.rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.delete('/api/cars/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM cars WHERE id = $1', [req.params.id]);
    res.json({ message: "Deleted" });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// FAVORITES
app.post('/api/favorites', async (req, res) => {
  const { user_id, car_id } = req.body;
  try {
    await pool.query('INSERT INTO favorites (user_id, car_id) VALUES ($1, $2) ON CONFLICT DO NOTHING', [user_id, car_id]);
    res.json({ message: "Added" });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.delete('/api/favorites/:userId/:carId', async (req, res) => {
  try {
    await pool.query('DELETE FROM favorites WHERE user_id = $1 AND car_id = $2', [req.params.userId, req.params.carId]);
    res.json({ message: "Removed" });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/favorites/:userId', async (req, res) => {
  try {
    const favorites = await pool.query(
      `SELECT cars.* FROM cars 
       JOIN favorites ON cars.id = favorites.car_id 
       WHERE favorites.user_id = $1 ORDER BY favorites.id DESC`, [req.params.userId]
    );
    res.json(favorites.rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

const PORT = 5001;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));