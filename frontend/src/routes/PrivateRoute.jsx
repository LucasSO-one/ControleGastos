import { Navigate } from 'react-router-dom';

export function PrivateRoute({ children }) {
  const token = localStorage.getItem('accessToken');
  
  // Se tem token, mostra o filho (a página Dashboard).
  // Se não tem, redireciona para /login.
  return token ? children : <Navigate to="/login" />;
}