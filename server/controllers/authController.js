// server/controllers/authController.js
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');

// 🔑 Generar token JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Registrar un nuevo usuario
// @route   POST /api/auth/register
exports.registerUser = async (req, res) => {
  const { nombre, email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'El usuario ya existe' });
    }

    const user = await User.create({
      nombre,
      email,
      password,
    });

    res.status(201).json({
      _id: user._id,
      nombre: user.nombre,
      email: user.email,
      token: generateToken(user._id),
    });

  } catch (error) {
    console.error('Error en registerUser:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
};

// @desc    Autenticar (login) un usuario
// @route   POST /api/auth/login
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        _id: user._id,
        nombre: user.nombre,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Credenciales inválidas' });
    }
  } catch (error) {
    console.error('Error en loginUser:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
};

// @desc    Obtener perfil de usuario autenticado
// @route   GET /api/auth/profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'Usuario no encontrado' });
    }
  } catch (error) {
    console.error('Error en getProfile:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
};

// @desc    Solicitar reseteo de contraseña (Forgot Password)
// @route   POST /api/auth/forgotpassword
exports.forgotPassword = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json({ message: 'No se encontró un usuario con ese correo' });
    }

    // 1. Generar un token de reseteo
    const resetToken = crypto.randomBytes(20).toString('hex');

    // 2. Hashear el token y guardarlo en la base de datos
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // Válido por 10 minutos
    await user.save();

    // 3. Crear la URL de reseteo (usa la del frontend)
    const resetUrl = `http://localhost:3000/reset-password/${resetToken}`;

    const message = `Has recibido este correo porque solicitaste un reseteo de contraseña. 
Por favor, haz clic en el siguiente enlace para establecer una nueva contraseña:\n\n${resetUrl}\n\nSi no solicitaste esto, ignora este correo.`;

    // 4. Enviar el correo
    await sendEmail({
      email: user.email,
      subject: 'Reseteo de Contraseña',
      message,
    });

    res.status(200).json({ message: 'Correo enviado' });
  } catch (error) {
    console.error(error);
    if (user) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save();
    }
    res.status(500).json({ message: 'Error al enviar el correo' });
  }
};

// @desc    Resetear la contraseña
// @route   PUT /api/auth/resetpassword/:resettoken
exports.resetPassword = async (req, res) => {
  try {
    // 1. Hashear el token de la URL
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.resettoken).digest('hex');

    // 2. Buscar usuario válido
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: 'El token es inválido o ha expirado' });
    }

    // 3. Cambiar contraseña
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.status(200).json({ message: 'Contraseña actualizada correctamente' });
  } catch (error) {
    console.error('Error en resetPassword:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
};
