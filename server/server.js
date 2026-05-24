import express from 'express';
import cors from 'cors';
import pkg from 'pg';
import bcrypt from 'bcryptjs';
import multer from 'multer'; // Додано
import path from 'path';   // Додано

const { Pool } = pkg;
const app = express();

app.use(cors());
app.use(express.json());

// Робимо папку uploads публічною, щоб фронтенд міг бачити картинки за посиланням
app.use('/uploads', express.static('uploads'));

const pool = new Pool({
  user: 'postgres',           
  host: 'localhost',
  database: 'cardan', 
  password: 'postgres',  
  port: 5432,
});

// Налаштування Multer для зберігання фото
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // папка для збереження
  },
  filename: (req, file, cb) => {
    // створюємо унікальне ім'я: дата + оригінальне ім'я
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });

pool.connect((err, client, release) => {
  if (err) return console.error('Помилка підключення до бази:', err.stack);
  console.log('Успішно підключено до PostgreSQL на порті 5432');
  release();
});

// --- ЕНДПОЇНТИ ---

// 1. Реєстрація та Логін залишаються без змін...
app.post('/register', async (req, res) => { /* твій існуючий код */ });
app.post('/login', async (req, res) => { /* твій існуючий код */ });

// 2. ДОДАВАННЯ АВТОМОБІЛЯ (Оголошення)
// 'images' - це назва поля, яке прийде з фронтенду (до 5 файлів)
app.post('/api/cars', upload.array('images', 5), async (req, res) => {
  try {
    const { 
      user_id, brand, model, year, price, mileage, 
      fuel_type, transmission, engine_volume, region, description 
    } = req.body;

    // Отримуємо масив шляхів до завантажених файлів
    const imageUrls = req.files.map(file => `/uploads/${file.filename}`);

    const newCar = await pool.query(
      `INSERT INTO cars 
      (user_id, brand, model, year, price, mileage, fuel_type, transmission, engine_volume, region, description, images) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *`,
      [
        user_id, brand, model, year, price, mileage, 
        fuel_type, transmission, engine_volume, region, description, 
        JSON.stringify(imageUrls) // зберігаємо масив як JSON string
      ]
    );

    res.json({ message: "Car added successfully", car: newCar.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error while adding car" });
  }
});

app.listen(5001, () => console.log("Server running on port 5001"));