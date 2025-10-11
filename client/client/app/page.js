// client/app/page.js
import { redirect } from 'next/navigation';

export default function HomePage() {
  // Redirige permanentemente del lado del servidor a la página de login.
  redirect('/login');
}