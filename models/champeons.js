// Importar el módulo Mongoose para la definición de esquemas y modelos
const mongoose = require('mongoose');

// Definir el esquema (schema) para los campeones
const champeonsSchema = new mongoose.Schema({
  // Nombre del campeón (tipo String, requerido)
  name: {
    type: String,
    required: true
  },
  // Título del campeón (tipo String, requerido)
  title: {
    type: String,
    required: true,
  },
  // Tags del campeón, representados como un arreglo de Strings (requerido)
  tags: {
    type: [String],
    required: true
  },
  // Descripción del campeón (tipo String, requerido)
  description: {
    type: String,
    required: true
  },
  // URL de la imagen del campeón (tipo String, requerido)
  image: {
    type: String,
    required: true
  },
});

// Exportar el modelo 'champeons' basado en el esquema definido
module.exports = mongoose.model('champeons', champeonsSchema);
