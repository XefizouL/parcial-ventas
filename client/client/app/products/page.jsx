"use client";

import { useState, useEffect, useContext } from "react";
import axios from "axios";
import AuthContext from "../../context/AuthContext";
import ProductForm from "../../components/ProductForm";
import styles from "./Products.module.css";

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const { user } = useContext(AuthContext);

  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/products");
      setProducts(res.data);
    } catch (error) {
      console.error("Error al obtener los productos:", error);
    }
  };

  useEffect(() => {
    if (!user) return;
    fetchProducts();
  }, [user]);

  const handleDeleteProduct = async (id) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar este producto?")) {
      try {
        await axios.delete(`http://localhost:5000/api/products/${id}`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        fetchProducts();
      } catch (error) {
        console.error("Error al eliminar el producto:", error);
      }
    }
  };

  const handleEditClick = (product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleAddClick = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const handleSaveProduct = async (formData) => {
    const nombre = formData.get("nombre")?.trim();
    const descripcion = formData.get("descripcion")?.trim();
    const precio = formData.get("precio");
    const stock = formData.get("stock");
    const foto = formData.get("foto");

    if (!nombre) return alert("El campo 'Nombre' es obligatorio.");
    if (!descripcion) return alert("El campo 'Descripción' es obligatorio.");
    if (!precio || isNaN(precio) || Number(precio) <= 0)
      return alert("El 'Precio' debe ser un número positivo.");
    if (
      stock === null ||
      stock === "" ||
      isNaN(stock) ||
      !Number.isInteger(Number(stock)) ||
      Number(stock) < 0
    )
      return alert("El 'Stock' debe ser un número entero igual o mayor a cero.");
    if (!editingProduct && (!foto || foto.size === 0))
      return alert("Debe seleccionar una imagen para el producto.");

    try {
      if (editingProduct) {
        await axios.put(
          `http://localhost:5000/api/products/${editingProduct._id}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${user.token}`,
            },
          }
        );
      } else {
        await axios.post("http://localhost:5000/api/products", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${user.token}`,
          },
        });
      }
      handleCancel();
      fetchProducts();
    } catch (error) {
      console.error("Error al guardar el producto:", error);
      alert(
        `Error al guardar el producto: ${
          error.response?.data?.message || "Error del servidor"
        }`
      );
    }
  };

  // 🔸 NUEVA FUNCIÓN DE SINCRONIZACIÓN 🔸
  const handleSync = async () => {
    if (
      window.confirm(
        "¿Estás seguro de que quieres sincronizar la base de datos de Atlas a la local? Esto borrará los datos locales actuales."
      )
    ) {
      try {
        const res = await axios.post(
          "http://localhost:5000/api/sync/atlas-to-local",
          {},
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );
        alert(res.data.message);
        fetchProducts(); // 🔸 Refresca la lista después de sincronizar
      } catch (error) {
        console.error("Error al sincronizar:", error);
        alert("Falló la sincronización. Revisa la consola.");
      }
    }
  };

  return (
    <div className={styles.container}>
      {isModalOpen && (
        <ProductForm
          onSave={handleSaveProduct}
          onCancel={handleCancel}
          initialData={editingProduct}
        />
      )}

      <div className={styles.header}>
        <h1>Inventario de Productos</h1>
        <div className={styles.buttonGroup}>
          <button onClick={handleSync} className={styles.syncButton}>
            Sincronizar a Local
          </button>
          <button onClick={handleAddClick} className={styles.addButton}>
            + Agregar Producto
          </button>
        </div>
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
                  src={`http://localhost:5000/${product.foto.replace(/\\/g, "/")}`}
                  alt={product.nombre}
                  className={styles.productImage}
                />
              </td>
              <td>{product.nombre}</td>
              <td>${Number(product.precio).toFixed(2)}</td>
              <td>{product.descripcion}</td>
              <td>{product.stock}</td>
              <td>
                <button
                  onClick={() => handleEditClick(product)}
                  className={styles.actionButton}
                >
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
