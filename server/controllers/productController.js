// server/controllers/productController.js
const Product = require('../models/Product');

// ------------------------------------
// @desc    Obtener todos los productos
// @route   GET /api/products
// ------------------------------------
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    console.error('ERROR AL OBTENER PRODUCTOS:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
};

// ------------------------------------
// @desc    Crear un nuevo producto
// @route   POST /api/products
// ------------------------------------
exports.createProduct = async (req, res) => {
  const { nombre, precio, descripcion, stock } = req.body;

  if (!req.file) {
    return res.status(400).json({ message: 'Por favor, suba una foto' });
  }

  try {
    const product = new Product({
      nombre,
      precio,
      descripcion,
      stock,
      foto: req.file.path, // Guardamos la ruta de la foto subida
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    console.error('ERROR AL CREAR PRODUCTO:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
};

// ------------------------------------
// @desc    Actualizar un producto
// @route   PUT /api/products/:id
// ------------------------------------
exports.updateProduct = async (req, res) => {
  const { nombre, precio, descripcion, stock } = req.body;

  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      product.nombre = nombre || product.nombre;
      product.precio = precio || product.precio;
      product.descripcion = descripcion || product.descripcion;

      // Permitir stock = 0 sin perder valor
      if (stock !== undefined) {
        product.stock = stock;
      }

      // --- Actualizar foto solo si se sube una nueva ---
      if (req.file) {
        product.foto = req.file.path;
      }

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: 'Producto no encontrado' });
    }
  } catch (error) {
    console.error('ERROR AL ACTUALIZAR PRODUCTO:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
};

// ------------------------------------
// @desc    Eliminar un producto
// @route   DELETE /api/products/:id
// ------------------------------------
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      await product.deleteOne();
      res.json({ message: 'Producto eliminado correctamente' });
    } else {
      res.status(404).json({ message: 'Producto no encontrado' });
    }
  } catch (error) {
    console.error('ERROR AL ELIMINAR PRODUCTO:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
};
