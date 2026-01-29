import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  UserIcon, 
  EnvelopeIcon, 
  LockIcon, 
  WalletIcon, 
  ArrowRightIcon, 
  EyeIcon, 
  EyeSlashIcon 
} from '@phosphor-icons/react';

import api from '../../services/api';
import './Register.scss';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Estado para controlar se mostra ou esconde a senha
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  async function handleRegister(e) {
    e.preventDefault();
    
    if(!name || !email || !password) {
        alert("Preencha todos os campos!");
        return;
    }

    setIsLoading(true);

    try {
      await api.post('https://controlegastos-bzf9.onrender.com/api/auth/register', {
        name,
        email,
        password
      });

      alert("Conta criada com sucesso!");
      navigate('/login'); 

    } catch (error) {
      console.error(error);
      alert("Erro ao cadastrar. Verifique os dados.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="register-container">
      <div className="register-content">
        
        {/* Ícone do Topo */}
        <div className="logo-icon">
            <WalletIcon size={40} weight="fill" />
        </div>

        <h1>Criar conta</h1>
        <p>Comece a controlar suas finanças hoje</p>
        
        <form onSubmit={handleRegister}>
          
          <div className="input-group">
            <UserIcon size={24} />
            <input 
                type="text" 
                placeholder="Seu nome" 
                value={name}
                onChange={e => setName(e.target.value)}
            />
          </div>

          <div className="input-group">
            <EnvelopeIcon size={24} />
            <input 
                type="email" 
                placeholder="seu@email.com" 
                value={email}
                onChange={e => setEmail(e.target.value)}
            />
          </div>
          
          {/* Input Senha */}
          <div className="input-group">
            <LockIcon size={24} />
            <input 
                // Alterna entre 'text' e 'password'
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
            {isLoading ? 'Criando...' : 'Criar conta'}
            {!isLoading && <ArrowRightIcon size={20} weight="bold" />}
          </button>
        </form>

        <Link to="/login">
          Já tem uma conta? <strong>Fazer login</strong>
        </Link>
      </div>
    </div>
  );
}