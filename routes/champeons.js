// Importa el módulo express y crea un enrutador
const express = require("express");
const router = express.Router();

// Importa el modelo de datos para los campeones
const Champeons = require("../models/champeons");

// Middleware para configurar CORS y permitir solicitudes desde cualquier origen
router.use((req, res, next) => {
  // Configura las cabeceras CORS para permitir solicitudes desde cualquier origen
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// Ruta para obtener todos los campeones
router.get("/", async (req, res) => {
  try {
    // Obtiene todos los campeones de la base de datos
    const champeons = await Champeons.find();
    res.json(champeons);
  } catch (err) {
    // Maneja errores y devuelve un mensaje de error en caso de fallo
    res.status(500).json({ message: err.message });
  }
});

// Ruta para obtener un campeón por ID
router.get("/:id", getChampeon, (req, res) => {
  // Devuelve el campeón obtenido por el middleware getChampeon
  res.json(res.champeon);
});

// Ruta para crear un nuevo campeón
router.post("/champeon/", async (req, res) => {
  // Crea un nuevo campeón utilizando los datos proporcionados en la solicitud
  const champeon = new Champeons({
    name: req.body.name,
    title: req.body.title,
    tags: req.body.tags, // Agrega el campo tags
    description: req.body.description,
    image: req.body.image,
  });

  try {
    // Guarda el nuevo campeón en la base de datos
    const newChampeon = await champeon.save();
    res.status(201).json(newChampeon);
  } catch (err) {
    // Maneja errores y devuelve un mensaje de error en caso de fallo
    res.status(400).json({ message: err.message });
  }
});

// Ruta para actualizar parcialmente un campeón por ID
router.patch("/champeon/:id", getChampeon, async (req, res) => {
  // Actualiza los campos del campeón con los datos proporcionados en la solicitud
  // Solo actualiza los campos que se proporcionan en la solicitud
  if (req.body.name != null) {
    res.champeon.name = req.body.name;
  }
  if (req.body.title != null) {
    res.champeon.title = req.body.title;
  }
  if (req.body.tags != null) {
    res.champeon.tags = req.body.tags; // Actualizar el campo tags
  }
  if (req.body.description != null) {
    res.champeon.description = req.body.description;
  }
  if (req.body.image != null) {
    res.champeon.image = req.body.image;
  }
  try {
    // Guarda el campeón actualizado en la base de datos
    const updatedChampeon = await res.champeon.save();
    res.json(updatedChampeon);
  } catch (err) {
    // Maneja errores y devuelve un mensaje de error en caso de fallo
    res.status(400).json({ message: err.message });
  }
});

// Ruta para actualizar completamente un campeón por ID
router.put("/champeon/:id", getChampeon, async (req, res) => {
  try {
    // Actualiza completamente el campeón con los datos proporcionados en la solicitud
    res.champeon.set(req.body);

    // Guarda el campeón actualizado en la base de datos
    const updatedChampeon = await res.champeon.save();
    res.json(updatedChampeon);
  } catch (err) {
    // Maneja errores y devuelve un mensaje de error en caso de fallo
    res.status(400).json({ message: err.message });
  }
});

// Ruta para eliminar un campeón por ID
router.delete("/champeon/:id", getChampeon, async (req, res) => {
  try {
    // Elimina el campeón de la base de datos
    await res.champeon.deleteOne();
    res.json({ message: "Champeon deleted" });
  } catch (err) {
    // Maneja errores y devuelve un mensaje de error en caso de fallo
    res.status(500).json({ message: err.message });
  }
});

// Middleware para obtener un campeón por ID y adjuntarlo a la solicitud
async function getChampeon(req, res, next) {
  let champeon;
  try {
    // Busca un campeón por su ID en la base de datos
    champeon = await Champeons.findById(req.params.id);
    if (champeon == null) {
      // Devuelve un error si no se encuentra el campeón
      return res.status(404).json({ message: "Cannot find champeon" });
    }
  } catch (err) {
    // Maneja errores y devuelve un mensaje de error en caso de fallo
    return res.status(500).json({ message: err.message });
  }

  // Adjunta el campeón encontrado a la respuesta
  res.champeon = champeon;
  next();
}

// Exporta el enrutador para ser utilizado en otras partes de la aplicación
module.exports = router;
