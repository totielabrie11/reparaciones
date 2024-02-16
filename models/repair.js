const mongoose = require('mongoose');

const repairSchema = new mongoose.Schema({
  status: String,
  userDetails: {
    name: String,
    email: String,
    phone: String,
  },
  repairDetails: String,
  chatMessages: [{
    message: String,
    createdAt: Date,
  }],
  // Agregar más campos según sea necesario
});

module.exports = mongoose.model('Repair', repairSchema);
