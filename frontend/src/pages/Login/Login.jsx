import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  EnvelopeIcon, 
  LockIcon, 
  WalletIcon, 
  SignInIcon, 
  EyeIcon, 
  EyeSlashIcon 
} from '@phosphor-icons/react';

import api from '../../services/api';
import './Login.scss';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();

    if (!email || !password) {
      alert("Preencha todos os campos!");
      return;
    }

    setIsLoading(true);

    try {
      const response = await api.post('https://controlegastos-bzf9.onrender.com/api/auth/login', { email, password });

      const { token, name } = response.data;
      
      localStorage.setItem('accessToken', token);
      localStorage.setItem('userName', name || 'Usuário');

      navigate('/');
      
    } catch (error) {
      console.error(error);
      alert("Falha no login. Verifique seu e-mail e senha.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="login-container">
      <div className="login-content">
        
        <div className="logo-icon">
            <WalletIcon size={40} weight="fill" />
        </div>

        <h1>Acesse sua conta</h1>
        <p>Faça login para continuar</p>
        
        <form onSubmit={handleLogin}>
          
          <div className="input-group">
            <EnvelopeIcon size={24} />
            <input 
                type="email" 
                placeholder="seu@email.com" 
                value={email}
                onChange={e => setEmail(e.target.value)}
            />
          </div>
          
          <div className="input-group">
            <LockIcon size={24} />
            <input 
                type={showPassword ? "text" : "password"} 
                placeholder="Senha" 
                value={password}
                onChange={e => setPassword(e.target.value)}
            />
            <button 
                type="button" 
                className="eye-button"
                onClick={() => setShowPassword(!showPassword)}
            >
                {showPassword ? <EyeIcon size={24} /> : <EyeSlashIcon size={24} />}
            </button>
          </div>

          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Entrando...' : 'Entrar'}
            {!isLoading && <SignInIcon size={24} weight="bold" />}
          </button>
        </form>

        <Link to="/register">
          Não tem uma conta? <strong>Registre-se</strong>
        </Link>
      </div>
    </div>
  );
}