const mongoose = require('mongoose');

const employerSchema = new mongoose.Schema({
  name: String,
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  employees: [{
    email: String,
    salary: Number,
  }]
});

module.exports = mongoose.model('Employer', employerSchema);
