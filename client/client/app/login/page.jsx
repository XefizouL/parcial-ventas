// client/app/login/page.jsx
"use client";

import { useState, useContext } from 'react';
import Link from 'next/link'; // ✅ Importamos Link para el enlace
import AuthContext from '../../context/AuthContext';
import styles from './Login.module.css'; // Archivo CSS para los estilos

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, error } = useContext(AuthContext);

  const handleSubmit = (e) => {
    e.preventDefault();
    login({ email, password });
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <h2>Iniciar Sesión</h2>

        <div className={styles.inputGroup}>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="password">Contraseña</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {error && <p className={styles.error}>{error}</p>}

        <button type="submit" className={styles.button}>Entrar</button>

        {/* ✅ Enlace para recuperación de contraseña */}
        <div className={styles.forgotPasswordLink}>
          <Link href="/forgot-password">¿Olvidaste tu contraseña?</Link>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
