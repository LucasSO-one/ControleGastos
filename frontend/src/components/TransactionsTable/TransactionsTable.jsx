import "./TransactionsTable.scss"
import { PencilSimpleIcon, TrashIcon } from "@phosphor-icons/react";
import {priceFormatter, dateFormatter} from "../../utils/format";
import api from "../../services/api";


export default function TransactionsTable({transactions, onEdit}) {

    async function handleDeleteTransaction(transactionId){
        const confirmDelete = window.confirm("Tem certeza que deseja excluir esta transação?");
        
        if (!confirmDelete) {
            return;
        }

        try{
            // Lógica para editar a transação
            await api.delete(`/transactions/${transactionId}`);
            window.location.reload();
        } catch(error){
            console.error("Erro ao editar a transação:", error);
            alert("Erro ao excluir transação.");
        }
    }

  return (
    <div className="transactions-container">
        <div className="transactions-header">
            <h2>Últimos Transações</h2>
        </div>

        <table className="transactions-table">
            <tbody>
                {transactions.map(transaction => (
                <tr key={transaction.id}>
                    <td width="40%">{transaction.description}</td>
                    <td>
                        <span className={`price ${transaction.type === 1 ? 'highlight-green' : 'highlight-red'}`}>
                            {/* Se for despesa (0), coloca o sinal de menos visualmente */}
                            {transaction.type === 0 && '- '}
                            {priceFormatter.format(transaction.amount)}
                        </span>
                    </td>
                    <td>{transaction.category?.name}</td>
                    <td>{dateFormatter.format(new Date(transaction.date))}</td>
                    <td className="actions">
                        <button title="Editar" onClick={() => onEdit(transaction)}><PencilSimpleIcon size={20} /></button>
                        <button title="Excluir" onClick={() => handleDeleteTransaction(transaction.id)}><TrashIcon size={20} /></button>
                    </td>
                </tr>
                ))}
           </tbody>
        </table>
    </div>
  )
}
