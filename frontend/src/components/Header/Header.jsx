import { useNavigate } from 'react-router-dom';
import { SignOutIcon } from '@phosphor-icons/react';
import "./Header.scss";

export default function Header() {

    const navigate = useNavigate();

    const userName = localStorage.getItem("userName") || "Visitante";

    const handleLogout = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("userName");
        navigate("/login");
    }
  return (
    <div className='header-container'>
        <div className="header-content">
            <div className="user-info">
                <span>Olá,</span>
                <strong>{userName}</strong>
            </div>

        <div className="actions">

            <button type='button' onClick={handleLogout} title='Sair'>
                <SignOutIcon size={24}/>
            </button>
        </div>

        </div>
    </div>
  );
}
