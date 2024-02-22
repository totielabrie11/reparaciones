const express = require('express');
const multer = require('multer');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Crear el directorio para los documentos si no existe
const documentsDirectory = path.join(__dirname, 'documents');
fs.mkdirSync(documentsDirectory, { recursive: true });

// Configuración de CORS
const allowedOrigins = ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002'];
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Origen no permitido por CORS'));
    }
  },
  optionsSuccessStatus: 200
}));
app.use(bodyParser.json());

// Configuración de almacenamiento para Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, documentsDirectory);
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// Ruta para cargar archivos
app.post('/upload', upload.single('presupuesto'), (req, res) => {
  if (req.file) {
    console.log('Archivo recibido:', req.file);
    res.send('Archivo subido con éxito');
  } else {
    res.send('Error al subir el archivo');
  }
});

// Configuración de nodemailer (actualiza con tus datos reales)
const transporter = nodemailer.createTransport({
  host: 'smtp.example.com',
  port: 587,
  secure: false,
  auth: {
    user: 'tu@correo.com',
    pass: 'tucontraseña'
  }
});

// Endpoint para enviar el presupuesto
app.post('/api/enviar-presupuesto', async (req, res) => {
  const { id, email } = req.body;

  // Configuración del correo electrónico
  const mailOptions = {
    from: 'tu@correo.com',
    to: email,
    subject: 'Presupuesto de reparación',
    text: `Este es el presupuesto para la reparación con ID ${id}. Adjunto encontrarás el detalle del presupuesto.`
    // Puedes agregar un adjunto si tienes el archivo del presupuesto disponible
  };

  try {
    // Enviar el email
    let info = await transporter.sendMail(mailOptions);
    console.log('Email enviado: ' + info.response);
    res.send({ message: 'Presupuesto enviado con éxito' });
  } catch (error) {
    console.error('Error al enviar el email:', error);
    res.status(500).send({ message: 'Error al enviar el presupuesto' });
  }
});

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

// Endpoint que devuelve todas las reparaciones
app.get('/api/reparaciones/todas', (req, res) => {
  const archivoDbPath = path.join(__dirname, 'frontend', 'src', 'data', 'reparacionesDb.json');
  fs.readFile(archivoDbPath, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).send({ message: 'Error al leer el archivo de base de datos' });
    }
    try {
      const reparaciones = JSON.parse(data);
      
      res.json(reparaciones);
    } catch (error) {
      console.error('Could not parse JSON:', error);
      res.status(500).send('Error al analizar los datos de reparaciones');
    }
  });
});

// Endpoint que devuelve las reparaciones que ya se encuentran en revision para presupuesto
app.get('/api/reparaciones/en_revision', (req, res) => {
  const archivoDbPath = path.join(__dirname, 'frontend', 'src', 'data', 'reparacionesDb.json');
  fs.readFile(archivoDbPath, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).send({ message: 'Error al leer el archivo de base de datos' });
    }
    try {
      const reparaciones = JSON.parse(data);
      const reparacionesSinIngresar = reparaciones.filter(reparacion => reparacion.estado.toLowerCase() === "en revisión");
      res.json(reparacionesSinIngresar);
    } catch (error) {
      console.error('Could not parse JSON:', error);
      res.status(500).send('Error al analizar los datos de reparaciones');
    }
  });
});

// Endpoint que devuelve las reparaciones que ya se encuentran ingresadas
app.get('/api/reparaciones/ingresadas', (req, res) => {
  
  const archivoDbPath = path.join(__dirname, 'frontend', 'src', 'data', 'reparacionesDb.json');
  fs.readFile(archivoDbPath, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).send({ message: 'Error al leer el archivo de base de datos' });
    }
    try {
      const reparaciones = JSON.parse(data);
      const reparacionesSinIngresar = reparaciones.filter(reparacion => reparacion.estado.toLowerCase() === "ingresada");
      res.json(reparacionesSinIngresar);
    } catch (error) {
      console.error('Could not parse JSON:', error);
      res.status(500).send('Error al analizar los datos de reparaciones');
    }
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

// Endpoint para ingresar una reparación (cambiar su estado a 'ingresada')
app.post('/api/reparaciones/ingresar/:id', (req, res) => {
  const { id } = req.params;
  const fechaIngreso = req.body.fechaIngreso;
  const archivoDbPath = path.join(__dirname, 'frontend', 'src', 'data', 'reparacionesDb.json');
  
  fs.readFile(archivoDbPath, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).send({ message: 'Error al leer el archivo de base de datos' });
    }
    
    let reparaciones = JSON.parse(data);
    let reparacionIndex = reparaciones.findIndex(rep => rep.id === parseInt(id));

    if (reparacionIndex !== -1) {
      // Actualiza el estado de la reparación a 'ingresada' y agrega la fecha de ingreso
      reparaciones[reparacionIndex].estado = 'ingresada';
      reparaciones[reparacionIndex].fechaIngreso = fechaIngreso;

      // Guarda el archivo actualizado
      fs.writeFile(archivoDbPath, JSON.stringify(reparaciones, null, 2), 'utf8', (err) => {
        if (err) {
          console.error(err);
          return res.status(500).send({ message: 'Error al actualizar el archivo de base de datos' });
        }
        
        // Vuelve a leer el archivo actualizado y envía las reparaciones sin ingresar
        fs.readFile(archivoDbPath, 'utf8', (err, updatedData) => {
          if (err) {
            console.error(err);
            return res.status(500).send({ message: 'Error al leer el archivo de base de datos' });
          }
          const updatedReparaciones = JSON.parse(updatedData);
          const reparacionesSinIngresar = updatedReparaciones.filter(rep => rep.estado.toLowerCase() === "sin ingresar");
          res.json(reparacionesSinIngresar);
        });
      });
    } else {
      res.status(404).send({ message: 'Reparación no encontrada' });
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

app.post('/api/reparaciones/actualizarEstado/:id', (req, res) => {
  const { id } = req.params;
  const { nuevoEstado, nuevoMovimiento } = req.body; // Asumiendo que también envías un nuevo movimiento

  fs.readFile(archivoDbPath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error leyendo el archivo de base de datos:', err);
      return res.status(500).send({ message: 'Error al leer el archivo de base de datos' });
    }

    try {
      let reparaciones = JSON.parse(data);
      let reparacionIndex = reparaciones.findIndex(rep => rep.id === parseInt(id));

      if (reparacionIndex !== -1) {
        reparaciones[reparacionIndex].estado = nuevoEstado;
        // Asegúrate de que el campo movimientos exista y sea un array, luego agrega el nuevo movimiento
        reparaciones[reparacionIndex].movimientos = reparaciones[reparacionIndex].movimientos || [];
        reparaciones[reparacionIndex].movimientos.push(nuevoMovimiento);

        fs.writeFile(archivoDbPath, JSON.stringify(reparaciones, null, 2), 'utf8', (err) => {
          if (err) {
            console.error('Error escribiendo en el archivo de base de datos:', err);
            return res.status(500).send({ message: 'Error al actualizar la reparación' });
          }
          res.send({ message: 'Reparación actualizada con éxito', reparacion: reparaciones[reparacionIndex] });
        });
      } else {
        res.status(404).send({ message: 'Reparación no encontrada' });
      }
    } catch (error) {
      console.error('Error al analizar los datos de reparaciones:', error);
      res.status(500).send({ message: 'Error al procesar los datos de reparaciones' });
    }
  });
});



app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT} `);
});
