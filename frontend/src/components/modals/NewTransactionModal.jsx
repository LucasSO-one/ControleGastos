import { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { 
    XIcon, 
    ArrowCircleUpIcon, 
    ArrowCircleDownIcon,
    ShoppingCartIcon,
    GameControllerIcon,
    CarIcon,
    ForkKnifeIcon,
    HeartIcon,
    HouseIcon,
    BankIcon,           
    BriefcaseIcon,      
    ArrowsLeftRightIcon,
    TagIcon, // Ícone genérico caso falte algum
    Bank
} from '@phosphor-icons/react'; 

import api from '../../services/api'; 
import './NewTransactionModal.scss'; 

Modal.setAppElement('#root');

// Definimos apenas os DADOS das categorias padrão (sem IDs fixos)
const DEFAULT_CATEGORIES = [
    { name: 'Mercado', iconKey: 'ShoppingCart' },
    { name: 'Lazer', iconKey: 'GameController' },
    { name: 'Transporte', iconKey: 'Car' },
    { name: 'Alimentação', iconKey: 'ForkKnife' },
    { name: 'Saúde', iconKey: 'Heart' },
    { name: 'Moradia', iconKey: 'House' },
    {name: 'Salário', iconKey: 'Bank'},
    {name: 'Trabalho', iconKey: 'Briefcase'},
    {name: 'Transferência', iconKey: 'ArrowsLeftRight'},
];

// Mapa para ligar o nome (string) ao Ícone (Componente React)
const ICON_MAP = {
    ShoppingCart: ShoppingCartIcon,
    GameController: GameControllerIcon,
    Car: CarIcon,
    ForkKnife: ForkKnifeIcon,
    Heart: HeartIcon,
    House: HouseIcon,
    Bank: BankIcon,
    Briefcase: BriefcaseIcon,
    ArrowsLeftRight: ArrowsLeftRightIcon,
};

export function NewTransactionModal({ isOpen, onRequestClose }) {
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]); 
    const [type, setType] = useState('outcome');
    
    // Estado para guardar as categorias que vêm do BANCO
    const [dbCategories, setDbCategories] = useState([]);
    const [selectedCategoryId, setSelectedCategoryId] = useState(null);
    const [isLoadingCategories, setIsLoadingCategories] = useState(false);

    // 2. Efeito Inteligente: Busca ou Cria Categorias ao carregar o modal
    useEffect(() => {
        // Só roda se o modal estiver aberto (para economizar requisição)
        if (isOpen) {
            fetchAndEnsureCategories();
        }
    }, [isOpen]);

    async function fetchAndEnsureCategories() {
        setIsLoadingCategories(true);
        try {
            // A. Tenta buscar as categorias existentes
            const response = await api.get('/categories');
            let categoriesFromApi = response.data;

            // B. Se a lista estiver vazia, cria as padrões automaticamente
            if (categoriesFromApi.length === 0) {
                
                // Cria todas em paralelo
                await Promise.all(DEFAULT_CATEGORIES.map(async (cat) => {
                    await api.post('/categories', {
                        name: cat.name,
                        icon: cat.iconKey // Manda o nome do ícone pro backend salvar
                    });
                }));

                // Busca de novo agora que foram criadas
                const secondResponse = await api.get('/categories');
                categoriesFromApi = secondResponse.data;
            }

            // C. Salva no estado para usar na tela
            setDbCategories(categoriesFromApi);

        } catch (error) {
            console.error("Erro ao gerenciar categorias:", error);
        } finally {
            setIsLoadingCategories(false);
        }
    }

    async function handleCreateNewTransaction(event) {
        event.preventDefault();

        if(!description || !amount || !selectedCategoryId) {
            alert("Preencha todos os campos e selecione uma categoria!");
            return;
        }

        const data = {
            description,
            amount: Number(amount),
            categoryId: selectedCategoryId, // Usa o ID real do banco
            type: type === 'income' ? 1 : 0,
            date: new Date(date), 
        };

        try {
            await api.post('/transactions', data);
            
            setDescription('');
            setAmount('');
            setSelectedCategoryId(null);
            setType('outcome');
            setDate(new Date().toISOString().split('T')[0]);
            
            onRequestClose();
            window.location.reload(); 

        } catch (error) {
            console.error(error);
            alert("Erro ao cadastrar transação.");
        }
    }

    // Função auxiliar para renderizar o ícone certo
    function renderIcon(iconName) {
        // Tenta achar no mapa, se não achar usa um genérico
        const IconComponent = ICON_MAP[iconName] || ICON_MAP[Object.keys(ICON_MAP).find(k => k === iconName)] || TagIcon;
        return <IconComponent size={24} />;
    }

    return (
        <Modal 
            isOpen={isOpen} 
            onRequestClose={onRequestClose}
            overlayClassName="react-modal-overlay"
            className="react-modal-content"
        >
            <button type="button" onClick={onRequestClose} className="react-modal-close">
                <XIcon size={24} />
            </button>

            <form onSubmit={handleCreateNewTransaction}>
                <h2>Nova Transação</h2>

                <div className="transaction-type-container">
                    <button
                        type="button"
                        className={`radio-box ${type === 'outcome' ? 'active-red' : ''}`}
                        onClick={() => setType('outcome')}
                    >
                        <ArrowCircleDownIcon size={24} color={type === 'outcome' ? '#f75a68' : '#d1d5db'} />
                        <span>Despesa</span>
                    </button>
                    
                    <button
                        type="button"
                        className={`radio-box ${type === 'income' ? 'active-green' : ''}`}
                        onClick={() => setType('income')}
                    >
                        <ArrowCircleUpIcon size={24} color={type === 'income' ? '#00b37e' : '#d1d5db'} />
                        <span>Receita</span>
                    </button>
                </div>

                <label>Descrição</label>
                <input 
                    placeholder="Ex: Supermercado" 
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                />
                
                <label>Valor</label>
                <input 
                    type="number" 
                    placeholder="0,00" 
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                />

                <label>Data</label>
                <input 
                    type="date"
                    value={date}
                    onChange={e => setDate(e.target.value)}
                    style={{ colorScheme: 'dark' }} 
                />

                <label>Categoria</label>
                <div className="category-grid">
                    {isLoadingCategories ? (
                        <p style={{color: '#fff'}}>Carregando categorias...</p>
                    ) : (
                        dbCategories.map(cat => (
                            <button
                                key={cat.id} // ID REAL DO BANCO
                                type="button"
                                className={`category-box ${selectedCategoryId === cat.id ? 'selected' : ''}`}
                                onClick={() => setSelectedCategoryId(cat.id)}
                            >
                                {/* O backend precisa retornar "icon" ou "name" para gente saber qual ícone usar */}
                                {renderIcon(cat.icon || cat.name)} 
                                <span>{cat.name}</span>
                            </button>
                        ))
                    )}
                </div>

                <button type="submit" className="submit-btn">Adicionar</button>
            </form>
        </Modal>
    );
}