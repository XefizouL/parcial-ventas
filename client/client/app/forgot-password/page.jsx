// client/app/forgot-password/page.jsx
"use client";
import { useState } from 'react';
import axios from 'axios';
import styles from '../login/Login.module.css'; // Reutilizamos los estilos

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/forgotpassword', { email });
      setMessage('Si existe una cuenta con ese correo, se ha enviado un enlace de reseteo.');
    } catch (error) {
      setMessage('Error al enviar el correo. Inténtalo de nuevo.');
    }
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <h2>Recuperar Contraseña</h2>
        <p>Ingresa tu correo electrónico y te enviaremos un enlace para resetear tu contraseña.</p>
        <div className={styles.inputGroup}>
          <label htmlFor="email">Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        {message && <p>{message}</p>}
        <button type="submit" className={styles.button}>Enviar Enlace</button>
      </form>
    </div>
  );
};

export default ForgotPasswordPage;