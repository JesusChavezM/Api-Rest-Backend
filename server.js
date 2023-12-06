// Carga la configuración de las variables de entorno desde el archivo .env
require('dotenv').config();

// Importa los módulos necesarios
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors'); // Importa el módulo cors

// Conecta a la base de datos MongoDB usando la URL proporcionada en las variables de entorno
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true });

// Configura eventos para manejar errores y confirmar la conexión a la base de datos
const db = mongoose.connection;
db.on('error', (error) => console.error(error));
db.once('open', () => console.log('Connected to database'));

// Permite a la aplicación procesar datos en formato JSON
app.use(express.json());

// Configuración de CORS para permitir solicitudes desde un dominio específico
const corsOptions = {
  origin: 'http://127.0.0.1:5500', // Reemplaza esto con tu dominio de frontend
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
};
app.use(cors(corsOptions));

// Importa y utiliza el enrutador definido en champeons.js para manejar las rutas relacionadas con campeones
const champeonsRouter = require('./routes/champeons');
app.use('/', champeonsRouter);

// Configura el puerto en el que el servidor escuchará las solicitudes, usa el puerto proporcionado en las variables de entorno o el puerto 3000 por defecto
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
