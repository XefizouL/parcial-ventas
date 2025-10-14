// server/models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: [true, 'Por favor ingrese un nombre'],
  },
  email: {
    type: String,
    required: [true, 'Por favor ingrese un email'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Por favor ingrese un email válido',
    ],
  },
  password: {
    type: String,
    required: [true, 'Por favor ingrese una contraseña'],
    minlength: 6,
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
});

// Middleware que se ejecuta ANTES de guardar un documento
// Esto encripta la contraseña
userSchema.pre('save', async function (next) {
  // Si la contraseña no ha sido modificada, no la encriptamos de nuevo
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

module.exports = mongoose.model('User', userSchema);