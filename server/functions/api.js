const serverless = require('serverless-http');
const mongoose = require('mongoose');
const app = require('../app');

let conn = null;

module.exports.handler = async (event, context) => {
    context.callbackWaitsForEmptyEventLoop = false;

    // Ensure we connect using the online environment variables provided in Netlify
    if (conn == null) {
        console.log('Connecting to new MongoDB instance for Netlify Function...');
        conn = mongoose.connect(process.env.MONGO_URL, {
            dbName: process.env.DB_NAME || 'test',
            serverSelectionTimeoutMS: 5000
        }).then(() => mongoose);
        await conn;
        console.log('✅ Connected to MongoDB Atlas online');
    }

    // Wrap the Express app for Serverless
    const serverlessApp = serverless(app);
    return serverlessApp(event, context);
};
