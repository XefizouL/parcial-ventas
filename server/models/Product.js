// server/models/Product.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: [true, 'Por favor ingrese el nombre del producto'],
      trim: true, // Elimina espacios en blanco al inicio y al final
    },
    precio: {
      type: Number,
      required: [true, 'Por favor ingrese el precio del producto'],
    },
    descripcion: {
      type: String,
      required: [true, 'Por favor ingrese una descripción'],
    },
    foto: {
      type: String, // Guardaremos la URL/ruta de la imagen
      required: [true, 'Por favor suba una foto del producto'],
    },
    stock: {
      type: Number,
      required: [true, 'Por favor ingrese la cantidad en stock'],
      default: 0,
    },
  },
  {
    timestamps: true, // Crea automáticamente los campos createdAt y updatedAt
  }
);

module.exports = mongoose.model('Product', productSchema);