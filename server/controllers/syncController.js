// server/controllers/syncController.js
const mongoose = require('mongoose');
const Product = require('../models/Product'); // Reutilizamos el modelo de producto

exports.syncAtlasToLocal = async (req, res) => {
  let localDB; // Variable para mantener la conexión local
  try {
    console.log('Iniciando sincronización...');

    // 1. Obtener todos los productos de Atlas (la conexión por defecto)
    const productsFromAtlas = await Product.find({});
    console.log(`${productsFromAtlas.length} productos obtenidos de Atlas.`);

    // 2. Conectarse a la base de datos local
    localDB = await mongoose.createConnection(process.env.MONGO_URI_LOCAL).asPromise();
    const ProductLocal = localDB.model('Product', Product.schema); // Crear un modelo para la conexión local

    // 3. Borrar todos los productos existentes en la base de datos local
    await ProductLocal.deleteMany({});
    console.log('Base de datos local limpiada.');

    // 4. Insertar todos los productos de Atlas en la base de datos local
    if (productsFromAtlas.length > 0) {
      await ProductLocal.insertMany(productsFromAtlas);
      console.log('Productos insertados en la base de datos local.');
    }

    res.status(200).json({
      message: `Sincronización completada. ${productsFromAtlas.length} productos transferidos.`,
    });
  } catch (error) {
    console.error('Error durante la sincronización:', error);
    res.status(500).json({ message: 'Falló la sincronización.' });
  } finally {
    // 5. Asegurarse de cerrar la conexión local
    if (localDB) {
      await localDB.close();
      console.log('Conexión local cerrada.');
    }
  }
};