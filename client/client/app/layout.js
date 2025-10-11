// client/app/layout.js
import { AuthProvider } from '../context/AuthContext';
import Navbar from '../components/Navbar'; // Importar Navbar
import './globals.css';

export const metadata = {
  title: 'Sistema de Ventas',
  description: 'Aplicación de gestión de inventario y ventas',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <Navbar /> {/* Añadir el Navbar aquí */}
          <main>{children}</main> {/* Buena práctica envolver el contenido en un main */}
        </AuthProvider>
      </body>
    </html>
  );
}
