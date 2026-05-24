import express from 'express';
import cors from 'cors';
import pkg from 'pg';
import bcrypt from 'bcryptjs';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

// --- НАЛАШТУВАННЯ ШЛЯХІВ (ВАЖЛИВО ДЛЯ ES-МОДУЛІВ) ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const { Pool } = pkg;
const app = express();

// 1. MIDDLEWARE
app.use(cors());
app.use(express.json());

// Робимо папку uploads публічною за абсолютним шляхом
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 2. ПІДКЛЮЧЕННЯ ДО DATABASE
const pool = new Pool({
  user: 'postgres',           
  host: 'localhost',
  database: 'cardan', 
  password: 'postgres',  
  port: 5432,
});

pool.connect((err, client, release) => {
  if (err) return console.error('Помилка підключення до бази:', err.stack);
  console.log('Успішно підключено до PostgreSQL');
  console.log('Папка для фото:', path.join(__dirname, 'uploads'));
  release();
});

// 3. НАЛАШТУВАННЯ MULTER (ЗАВАНТАЖЕННЯ ФОТО)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, 'uploads/')); // Зберігаємо за абсолютним шляхом
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });

// --- ЕНДПОЇНТИ ---

// РЕЄСТРАЦІЯ
app.post('/register', async (req, res) => {
  const { email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await pool.query(
      'INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING *',
      [email, hashedPassword]
    );
    res.json({ message: "Success", user: newUser.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "User already exists or DB error" });
  }
});

// ЛОГІН
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (user.rows.length > 0) {
      const validPassword = await bcrypt.compare(password, user.rows[0].password_hash);
      if (validPassword) {
        const { password_hash, ...userData } = user.rows[0];
        res.json({ message: "Login successful", user: userData });
      } else {
        res.status(401).json({ error: "Wrong password" });
      }
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// ДОДАТИ АВТОМОБІЛЬ
app.post('/api/cars', upload.array('images', 5), async (req, res) => {
  try {
    const { 
      user_id, brand, model, year, price, mileage, 
      fuel_type, transmission, engine_volume, region, description 
    } = req.body;

    // Зберігаємо шляхи у форматі: /uploads/filename.jpg
    const imageUrls = req.files.map(file => `/uploads/${file.filename}`);

    const newCar = await pool.query(
      `INSERT INTO cars 
      (user_id, brand, model, year, price, mileage, fuel_type, transmission, engine_volume, region, description, images) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *`,
      [
        user_id, brand, model, year, price, mileage, 
        fuel_type, transmission, engine_volume, region, description, 
        JSON.stringify(imageUrls)
      ]
    );
    res.json(newCar.rows[0]);
  } catch (err) {
    console.error("Помилка додавання авто:", err);
    res.status(500).json({ error: err.message });
  }
});

// ОТРИМАТИ ВСІ АВТО (Для сторінки Buy)
app.get('/api/cars', async (req, res) => {
  try {
    const allCars = await pool.query('SELECT * FROM cars ORDER BY created_at DESC');
    res.json(allCars.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ОТРИМАТИ АВТО КОНКРЕТНОГО ЮЗЕРА (Для Profile)
app.get('/api/my-cars/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const myCars = await pool.query(
      'SELECT * FROM cars WHERE user_id = $1 ORDER BY created_at DESC', 
      [userId]
    );
    res.json(myCars.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ВИДАЛИТИ АВТОМОБІЛЬ
app.delete('/api/cars/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM cars WHERE id = $1', [id]);
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// СТАРТ СЕРВЕРА
const PORT = 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});