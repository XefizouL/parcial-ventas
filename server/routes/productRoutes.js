// server/routes/productRoutes.js
const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require('multer');

const {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');
const { protect } = require('../middleware/authMiddleware');

// Configuración de Multer (para imágenes)
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename(req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// Rutas
router.get('/', getAllProducts);
router.post('/', protect, upload.single('foto'), createProduct);
router.put('/:id', protect, upload.single('foto'), updateProduct);
router.delete('/:id', protect, deleteProduct);

module.exports = router;
