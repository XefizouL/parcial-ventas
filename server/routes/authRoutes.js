// server/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const { 
  registerUser, 
  loginUser, 
  getProfile, 
  forgotPassword, 
  resetPassword 
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// ✅ Rutas principales de autenticación
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', protect, getProfile);

// ✅ Rutas para recuperación de contraseña
router.post('/forgotpassword', forgotPassword);
router.put('/resetpassword/:resettoken', resetPassword);

module.exports = router;
