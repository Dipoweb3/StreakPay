const Employer = require('../models/employer');

// POST /api/employers
exports.createEmployer = async (req, res) => {
  try {
    const { name, employees } = req.body;

    const employer = new Employer({
      name,
      uploadedBy: req.user._id,
      employees
    });

    await employer.save();

    res.status(201).json({ success: true, data: employer });
  } catch (error) {
    console.error('Error creating employer:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// GET /api/employers - only user's employers
exports.getMyEmployers = async (req, res) => {
  try {
    const employers = await Employer.find({ uploadedBy: req.user._id });
    res.status(200).json({ success: true, data: employers });
  } catch (error) {
    console.error('Error fetching employers:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// GET /api/employers/all - admin only
exports.getAllEmployers = async (req, res) => {
  try {
    const employers = await Employer.find().populate('uploadedBy', 'name email'); // Optional: enrich response
    res.status(200).json({ success: true, data: employers });
  } catch (error) {
    console.error('Error fetching all employers:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
