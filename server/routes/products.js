const express = require('express');
const Product = require('../models/Product');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// GET all active products (public)
router.get('/', async (req, res) => {
    try {
        const products = await Product.find({ is_active: true }).sort({ created_at: -1 });
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// GET all products including inactive (admin)
router.get('/all', authMiddleware, async (req, res) => {
    try {
        const products = await Product.find().sort({ created_at: -1 });
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// GET single product (public)
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.json(product);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// POST create product (admin)
router.post('/', authMiddleware, async (req, res) => {
    try {
        const { title, description, price, image_url, category, age_range, pages_count, is_active } = req.body;
        const product = new Product({
            title,
            description,
            price,
            image_url,
            category: category || 'colouring-book',
            age_range,
            pages_count,
            is_active: is_active !== undefined ? is_active : true
        });
        await product.save();
        res.status(201).json(product);
    } catch (err) {
        console.error('Create product error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// PUT update product (admin)
router.put('/:id', authMiddleware, async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true, runValidators: true }
        );
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.json(product);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// DELETE product (admin)
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.json({ message: 'Product deleted' });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
