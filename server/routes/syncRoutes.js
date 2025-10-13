// server/routes/syncRoutes.js
const express = require('express');
const router = express.Router();
const { syncAtlasToLocal } = require('../controllers/syncController');
const { protect } = require('../middleware/authMiddleware');

// Una ruta POST protegida para iniciar el proceso
router.post('/atlas-to-local', protect, syncAtlasToLocal);

module.exports = router;