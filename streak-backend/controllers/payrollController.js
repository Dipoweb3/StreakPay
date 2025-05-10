const parsePayrollFile = require('../utils/parsePayroll');
const User = require('../models/User');
const Employer = require('../models/Employer');
const fs = require('fs');

exports.uploadPayroll = async (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

  const payrollData = parsePayrollFile(req.file.path);

  for (let entry of payrollData) {
    const user = await User.findOne({ email: entry.email });
    if (user) {
      user.salary = entry.salary;
      await user.save();
    }
  }

  // Optional: Save to employer model
  await Employer.create({
    name: req.body.companyName || "Uploaded Employer",
    uploadedBy: req.user._id,
    employees: payrollData,
  });

  fs.unlinkSync(req.file.path); // Delete file after processing

  res.json({ message: 'Payroll uploaded and processed successfully' });
};

exports.getEmployees = async (req, res) => {
  const users = await User.find({ employer: req.user.employer });
  res.json(users);
};
