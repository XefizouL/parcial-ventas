// client/context/AuthContext.js
"use client"; // Directiva necesaria en Next.js App Router para componentes de cliente

import { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const router = useRouter();

  // Comprobar si el usuario ya está logueado al cargar la app
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Función de Login
  const login = async ({ email, password }) => {
    try {
     const res = await axios.post('http://localhost:5000/api/auth/login', { 
      email,
      password,
    });


      if (res.data) {
        setUser(res.data);
        localStorage.setItem('user', JSON.stringify(res.data));
        setError(null);
        router.push('/products'); // Redirigir a la página de productos
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Algo salió mal');
    }
  };

  // Función de Logout
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, error, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;