import express from 'express';
import cors from 'cors';
import path from 'path';
import 'dotenv/config';

import { __dirname } from './config/upload.js';
import insuranceRoutes from './routes/insurance.js';
import carRoutes from './routes/cars.js';
import authRoutes from './routes/auth.js';

const app = express();

app.use(cors());
app.use(express.json());

// Роздача статичних файлів (завантажених фото)

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Підключення модульних роутів
app.use('/api/insurance', insuranceRoutes);
app.use('/api/cars', carRoutes); // Обробляє /api/cars та /api/cars/favorites всередині
app.use('/api/auth', authRoutes); // Перенесено реєстрацію/вхід на /api/auth/login і /api/auth/register

// Старі ендпоінти без префіксу /api/auth та обраного (для зворотної сумісності з фронтендом, якщо лінь міняти фронт)
app.use('/', authRoutes); 
app.use('/api', carRoutes); 

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));