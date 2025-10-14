// client/app/reset-password/[token]/page.jsx
"use client";
import { useState } from 'react';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';
import styles from '../../login/Login.module.css';

const ResetPasswordPage = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter();
  const params = useParams(); // Hook para obtener los parámetros de la URL
  const { token } = params;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return setMessage('Las contraseñas no coinciden.');
    }
    try {
      await axios.put(`http://localhost:5000/api/auth/resetpassword/${token}`, { password });
      setMessage('¡Contraseña actualizada con éxito! Redirigiendo al login...');
      setTimeout(() => router.push('/login'), 2000);
    } catch (error) {
      setMessage(error.response?.data?.message || 'El token es inválido o ha expirado.');
    }
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <h2>Establecer Nueva Contraseña</h2>
        <div className={styles.inputGroup}>
          <label htmlFor="password">Nueva Contraseña</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="confirmPassword">Confirmar Contraseña</label>
          <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
        </div>
        {message && <p>{message}</p>}
        <button type="submit" className={styles.button}>Actualizar Contraseña</button>
      </form>
    </div>
  );
};

export default ResetPasswordPage;