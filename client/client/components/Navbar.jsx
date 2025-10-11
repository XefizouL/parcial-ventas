"use client";

import { useContext } from 'react';
import Link from 'next/link';
import AuthContext from '../context/AuthContext';
import axios from 'axios';
import styles from './Navbar.module.css';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  const handleGenerateReport = async () => {
    if (!user || !user.token) {
      alert("Debes iniciar sesión para generar el reporte.");
      return;
    }

    try {
      const res = await axios.get('http://localhost:5000/api/reports/inventory', {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
        responseType: 'blob', // Espera un archivo binario (PDF)
      });

      // Crear blob PDF con tipo explícito
      const file = new Blob([res.data], { type: 'application/pdf' });

      // Crear una URL temporal para visualizar el archivo
      const fileURL = window.URL.createObjectURL(file);

      // Abrir la URL en una nueva pestaña
      window.open(fileURL, '_blank');

    } catch (error) {
      console.error('Error al generar el reporte:', error);
      alert('No se pudo generar el reporte. Verifica tu conexión o sesión.');
    }
  };

  return (
    <nav className={styles.navbar}>
      <Link href="/" className={styles.brand}>
        Sistema de Ventas
      </Link>
      <ul className={styles.navList}>
        {user ? (
          <>
            <li><Link href="/products">Productos</Link></li>
            <li>
              <button onClick={handleGenerateReport} className={styles.navButton}>
                Generar Reporte
              </button>
            </li>
            <li>
              <button onClick={logout} className={styles.logoutButton}>
                Salir
              </button>
            </li>
          </>
        ) : (
          <li><Link href="/login">Iniciar Sesión</Link></li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
