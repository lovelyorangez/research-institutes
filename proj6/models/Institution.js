const mongoose = require('mongoose');

const institutionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  state: String,
  type: String,
});

// Check if the model is already registered, else create it
const Institution = mongoose.models.Institution || mongoose.model('Institution', institutionSchema);

module.exports = Institution;

