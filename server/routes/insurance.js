import { Router } from 'express';
import { getInsuranceOffers, createPolisContract } from '../insurance.js';

const router = Router();

router.post('/get-price', async (req, res) => {
  try {
    const data = await getInsuranceOffers(req.body.plate);
    res.json({ success: true, ...data });
  } catch (err) {
    console.error("Polis Error:", err.message);
    res.status(500).json({ success: false, error: "Помилка Polis API" });
  }
});

router.post('/create-contract', async (req, res) => {
  try {
    const result = await createPolisContract(req.body);
    res.json(result);
  } catch (err) {
    res.status(400).json({ result: "error", details: err.response?.data });
  }
});

export default router;