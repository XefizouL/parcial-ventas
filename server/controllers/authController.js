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
  let user; // ✅ Declaramos fuera del try

  try {
    user = await User.findOne({ email: req.body.email });

    // ✅ Respuesta genérica para evitar revelar si existe o no
    if (!user) {
      return res.status(200).json({
        message: 'Si el correo está registrado, se enviará un enlace de reseteo.',
      });
    }

    // 1️⃣ Generar token de reseteo
    const resetToken = crypto.randomBytes(20).toString('hex');

    // 2️⃣ Hashear y guardar token temporalmente
    user.resetPasswordToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutos
    await user.save();

    // 3️⃣ Crear URL de reseteo (frontend)
    const resetUrl = `http://localhost:3000/reset-password/${resetToken}`;

    // 4️⃣ Contenido del correo
    const message = `Has solicitado un reseteo de contraseña. 
Haz clic en el siguiente enlace para establecer una nueva contraseña:
${resetUrl}
Si no solicitaste esto, puedes ignorar este mensaje.`;

    // 5️⃣ Enviar correo
    await sendEmail({
      email: user.email,
      subject: 'Reseteo de Contraseña',
      message,
    });

    res.status(200).json({ message: 'Correo enviado' });
  } catch (error) {
    console.error('Error en forgotPassword:', error);

    // ✅ Limpieza en caso de error
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
    // 1️⃣ Hashear el token recibido
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(req.params.resettoken)
      .digest('hex');

    // 2️⃣ Buscar usuario con token válido
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: 'El token es inválido o ha expirado' });
    }

    // 3️⃣ Cambiar la contraseña
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
