import express from "express";
import cors from "cors";
import path from "path";
import "dotenv/config";

import { __dirname } from "./config/upload.js";
import insuranceRoutes from "./routes/insurance.js";
import carRoutes from "./routes/cars.js";
import authRoutes from "./routes/auth.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/insurance", insuranceRoutes);
app.use("/api/cars", carRoutes);
app.use("/api/auth", authRoutes);

app.use("/", authRoutes);
app.use("/api", carRoutes);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () =>
  console.log(` Server running on http://localhost:${PORT}`),
);
