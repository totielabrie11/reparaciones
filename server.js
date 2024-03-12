const express = require('express');
const multer = require('multer');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
app.use(cors());

const PORT = 3000;

// Crear el directorio para los documentos si no existe
const documentsDirectory = path.join(__dirname, 'documents');
fs.mkdirSync(documentsDirectory, { recursive: true });

const ticketsDirectory = path.join(__dirname, 'documents', 'tickets');

// Verifica si el directorio existe. Si no, lo crea.
if (!fs.existsSync(ticketsDirectory)) {
    fs.mkdirSync(ticketsDirectory, { recursive: true });
    console.log('Directorio para tickets creado:', ticketsDirectory);
} else {
    console.log('Directorio para tickets ya existe:', ticketsDirectory);
}

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
        reparaciones[index].accionesPendientes = "Presupuesto adjuntado y pendiente de aprobación";
        reparaciones[index].movimientos.push(comentarioPresupuesto);
        reparaciones[index].archivoPresupuesto = archivoRuta; // Añade la ruta del archivo para referencia futura

        // Aquí guardamos los cambios y preparamos la respuesta
        fs.writeFile(archivoDbPath, JSON.stringify(reparaciones, null, 2), 'utf8', err => {
          if (err) {
            console.error('Error al escribir en el archivo de base de datos:', err);
            return res.status(500).send('Error al actualizar el archivo de base de datos');
          }
          // Incluyendo el nombre en la respuesta
          res.send({ 
            message: 'Presupuesto cargado y reparación actualizada con éxito', 
            archivoUrl: req.file.filename,
            nombre: reparaciones[index].nombre // Asumiendo que la propiedad se llama 'nombre'
          });
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

// Nuevo endpoint para buscar una reparación por ID o por IDpalometa
app.get('/api/reparaciones/consultarBuscar', (req, res) => {
  const { id, idPalometa } = req.query;
  const archivoDbPath = path.join(__dirname, 'frontend', 'src', 'data', 'reparacionesDb.json');

  fs.readFile(archivoDbPath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error al leer el archivo de base de datos:', err);
      return res.status(500).send({ message: 'Error al leer el archivo de base de datos' });
    }

    const reparaciones = JSON.parse(data || '[]');
    let reparacionEncontrada;

    // Buscar por ID numérico o por IDpalometa
    if (id) {
      reparacionEncontrada = reparaciones.find(r => r.id === parseInt(id));
    } else if (idPalometa) {
      reparacionEncontrada = reparaciones.find(r => r.IDpalometa === idPalometa);
    }

    if (reparacionEncontrada) {
      res.json(reparacionEncontrada);
    } else {
      res.status(404).send({ message: 'Reparación no encontrada' });
    }
  });
});

// Endpoint que devuelve solo las reparaciones que tienen mensaje pendiente

app.get('/api/reparaciones/mensajes', (req, res) => {
  const archivoDbPath = path.join(__dirname, 'frontend', 'src', 'data', 'reparacionesDb.json');
  fs.readFile(archivoDbPath, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).send({ message: 'Error al leer el archivo de base de datos' });
    }
    try {
      const reparaciones = JSON.parse(data);
      // Filtrar reparaciones que contienen al menos un mensaje pendiente
      const reparacionesConMensajesPendientes = reparaciones.filter(reparacion => 
        reparacion.mensajes && reparacion.mensajes.some(mensaje => mensaje.estado === "pendiente"));
      res.json(reparacionesConMensajesPendientes);
    } catch (error) {
      console.error('Could not parse JSON:', error);
      res.status(500).send('Error al analizar los datos de reparaciones');
    }
  });
});


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

// Endpoint que devuelve reparaciones con estado "finalizada" o "declinada"
app.get('/api/reparaciones/estado/finalizada-declinada', (req, res) => {
  const archivoDbPath = path.join(__dirname, 'frontend', 'src', 'data', 'reparacionesDb.json');
  fs.readFile(archivoDbPath, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).send({ message: 'Error al leer el archivo de base de datos' });
    }
    try {
      const reparaciones = JSON.parse(data);
      
      // Filtrar reparaciones por estado "finalizada" o "declinada"
      const reparacionesFiltradas = reparaciones.filter(rep => rep.estado === 'finalizada' || rep.estado === 'declinada');
      
      res.json(reparacionesFiltradas);
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

// Endpoint que devuelve las reparaciones que cuentan con presupuestos aprobados
app.get('/api/reparaciones/aprobadas', (req, res) => {
  const archivoDbPath = path.join(__dirname, 'frontend', 'src', 'data', 'reparacionesDb.json');
  fs.readFile(archivoDbPath, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).send({ message: 'Error al leer el archivo de base de datos' });
    }
    try {
      const reparaciones = JSON.parse(data);
      const reparacionesSinIngresar = reparaciones.filter(reparacion => reparacion.estado.toLowerCase() === "aceptada");
      res.json(reparacionesSinIngresar);
    } catch (error) {
      console.error('Could not parse JSON:', error);
      res.status(500).send('Error al analizar los datos de reparaciones');
    }
  });
});

// Endpoint que devuelve las reparaciones que fueron declinadas
app.get('/api/reparaciones/declinadas', (req, res) => {
  const archivoDbPath = path.join(__dirname, 'frontend', 'src', 'data', 'reparacionesDb.json');
  fs.readFile(archivoDbPath, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).send({ message: 'Error al leer el archivo de base de datos' });
    }
    try {
      const reparaciones = JSON.parse(data);
      const reparacionesSinIngresar = reparaciones.filter(reparacion => reparacion.estado.toLowerCase() === "declinada");
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

// Endpoint para verificar si un IDpalometa ya existe
app.get('/api/reparaciones/verificarPalometa/:id', (req, res) => {
  const idBuscado = req.params.id;

  const archivoDbPath = path.join(__dirname, 'frontend', 'src', 'data', 'reparacionesDb.json');
  // Lee el archivo de reparaciones
  fs.readFile(archivoDbPath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error leyendo el archivo de base de datos:', err);
      return res.status(500).send({ mensaje: 'Error al leer el archivo de base de datos' });
    }

    try {
      // Parsea el JSON
      const reparaciones = JSON.parse(data);

      // Busca el IDpalometa dentro del array de reparaciones
      const existe = reparaciones.some(rep => rep.IDpalometa === idBuscado);

      // Si el IDpalometa es vacío (y eso es permitido), o no existe, podemos continuar
      if (idBuscado === '' || !existe) {
        res.json({ existe: false });
      } else {
        res.json({ existe: true });
      }
    } catch (error) {
      console.error('No se pudo analizar el JSON:', error);
      res.status(500).send({ mensaje: 'Error al analizar los datos de reparaciones' });
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

app.post('/api/reparaciones/ingresar/:id', (req, res) => {
  const { id } = req.params;
  const { fechaIngreso, IDpalometa, nuevoMovimiento, accionesPendientes } = req.body; // Recibe IDpalometa del cuerpo de la solicitud
  const archivoDbPath = path.join(__dirname, 'frontend', 'src', 'data', 'reparacionesDb.json');
  
  fs.readFile(archivoDbPath, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).send({ message: 'Error al leer el archivo de base de datos' });
    }
    
    let reparaciones = JSON.parse(data);
    let reparacionIndex = reparaciones.findIndex(rep => rep.id === parseInt(id));

    if (reparacionIndex !== -1) {
      reparaciones[reparacionIndex].estado = 'ingresada';
      reparaciones[reparacionIndex].fechaIngreso = fechaIngreso;
      reparaciones[reparacionIndex].accionesPendientes = "";
      reparaciones[reparacionIndex].IDpalometa = IDpalometa; // Agrega IDpalometa al objeto de reparación
      reparaciones[reparacionIndex].movimientos = nuevoMovimiento;
      reparaciones[reparacionIndex].accionesPendientes = accionesPendientes;

      fs.writeFile(archivoDbPath, JSON.stringify(reparaciones, null, 2), 'utf8', (err) => {
        if (err) {
          console.error(err);
          return res.status(500).send({ message: 'Error al actualizar el archivo de base de datos' });
        }

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

// Endpoint para actualizar el estado de una reparación.
app.post('/api/reparaciones/actualizarEstado/:id', (req, res) => {
  const { id } = req.params;
  const { nuevoEstado, nuevoMovimiento, nuevaAccion, numeroSerie, opcionNumeroSerie } = req.body;

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
      
      // Asegurar que movimientos es siempre un array
      if (!Array.isArray(reparaciones[reparacionIndex].movimientos)) {
        reparaciones[reparacionIndex].movimientos = [];
      }
      
      let movimientoConFecha = `${nuevoMovimiento} el ${fechaFormateada} a las ${horaFormateada}.`;
      reparaciones[reparacionIndex].movimientos.push(movimientoConFecha);
      reparaciones[reparacionIndex].accionesPendientes = nuevaAccion;
      
      if (numeroSerie) {
        reparaciones[reparacionIndex].numeroSerie = numeroSerie;
      }

      if (opcionNumeroSerie) {
        reparaciones[reparacionIndex].opcionNumeroSerie = opcionNumeroSerie;
      }

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



// Configuración para los reclamos
// Define la ruta al archivo JSON
const archivoReclamosPath = path.join(__dirname, 'data', 'reclamosDb.json');

// Verifica si el archivo ya existe
if (!fs.existsSync(archivoReclamosPath)) {
    // Si el archivo no existe, crea uno nuevo con un arreglo vacío como contenido inicial
    fs.writeFileSync(archivoReclamosPath, JSON.stringify([]), 'utf8');
    console.log('Archivo reclamosDb.json creado correctamente');
}

// Ruta para crear un nuevo reclamo
app.post('/api/reclamos/crear', (req, res) => {
    const { reparacionId, motivo } = req.body; // Asegura que se recibe tanto el ID como el motivo del reclamo

    // Asegúrate de validar los datos de entrada aquí
    if (!reparacionId || !motivo) {
        return res.status(400).send('Datos incompletos para el reclamo');
    }

    const nuevoReclamo = {
        id: Date.now(), // Genera un ID único para el reclamo, por ejemplo, usando el timestamp actual
        reparacionId, // El ID de la reparación asociada al reclamo
        motivo, // El motivo del reclamo
        fecha: new Date().toISOString() // Opcional: registra la fecha de creación del reclamo
    };

    fs.readFile(archivoReclamosPath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error al leer el archivo de reclamos:', err);
            return res.status(500).send('Error al procesar su reclamo');
        }

        // Parsear los datos existentes y añadir el nuevo reclamo
        const reclamos = JSON.parse(data);
        reclamos.push(nuevoReclamo);

        // Guardar la lista actualizada de reclamos
        fs.writeFile(archivoReclamosPath, JSON.stringify(reclamos, null, 2), 'utf8', (err) => {
            if (err) {
                console.error('Error al guardar el reclamo:', err);
                return res.status(500).send('Error al procesar su reclamo');
            }
            res.send({ mensaje: 'Reclamo creado con éxito', reclamoId: nuevoReclamo.id });
        });
    });
});

// Definiendo la ruta al archivo JSON donde están las reparaciones
const archivoReparacionesPath = path.join(__dirname, 'frontend', 'src', 'data', 'reparacionesdb.json');
console.log("🚀 ~ archivoReparacionesPath:", archivoReparacionesPath)

// Endpoint para enviar un mensaje a de cliente al administrador 
app.post('/api/mensajes/crear', (req, res) => {
    const { reparacionId, contenido } = req.body;

    if (!reparacionId || !contenido) {
        return res.status(400).send('Datos incompletos para el mensaje');
    }

    // Leer el archivo de reparaciones
    fs.readFile(archivoReparacionesPath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error al leer el archivo de reparaciones:', err);
            return res.status(500).send('Error al procesar su mensaje');
        }

        // Parsear los datos existentes y encontrar la reparación
        const reparaciones = JSON.parse(data);
        const reparacionIndex = reparaciones.findIndex(rep => rep.id === reparacionId);

        // Si no se encuentra la reparación, enviar un error
        if (reparacionIndex === -1) {
            return res.status(404).send('Reparación no encontrada');
        }

        // Si no existe el array de mensajes, inicializarlo
        if (!reparaciones[reparacionIndex].mensajes) {
            reparaciones[reparacionIndex].mensajes = [];
        }

        // Añadir el nuevo mensaje
        const nuevoMensaje = {
            id: Date.now(), // ID único para el mensaje
            contenido,
            fecha: new Date().toISOString(),
            estado: "pendiente" // Estado predeterminado para nuevos mensajes
        };
        reparaciones[reparacionIndex].mensajes.push(nuevoMensaje);

        // Guardar la lista actualizada de reparaciones
        fs.writeFile(archivoReparacionesPath, JSON.stringify(reparaciones, null, 2), 'utf8', (err) => {
            if (err) {
                console.error('Error al guardar los mensajes en la reparación:', err);
                return res.status(500).send('Error al guardar su mensaje');
            }
            res.send({ mensaje: 'Mensaje añadido con éxito a la reparación', mensajeId: nuevoMensaje.id });
        });
    });
});

// Endpoint para responder un mensaje de administrador a cliente
app.post('/api/mensajes/:idMensaje/responder', (req, res) => {
  const { idMensaje } = req.params;
  const { respuesta } = req.body;

  if (!respuesta) {
      return res.status(400).send('La respuesta es requerida');
  }

  // Leer el archivo de reparaciones
  fs.readFile(archivoReparacionesPath, 'utf8', (err, data) => {
      if (err) {
          console.error('Error al leer el archivo de reparaciones:', err);
          return res.status(500).send('Error al procesar la respuesta');
      }

      const reparaciones = JSON.parse(data);

      // Encontrar la reparación y el mensaje específico
      let mensajeRespondido = false;
      reparaciones.forEach(rep => {
          if (rep.mensajes) {
              const mensajeIndex = rep.mensajes.findIndex(mensaje => mensaje.id.toString() === idMensaje);
              if (mensajeIndex !== -1) {
                  // Actualizar el mensaje como respondido
                  rep.mensajes[mensajeIndex].estado = 'respondido';
                  rep.mensajes[mensajeIndex].respondido = true;
                  rep.mensajes[mensajeIndex].respuesta = respuesta;
                  rep.mensajes[mensajeIndex].fechaRespuesta = new Date().toISOString();
                  mensajeRespondido = true;
              }
          }
      });

      if (!mensajeRespondido) {
          return res.status(404).send('Mensaje no encontrado');
      }

      // Guardar la lista actualizada de reparaciones
      fs.writeFile(archivoReparacionesPath, JSON.stringify(reparaciones, null, 2), 'utf8', (err) => {
          if (err) {
              console.error('Error al guardar la respuesta en el mensaje:', err);
              return res.status(500).send('Error al guardar la respuesta');
          }
          res.send({ mensaje: 'Respuesta añadida con éxito', idMensaje });
      });
  });
});




app.use(express.urlencoded({ extended: true }));
app.use('/documents', express.static(path.join(__dirname, 'documents')));

const uploadTicket = multer({ dest: 'tmp/' });

app.post('/api/generar-pdf', uploadTicket.single('pdf'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No se recibió el archivo');
  }

  const id = req.body.id;
  if (!id) {
    return res.status(400).send('No se proporcionó el ID del ticket');
  }

  const tempPath = req.file.path;
  const newFilename = `ticket-reparacion-${id}.pdf`;
  const finalPath = path.join(__dirname, 'documents', 'tickets', newFilename);
  const downloadPath = `/documents/tickets/${newFilename}`;

  fs.rename(tempPath, finalPath, err => {
    if (err) {
      console.error('Error al renombrar el archivo PDF:', err);
      return res.status(500).send('Error al procesar el archivo PDF');
    }

    const archivoDbPath = path.join(__dirname, 'frontend', 'src', 'data', 'reparacionesDb.json');
    
    fs.readFile(archivoDbPath, 'utf8', (err, data) => {
      if (err) {
        console.error('Error al leer el archivo de base de datos:', err);
        return res.status(500).send({ message: 'Error al leer el archivo de base de datos' });
      }

      const reparaciones = JSON.parse(data || '[]');
      const reparacionIndex = reparaciones.findIndex(reparacion => reparacion.id === parseInt(id));

      if (reparacionIndex !== -1) {
        reparaciones[reparacionIndex].descargaTicket = downloadPath;
        
        fs.writeFile(archivoDbPath, JSON.stringify(reparaciones, null, 2), 'utf8', (err) => {
          if (err) {
            console.error('Error al escribir en el archivo de base de datos:', err);
            return res.status(500).send({ message: 'Error al actualizar el archivo de base de datos' });
          }

          res.status(200).json({
            message: 'Archivo guardado con éxito y base de datos actualizada',
            downloadLink: `http://localhost:3000${downloadPath}`
          });
        });
      } else {
        res.status(404).send({ message: 'Reparación no encontrada' });
      }
    });
  });
});

// ... Aquí irían otros endpoints y configuraciones de tu aplicación Express



app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT} `);
});