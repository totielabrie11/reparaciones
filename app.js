const express = require('express');
const mongoose = require('mongoose');
const repairRoutes = require('./routes/repairRoutes');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

// Conexión a MongoDB
mongoose.connect('mongodb://localhost:27017/reparacionesDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(cors());
app.use(express.json());
app.use('/api', repairRoutes);

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
