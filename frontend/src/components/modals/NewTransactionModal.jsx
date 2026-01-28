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
    GraduationCapIcon,           
    BriefcaseIcon,      
    ArrowsLeftRightIcon,
    TagIcon,  // Ícone genérico caso falte algum
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
    {name: 'Educação', iconKey: 'GraduationCap'},
    {name: 'Outros', iconKey: 'Tag'},
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
    GraduationCap: GraduationCapIcon,
    Tag: TagIcon,
};

export function NewTransactionModal({ isOpen, onRequestClose, transactionToEdit }) {
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

    useEffect(() => {
        if (transactionToEdit && dbCategories.length > 0) {
            // Preenche os campos
            setDescription(transactionToEdit.description);
            setAmount(transactionToEdit.amount);
            // Formata a data para o input (YYYY-MM-DD)
            setDate(new Date(transactionToEdit.date).toISOString().split('T')[0]);
            setType(transactionToEdit.type === 1 ? 'income' : 'outcome');

            // Tenta encontrar o ID da categoria pelo nome (já que a tabela costuma mostrar o nome)
            // Se o seu objeto transactionToEdit vier com 'categoryId', melhor ainda.
            const foundCategory = dbCategories.find(
                cat => cat.name === transactionToEdit.category || cat.id === transactionToEdit.categoryId
            );
            
            if (foundCategory) {
                setSelectedCategoryId(foundCategory.id);
            }
        } else if (!transactionToEdit) {
            // Se não for edição, limpa tudo (Modo Criação)
            cleanFields();
        }
    }, [transactionToEdit, isOpen, dbCategories]);

    function cleanFields() {
        setDescription('');
        setAmount('');
        setSelectedCategoryId(null);
        setType('outcome');
        setDate(new Date().toISOString().split('T')[0]);
    }

    async function fetchAndEnsureCategories() {
        setIsLoadingCategories(true);
        try {
            const response = await api.get('/categories');
            let categoriesFromApi = response.data;

            const existingNames = categoriesFromApi.map(cat => cat.name);

            const missingCategories = DEFAULT_CATEGORIES.filter(
                defCat => !existingNames.includes(defCat.name)
            );

            if (missingCategories.length > 0) {
                await Promise.all(missingCategories.map(async (cat) => {
                    await api.post('/categories', {
                        name: cat.name,
                        icon: cat.iconKey
                    });
                }));

                const secondResponse = await api.get('/categories');
                categoriesFromApi = secondResponse.data;
            }

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
            categoryId: selectedCategoryId, 
            type: type === 'income' ? 1 : 0,
            date: new Date(date), 
        };

        try {
            if (transactionToEdit) {
                data.id = transactionToEdit.id; 
                await api.put(`/transactions/${transactionToEdit.id}`, data);
                alert("Transação atualizada!");
            } else {
                await api.post('/transactions', data);
                alert("Transação criada!");
            }

            cleanFields();
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
                <h2>{transactionToEdit ? 'Editar Transação' : 'Nova Transação'}</h2>

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
                        <p style={{color: '#fff'}}>Carregando...</p>
                    ) : (
                        dbCategories.map(cat => (
                            <button
                                key={cat.id} 
                                type="button"
                                className={`category-box ${selectedCategoryId === cat.id ? 'selected' : ''}`}
                                onClick={() => setSelectedCategoryId(cat.id)}
                            >
                                {renderIcon(cat.icon || cat.name)} 
                                <span>{cat.name}</span>
                            </button>
                        ))
                    )}
                </div>

                <button type="submit" className="submit-btn">
                    {transactionToEdit ? 'Salvar Alterações' : 'Adicionar'}
                </button>
            </form>
        </Modal>
    );
}