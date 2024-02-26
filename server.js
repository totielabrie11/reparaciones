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
// Asumiendo que tienes configurado multer y el resto del servidor como en ejemplos anteriores

app.post('/upload', upload.single('presupuesto'), (req, res) => {
  if (req.file) {
    const reparacionId = req.body.reparacionId; // Asegúrate de enviar 'reparacionId' junto con el archivo
    const fechaActual = new Date();
    const comentarioPresupuesto = `Presupuesto adjuntado el ${fechaActual.toLocaleDateString()} a las ${fechaActual.toLocaleTimeString()}`;
    const archivoRuta = req.file.path; // Guarda la ruta del archivo subido

    fs.readFile(archivoDbPath, 'utf8', (err, data) => {
      if (err) {
        console.error('Error al leer el archivo de base de datos:', err);
        return res.status(500).send('Error al leer el archivo de base de datos');
      }

      let reparaciones = JSON.parse(data);
      const index = reparaciones.findIndex(r => r.id === parseInt(reparacionId));
      if (index !== -1) {
        reparaciones[index].movimientos.push(comentarioPresupuesto);
        reparaciones[index].archivoPresupuesto = archivoRuta; // Añade la ruta del archivo para referencia futura

        fs.writeFile(archivoDbPath, JSON.stringify(reparaciones, null, 2), 'utf8', err => {
          if (err) {
            console.error('Error al escribir en el archivo de base de datos:', err);
            return res.status(500).send('Error al actualizar el archivo de base de datos');
          }
          res.send({ message: 'Presupuesto cargado y reparación actualizada con éxito', archivoUrl: req.file.filename });
        });
      } else {
        res.status(404).send('Reparación no encontrada');
      }
    });
  } else {
    res.send('Error al subir el archivo');
  }
});

app.get('/descargar/:nombreArchivo', (req, res) => {
  const nombreArchivo = req.params.nombreArchivo;
  const rutaArchivo = path.join( nombreArchivo);
  res.download(rutaArchivo, nombreArchivo, (err) => {
    if (err) {
      // Maneja el error aquí.
      res.status(500).send('Error al descargar el archivo: ' + err.message);
    }
  });
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

  fs.readFile(archivoDbPath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).send({ message: 'Error al leer el archivo de base de datos' });
    }
    const reparaciones = JSON.parse(data || '[]');
    // Asigna un nuevo ID
    const nuevoId = reparaciones.length > 0 ? Math.max(...reparaciones.map(r => r.id)) + 1 : 1;
    nuevaReparacion.id = nuevoId;
    reparaciones.push(nuevaReparacion);

    fs.writeFile(archivoDbPath, JSON.stringify(reparaciones, null, 2), 'utf8', err => {
      if (err) {
        return res.status(500).send({ message: 'Error al guardar la nueva reparación' });
      }
      // Devuelve el ID de la nueva reparación
      res.status(201).json({ id: nuevoId });
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
      // Actualiza el estado de la reparación a 'ingresada', agrega la fecha de ingreso,
      // y vacía el campo "accionesPendientes"
      reparaciones[reparacionIndex].estado = 'ingresada';
      reparaciones[reparacionIndex].fechaIngreso = fechaIngreso;
      reparaciones[reparacionIndex].accionesPendientes = ""; // Vaciar "accionesPendientes"

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
  const { nuevoEstado, nuevoMovimiento } = req.body;
  const fechaActual = new Date();
  const fechaFormateada = fechaActual.toLocaleDateString('es-ES');
  const horaFormateada = fechaActual.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });

  fs.readFile(archivoDbPath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error leyendo el archivo de base de datos:', err);
      return res.status(500).send({ message: 'Error al leer el archivo de base de datos' });
    }

    let reparaciones = JSON.parse(data);
    let reparacionIndex = reparaciones.findIndex(rep => rep.id === parseInt(id));

    if (reparacionIndex !== -1) {
      reparaciones[reparacionIndex].estado = nuevoEstado;
      // Modifica aquí para añadir fecha y hora al movimiento
      let movimientoConFecha = `${nuevoMovimiento} el ${fechaFormateada} a las ${horaFormateada}.`;
      reparaciones[reparacionIndex].movimientos = reparaciones[reparacionIndex].movimientos || [];
      reparaciones[reparacionIndex].movimientos.push(movimientoConFecha);

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
  });
});



app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT} `);
});