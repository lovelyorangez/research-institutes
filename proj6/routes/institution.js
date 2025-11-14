const express = require('express');
const router = express.Router();
const InstitutionModel = require('../models/institution');


// Get institutions by state name
router.get('/byState', async (req, res) => {
  const stateName = req.query.state;
  if (!stateName) return res.status(400).json({ error: 'State name is required' });

  try {
    const institutions = await InstitutionModel.find({ state: stateName }).select('name');
    const names = institutions.map(i => i.name);
    res.json(names);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});


module.exports = router;

// Get institution by name
router.get('/getInstitution', async (req, res) => {
  const name = req.query.name;
  if (!name) return res.status(400).json({ error: 'Institution name is required' });

  try {
    const institution = await InstitutionModel.findOne({ name });
    if (!institution) {
      return res.status(404).json({ error: 'Institution not found' });
    }
    res.json(institution);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all institutions (for global search)
// GET all institution names (for global search)
router.get('/allInstitutions', async (req, res) => {
  try {
    const institutions = await InstitutionModel.find().select('name');
    const names = institutions.map(i => i.name);
    res.json(names);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});



