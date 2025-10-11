// client/app/products/page.jsx (Versión Completa y Funcional)
"use client";

import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../../context/AuthContext';
import ProductForm from '../../components/ProductForm';
import styles from './Products.module.css';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const { user } = useContext(AuthContext);

  const fetchProducts = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/products');
      setProducts(res.data);
    } catch (error) {
      console.error('Error al obtener los productos:', error);
    }
  };

  useEffect(() => {
    if (!user) return;
    fetchProducts();
  }, [user]);

  const handleDeleteProduct = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      try {
        await axios.delete(`http://localhost:5000/api/products/${id}`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        fetchProducts();
      } catch (error) {
        console.error('Error al eliminar el producto:', error);
      }
    }
  };

  // --- ABRIR EL MODAL PARA EDITAR ---
  const handleEditClick = (product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  // --- ABRIR EL MODAL PARA CREAR ---
  const handleAddClick = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  // --- CERRAR EL MODAL Y LIMPIAR ---
  const handleCancel = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  // --- FUNCIÓN DE GUARDADO CON VALIDACIONES PARA CREAR Y ACTUALIZAR ---
  const handleSaveProduct = async (formData) => {
    // --- INICIO DEL BLOQUE DE VALIDACIÓN ---
    const nombre = formData.get('nombre')?.trim();
    const descripcion = formData.get('descripcion')?.trim();
    const precio = formData.get('precio');
    const stock = formData.get('stock');
    const foto = formData.get('foto');

    if (!nombre) {
      alert("El campo 'Nombre' es obligatorio.");
      return;
    }
    if (!descripcion) {
      alert("El campo 'Descripción' es obligatorio.");
      return;
    }
    if (!precio || isNaN(precio) || Number(precio) <= 0) {
      alert("El 'Precio' debe ser un número positivo.");
      return;
    }
    if (stock === null || stock === '' || isNaN(stock) || !Number.isInteger(Number(stock)) || Number(stock) < 0) {
      alert("El 'Stock' debe ser un número entero igual o mayor a cero.");
      return;
    }
    
    // AJUSTE CLAVE: La foto solo es obligatoria si estamos CREANDO un producto nuevo.
    // Si estamos editando (!editingProduct es falso), esta validación se omite.
    if (!editingProduct && (!foto || foto.size === 0)) {
      alert("Debe seleccionar una imagen para el producto.");
      return;
    }
    // --- FIN DEL BLOQUE DE VALIDACIÓN ---

    try {
      if (editingProduct) {
        // --- LÓGICA DE ACTUALIZACIÓN ---
        await axios.put(`http://localhost:5000/api/products/${editingProduct._id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${user.token}`,
          },
        });
      } else {
        // --- LÓGICA DE CREACIÓN ---
        await axios.post('http://localhost:5000/api/products', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${user.token}`,
          },
        });
      }
      handleCancel();
      fetchProducts();
    } catch (error) {
      console.error('Error al guardar el producto:', error);
      alert(`Error al guardar el producto: ${error.response?.data?.message || 'Error del servidor'}`);
    }
  };

  return (
    <div className={styles.container}>
      {isModalOpen && (
        <ProductForm
          onSave={handleSaveProduct}
          onCancel={handleCancel}
          initialData={editingProduct} // Pasa los datos del producto a editar
        />
      )}

      <div className={styles.header}>
        <h1>Inventario de Productos</h1>
        <button onClick={handleAddClick} className={styles.addButton}>
          + Agregar Producto
        </button>
      </div>

      <table className={styles.productTable}>
        <thead>
          <tr>
            <th>Foto</th>
            <th>Nombre</th>
            <th>Precio</th>
            <th>Descripción</th>
            <th>Stock</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product._id}>
              <td>
                <img
                  src={`http://localhost:5000/${product.foto.replace(/\\/g, '/')}`}
                  alt={product.nombre}
                  className={styles.productImage}
                />
              </td>
              <td>{product.nombre}</td>
              <td>${Number(product.precio).toFixed(2)}</td>
              <td>{product.descripcion}</td>
              <td>{product.stock}</td>
              <td>
                <button onClick={() => handleEditClick(product)} className={styles.actionButton}>
                  Editar
                </button>
                <button
                  onClick={() => handleDeleteProduct(product._id)}
                  className={`${styles.actionButton} ${styles.deleteButton}`}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductsPage;