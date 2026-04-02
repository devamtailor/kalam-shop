require('dotenv').config();
const mongoose = require('mongoose');
const path = require('path');
const express = require('express');
const app = require('./app');
const seed = require('./seed');

const PORT = process.env.PORT || 5000;

// Serve static frontend in local production setup
const clientBuildPath = path.join(__dirname, '..', 'client', 'dist');
app.use(express.static(clientBuildPath));
app.get('*', (req, res) => {
    res.sendFile(path.join(clientBuildPath, 'index.html'));
});

// Connect to MongoDB and start local server
async function startServer() {
    let mongoUrl = process.env.MONGO_URL;
    let dbName = process.env.DB_NAME;

    try {
        await mongoose.connect(mongoUrl, { dbName, serverSelectionTimeoutMS: 3000 });
        console.log('✅ Connected to MongoDB');
    } catch (err) {
        console.log('⚠️ Could not connect to MongoDB, using in-memory database...');
        const { MongoMemoryServer } = require('mongodb-memory-server');
        const mongod = await MongoMemoryServer.create();
        mongoUrl = mongod.getUri();
        await mongoose.connect(mongoUrl, { dbName });
        console.log('✅ Connected to in-memory MongoDB');
    }

    await seed();
    app.listen(PORT, () => {
        console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
}

startServer().catch(err => {
    console.error('❌ Failed to start server:', err);
    process.exit(1);
});
