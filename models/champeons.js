const mongoose = require('mongoose');

const champeonsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true,
  },
  tags: {
    type: [String],
    required: true
  },
  description: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
});

module.exports = mongoose.model('champeons', champeonsSchema);
