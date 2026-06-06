import { Router } from 'express';
import bcrypt from 'bcryptjs';
import multer from 'multer';
import path from 'path';
import { pool } from '../config/db.js';

const router = Router();

// Конфігурація сховища Multer для аватарок
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Файли завантажуватимуться в папку uploads на сервері
  },
  filename: (req, file, cb) => {
    // Формуємо унікальне ім'я файлу, щоб уникнути колізій
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'avatar-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// РЕЄСТРАЦІЯ
router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email, name, phone, avatar', 
      [email, hashedPassword]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Error registering user" });
  }
});

// ЛОГІН
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

// КАНАЛ ОНОВЛЕННЯ ПРОФІЛЮ (Ось наш новий ендпоінт)
// Приймає один файл з поля 'avatar' та текстові поля 'name' і 'phone'
router.put('/users/:id', upload.single('avatar'), async (req, res) => {
  const userId = req.params.id;
  const { name, phone } = req.body;
  let avatarPath = null;

  // Якщо файл було успішно завантажено, створюємо відносний шлях до нього
  if (req.file) {
    avatarPath = `/uploads/${req.file.filename}`;
  }

  try {
    // 1. Отримуємо поточні дані з бази, щоб знати, чи є у користувача стара аватарка
    const userCheck = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
    if (userCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Користувача не знайдено' });
    }

    const currentUser = userCheck.rows[0];
    
    // Якщо нова аватарка не прийшла (юзер міняв тільки ім'я чи телефон), лишаємо стару з бази
    const finalAvatar = avatarPath !== null ? avatarPath : currentUser.avatar;

    // 2. Оновлюємо записи в базі PostgreSQL
    const updateResult = await pool.query(
      `UPDATE users 
       SET name = $1, phone = $2, avatar = $3 
       WHERE id = $4 
       RETURNING id, email, name, phone, avatar`,
      [name, phone, finalAvatar, userId]
    );

    // 3. Повертаємо оновлений об'єкт юзера назад на фронтенд
    res.json(updateResult.rows[0]);

  } catch (err) {
    console.error('Помилка оновлення користувача:', err);
    res.status(500).json({ error: 'Помилка сервера при оновленні профілю' });
  }
});

export default router;