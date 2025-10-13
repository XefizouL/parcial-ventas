// server/server.js
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Servir imágenes del folder "uploads"
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

// Rutas principales
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/reports', require('./routes/reportRoutes')); 
app.use('/api/sync', require('./routes/syncRoutes')); 

// Ruta base de prueba
app.get('/', (req, res) => {
  res.send('API de ventas funcionando');
});

// Escuchar en el puerto
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));

// Middleware de error global
app.use((err, req, res, next) => {
  console.error('Error global:', err.stack);
  res.status(500).json({ message: 'Error interno del servidor', error: err.message });
});

