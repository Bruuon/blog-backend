const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

const authRouter = require('./routes/auth');
const articleRouter = require('./routes/articles');
const categoryRouter = require('./routes/categories');
const adminRouter = require('./routes/admin');

// Routes
app.use('/api/auth', authRouter);
app.use('/api/articles', articleRouter);
app.use('/api/categories', categoryRouter);
app.use('/api/admin', adminRouter);

// Connect to MongoDB
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/blog';

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err.message);
  });

// Only listen when running locally (not on Vercel serverless)
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
