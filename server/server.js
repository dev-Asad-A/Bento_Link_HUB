const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { MongoMemoryServer } = require('mongodb-memory-server');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

// Map API routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/links', require('./routes/linkRoutes'));

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err.stack);
  res.status(500).json({ message: 'Internal Server Error' });
});

let mongoServer;
const connectDB = async () => {
  let mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    console.log('No MONGO_URI specified in .env. Initializing in-memory MongoDB fallback...');
    try {
      mongoServer = await MongoMemoryServer.create();
      mongoUri = mongoServer.getUri();
      console.log(`In-memory MongoDB instance active at: ${mongoUri}`);
    } catch (err) {
      console.error('Failed to start in-memory MongoDB:', err.message);
      process.exit(1);
    }
  }

  try {
    await mongoose.connect(mongoUri);
    console.log('Database Stream Engaged');
  } catch (err) {
    console.error('Database connection failed:', err.message);
    process.exit(1);
  }
};

const PORT = process.env.PORT || 5000;

// Start server after database connection is successful
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});

// Handle graceful shutdown for the in-memory database
const shutdown = async () => {
  console.log('Shutting down server...');
  if (mongoServer) {
    await mongoServer.stop();
    console.log('In-memory MongoDB stopped');
  }
  process.exit(0);
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
