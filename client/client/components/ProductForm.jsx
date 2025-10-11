// client/components/ProductForm.jsx (Versión Actualizada)
"use client";

import { useState, useEffect } from 'react'; // Importar useEffect
import styles from './ProductForm.module.css';

// El componente ahora acepta una nueva prop: initialData
const ProductForm = ({ onSave, onCancel, initialData }) => {
  // Inicializamos el estado con los datos iniciales si existen, o con valores vacíos si no
  const [nombre, setNombre] = useState('');
  const [precio, setPrecio] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [stock, setStock] = useState('');
  const [foto, setFoto] = useState(null);

  // useEffect se ejecutará cuando initialData cambie
  useEffect(() => {
    if (initialData) {
      setNombre(initialData.nombre || '');
      setPrecio(initialData.precio || '');
      setDescripcion(initialData.descripcion || '');
      setStock(initialData.stock || '');
      // No precargamos la foto, el usuario debe seleccionar una nueva si quiere cambiarla
    }
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('nombre', nombre);
    formData.append('precio', precio);
    formData.append('descripcion', descripcion);
    formData.append('stock', stock);
    
    // Solo añadimos la foto al FormData si el usuario ha seleccionado una nueva
    if (foto) {
      formData.append('foto', foto);
    }
    
    // La lógica de si es crear o editar se manejará en la página principal
    onSave(formData);
  };

  return (
    <div className={styles.modalBackdrop}>
      <div className={styles.modalContent}>
        {/* Título dinámico */}
        <h2>{initialData ? 'Editar Producto' : 'Agregar Nuevo Producto'}</h2>
        <form onSubmit={handleSubmit}>
          {/* ... (los inputs siguen igual) ... */}
          <input type="text" placeholder="Nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
          <input type="number" placeholder="Precio" value={precio} onChange={(e) => setPrecio(e.target.value)} required />
          <textarea placeholder="Descripción" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} required />
          <input type="number" placeholder="Stock" value={stock} onChange={(e) => setStock(e.target.value)} required />
          <label>Foto del Producto (opcional si editas)</label>
          <input type="file" onChange={(e) => setFoto(e.target.files[0])} />
          <div className={styles.buttonGroup}>
            <button type="button" onClick={onCancel} className={styles.cancelButton}>Cancelar</button>
            <button type="submit" className={styles.saveButton}>Guardar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;