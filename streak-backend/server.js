const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

// Load environment variables
dotenv.config();

// Import route files
const authRoutes = require('./routes/authRoutes');
const loanRoutes = require('./routes/loanRoutes');
const payrollRoutes = require('./routes/payrollRoutes');
const adminRoutes = require('./routes/adminRoutes');
const userRoutes = require('./routes/userRoutes');
const employerRoutes = require('./routes/employerRoutes'); // ✅ New employer route

const app = express();

// Middleware setup
app.use(express.json());
app.use(cors());

// Route registration
app.use('/api/auth', authRoutes);
app.use('/api/loan', loanRoutes);
app.use('/api/employer', payrollRoutes);
app.use('/api/user', userRoutes);
app.use('/admin', adminRoutes);
app.use('/api/employers', employerRoutes); // ✅ New route added properly

// MongoDB connection and server start
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('MongoDB connected');
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
})
.catch(err => console.error('MongoDB connection error:', err));
