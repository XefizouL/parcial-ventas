// server/controllers/reportController.js
const PDFDocument = require('pdfkit');
const Product = require('../models/Product');
const fs = require('fs');
const path = require('path');

// @desc    Generar un reporte de inventario en PDF
// @route   GET /api/reports/inventory
exports.generateInventoryReport = async (req, res) => {
  try {
    // 1. Obtener todos los productos de la base de datos
    const products = await Product.find({});

    // 2. Crear un nuevo documento PDF
    const doc = new PDFDocument({ margin: 50 });

    // 3. Configurar la respuesta HTTP para que el navegador sepa que es un PDF
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline; filename=reporte-inventario.pdf');

    // 4. Conectar el documento PDF a la respuesta. Todo lo que escribamos en 'doc' se enviará al cliente.
    doc.pipe(res);

    // --- Contenido del PDF ---
    // Título
    doc.fontSize(20).text('Reporte de Inventario', { align: 'center' });
    doc.moveDown();

    // Iterar sobre cada producto para añadirlo al PDF
    for (const product of products) {
      doc.fontSize(14).text(`Nombre: ${product.nombre}`, { continued: false });
      doc.fontSize(12).text(`Precio: $${product.precio.toFixed(2)}`);
      doc.fontSize(12).text(`Stock: ${product.stock} unidades`);
      doc.fontSize(12).text(`Descripción: ${product.descripcion}`);
      doc.moveDown(0.5);

      // Añadir la foto del producto
      const imagePath = path.join(__dirname, '..', product.foto); // Construir la ruta absoluta de la imagen
      if (fs.existsSync(imagePath)) {
        doc.image(imagePath, {
          fit: [100, 100], // Ajustar la imagen a un tamaño de 100x100px
          align: 'center',
        });
      } else {
        doc.text('(Imagen no encontrada)', { color: 'red' });
      }

      doc.moveDown(2); // Espacio entre productos
    }
    // --- Fin del Contenido del PDF ---

    // 5. Finalizar el PDF. Esto es muy importante.
    doc.end();

  } catch (error) {
    console.error('Error al generar el reporte PDF:', error);
    res.status(500).json({ message: 'Error del servidor al generar el reporte' });
  }
};