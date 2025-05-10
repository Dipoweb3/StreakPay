const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

// Import route files
const authRoutes = require('./routes/authRoutes');
const loanRoutes = require('./routes/loanRoutes');
const payrollRoutes = require('./routes/payrollRoutes');
const adminRoutes = require('./routes/adminRoutes');
const userRoutes = require('./routes/userRoutes');  // Import user routes

const app = express();

// Middleware setup
app.use(express.json());
app.use(cors());

// Route registration BEFORE server starts
app.use('/api/auth', authRoutes);      // User authentication routes
app.use('/api/loan', loanRoutes);      // Loan management routes
app.use('/api/employer', payrollRoutes);  // Payroll routes
app.use('/api/user', userRoutes);      // User-specific routes

// Admin routes
app.use('/admin', adminRoutes);        // Admin-specific routes

// MongoDB connection and server start
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => console.error(err));
