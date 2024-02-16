const express = require('express');
const router = express.Router();
const Repair = require('../models/repair');

// Endpoint para crear una nueva reparación
router.post('/repairs', async (req, res) => {
  const repair = new Repair(req.body);
  try {
    await repair.save();
    res.status(201).send(repair);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Agregar más endpoints según sea necesario

module.exports = router;
