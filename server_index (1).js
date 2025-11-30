// Simple proxy server to safely inject OPENWEATHER API key.
// Usage:
// 1. create a .env file with: OPENWEATHER_API_KEY=your_key_here
// 2. npm install
// 3. node server/index.js
//
// The server exposes:
// POST /api/weather/current  -> body { city, units }
// POST /api/weather/forecast -> body { city, units }
// It forwards requests to OpenWeatherMap using the API key from env.

import express from 'express';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();
const API_KEY = process.env.OPENWEATHER_API_KEY;
if (!API_KEY) {
  console.error('Please set OPENWEATHER_API_KEY in .env');
  process.exit(1);
}

const app = express();
app.use(express.json());

// Serve static frontend from project root
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, '..')));

app.post('/api/weather/current', async (req, res) => {
  try {
    const { city, units='metric' } = req.body;
    if (!city) return res.status(400).send('Missing city');
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=${units}&appid=${API_KEY}`;
    const r = await fetch(url);
    const json = await r.json();
    res.status(r.status).json(json);
  } catch (err) {
    res.status(500).send(String(err));
  }
});

app.post('/api/weather/forecast', async (req, res) => {
  try {
    const { city, units='metric' } = req.body;
    if (!city) return res.status(400).send('Missing city');
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&units=${units}&appid=${API_KEY}`;
    const r = await fetch(url);
    const json = await r.json();
    res.status(r.status).json(json);
  } catch (err) {
    res.status(500).send(String(err));
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});