const express = require("express");
const router = express.Router();
const Champeons = require("../models/champeons");

router.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// Obtener todos los campeones
router.get("/", async (req, res) => {
  try {
    const champeons = await Champeons.find();
    res.json(champeons);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Obtener un campeón por ID
router.get("/:id", getChampeon, (req, res) => {
  res.json(res.champeon);
});

// Crear un nuevo campeón
router.post("/champeon/", async (req, res) => {
  const champeon = new Champeons({
    name: req.body.name,
    title: req.body.title,
    tags: req.body.tags, // Agregar el campo tags
    description: req.body.description,
    image: req.body.image,
  });
  try {
    const newChampeon = await champeon.save();
    res.status(201).json(newChampeon);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Actualizar un campeón por ID
router.patch("/champeon/:id", getChampeon, async (req, res) => {
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
    const updatedChampeon = await res.champeon.save();
    res.json(updatedChampeon);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});


// Actualizar completamente un campeón por ID
router.put("/champeon/:id", getChampeon, async (req, res) => {
  try {
    res.champeon.set(req.body);

    const updatedChampeon = await res.champeon.save();
    res.json(updatedChampeon);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Eliminar un campeón por ID
router.delete("/champeon/:id", getChampeon, async (req, res) => {
  try {
    await res.champeon.deleteOne();
    res.json({ message: "Champeon deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

async function getChampeon(req, res, next) {
  let champeon;
  try {
    champeon = await Champeons.findById(req.params.id);
    if (champeon == null) {
      return res.status(404).json({ message: "Cannot find champeon" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.champeon = champeon;
  next();
}


module.exports = router;
