const express = require('express');
const Order = require('../models/Order');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// POST create order (public - from checkout)
router.post('/', async (req, res) => {
    try {
        const { customer_name, phone, address, items } = req.body;

        if (!customer_name || !phone || !address || !items || items.length === 0) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const shipping_cost = total >= 499 ? 0 : 49;

        const order = new Order({
            customer_name,
            phone,
            address,
            items,
            total: total + shipping_cost,
            shipping_cost,
            status: 'Pending'
        });

        await order.save();
        res.status(201).json(order);
    } catch (err) {
        console.error('Create order error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// GET all orders (admin)
router.get('/', authMiddleware, async (req, res) => {
    try {
        const orders = await Order.find().sort({ created_at: -1 });
        res.json(orders);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// PUT update order status (admin)
router.put('/:id/status', authMiddleware, async (req, res) => {
    try {
        const { status } = req.body;
        const validStatuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

        if (!validStatuses.includes(status)) {
            return res.status(400).json({ error: 'Invalid status' });
        }

        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );

        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }
        res.json(order);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
