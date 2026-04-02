const express = require('express');
const cors = require('cors');
const path = require('path');

const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');

const app = express();

// Middleware
app.use(cors({
    origin: process.env.CORS_ORIGINS === '*' ? '*' : (process.env.CORS_ORIGINS ? process.env.CORS_ORIGINS.split(',') : '*'),
    credentials: true
}));
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// We disable serving static frontend here because Netlify will serve the frontend.
// If needed for local testing, we can keep it, but it's cleaner to handle in index.js for local dev.

module.exports = app;
