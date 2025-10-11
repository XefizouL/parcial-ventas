const express = require('express');
const router = express.Router();
const { generateInventoryReport } = require('../controllers/reportController');
const { protect } = require('../middleware/authMiddleware');

// Ruta protegida para generar el reporte de inventario
router.get('/inventory', protect, generateInventoryReport);

module.exports = router;
// server/routes/reportRoutes.js
router.get('/inventory', protect, generateInventoryReport); // Asegúrate de que 'protect' esté de vuelta
