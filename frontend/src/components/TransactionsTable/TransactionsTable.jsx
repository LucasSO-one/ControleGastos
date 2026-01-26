import "./TransactionsTable.scss"
import { PencilSimpleIcon, TrashIcon } from "@phosphor-icons/react";
import {priceFormatter, dateFormatter} from "../../utils/format";
import { useState } from "react";


export default function TransactionsTable({transactions}) {
    const [transactionToEdit, setTransactionToEdit] = useState(null);
    const [transactionToDelete, setTransactionToDelete] = useState(null);

    async function handleEditTransaction(transactionId){
        
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
                        <button title="Editar"><PencilSimpleIcon size={20} /></button>
                        <button title="Excluir"><TrashIcon size={20} /></button>
                    </td>
                </tr>
                ))}
           </tbody>
        </table>
    </div>
  )
}
