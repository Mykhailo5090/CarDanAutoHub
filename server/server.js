import express from 'express';
import cors from 'cors';
import pkg from 'pg';
import bcrypt from 'bcryptjs'; // Використовуємо bcryptjs для кращої сумісності з ES Modules

const { Pool } = pkg;
const app = express(); // 1. Спочатку створюємо app

// 2. Потім налаштовуємо middleware
app.use(cors());
app.use(express.json());

// Налаштування підключення до PostgreSQL (порт 5432)
const pool = new Pool({
  user: 'postgres',           
  host: 'localhost',
  database: 'cardan', 
  password: 'postgres',  
  port: 5432,
});

// Перевірка зв'язку з базою при старті
pool.connect((err, client, release) => {
  if (err) {
    return console.error('Помилка підключення до бази:', err.stack);
  }
  console.log('Успішно підключено до PostgreSQL на порті 5432');
  release();
});

// Ендпоінт для РЕЄСТРАЦІЇ
app.post('/register', async (req, res) => {
  const { email, password } = req.body;
  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = await pool.query(
      'INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING *',
      [email, hashedPassword]
    );
    res.json({ message: "Success", user: newUser.rows[0] });
  } catch (err) {
    console.error(err); // Тепер помилка 'err' використовується
    res.status(500).json({ error: "User already exists or DB error" });
  }
});

// Ендпоінт для ЛОГІНУ
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    // 1. Шукаємо користувача за email
    const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

    if (user.rows.length > 0) {
      // 2. Порівнюємо введений пароль з хешем у базі
      const validPassword = await bcrypt.compare(password, user.rows[0].password_hash);
      
      if (validPassword) {
        // Відправляємо дані користувача (крім пароля!) на фронтенд
        const { password_hash, ...userData } = user.rows[0];
        res.json({ message: "Login successful", user: userData });
      } else {
        res.status(401).json({ error: "Wrong password" });
      }
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

app.listen(5001, () => console.log("Server running on port 5001"));