const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3000; // Asegúrate de que este puerto no entre en conflicto con el puerto de tu aplicación React

const allowedOrigins = ['http://localhost:3000','http://localhost:3001', 'http://localhost:3002']; // Asegúrate de no repetir el puerto

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Origen no permitido por CORS'));
    }
  },
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(bodyParser.json());

// Define la ruta al archivo JSON
const archivoDbPath = path.join(__dirname, 'frontend', 'src', 'data', 'reparacionesDb.json');

// Verifica si el archivo ya existe
if (!fs.existsSync(archivoDbPath)) {
    // Si el archivo no existe, crea uno nuevo con un arreglo vacío
    fs.writeFileSync(archivoDbPath, JSON.stringify([], null, 2), 'utf8');
    console.log('archivo reparacionesDb.json creado correctamente')
}

// Endpoint para agregar una nueva reparación
app.post('/api/reparaciones', (req, res) => {
  const nuevaReparacion = req.body;
  const archivoDbPath = path.join(__dirname, 'frontend', 'src', 'data', 'reparacionesDb.json');

  fs.readFile(archivoDbPath, (err, data) => {
      if (err) {
          return res.status(500).send({ message: 'Error al leer el archivo de base de datos' });
      }
      // Parsea el contenido actual del archivo a un array
      const reparaciones = JSON.parse(data || '[]');
      // Agrega un ID único a la nueva reparación
      nuevaReparacion.id = reparaciones.length > 0 ? Math.max(...reparaciones.map(r => r.id)) + 1 : 1;
      // Añade la nueva reparación al array
      reparaciones.push(nuevaReparacion);
      // Escribe el array actualizado de nuevo al archivo
      fs.writeFile(archivoDbPath, JSON.stringify(reparaciones, null, 2), 'utf8', (err) => {
          if (err) {
              return res.status(500).send({ message: 'Error al guardar la nueva reparación' });
          }
          res.status(201).send({ message: 'Reparación agregada con éxito' });
      });
  });
});

// Endpoint que devuelve las reparaciones que no han sido ingresadas

app.get('/api/reparaciones/sinIngresar', (req, res) => {
  const archivoDbPath = path.join(__dirname, 'frontend', 'src', 'data', 'reparacionesDb.json');
  fs.readFile(archivoDbPath, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).send({ message: 'Error al leer el archivo de base de datos' });
    }
    try {
      const reparaciones = JSON.parse(data);
      const reparacionesSinIngresar = reparaciones.filter(reparacion => reparacion.estado.toLowerCase() === "sin ingresar");
      res.json(reparacionesSinIngresar);
    } catch (error) {
      console.error('Could not parse JSON:', error);
      res.status(500).send('Error al analizar los datos de reparaciones');
    }
  });
});



// Endpoint para buscar el estado de una reparación
app.get('/api/reparaciones/:id', (req, res) => {
  const { id } = req.params;
  // Asegúrate de que esta ruta sea consistente con la ruta usada en otras partes del servidor
  const archivoDbPath = path.join(__dirname, 'frontend', 'src', 'data', 'reparacionesDb.json');
  const data = fs.readFileSync(archivoDbPath, 'utf8');
  const reparaciones = JSON.parse(data);
  const reparacion = reparaciones.find(r => r.id === parseInt(id));

  if (reparacion) {
    res.json(reparacion);
  } else {
    res.status(404).send({ message: 'Reparación no encontrada' });
  }
});




app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT} `);
});
