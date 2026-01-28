import api from "../../services/api"
import "./Dashboard.scss";

import { useState, useEffect, useMemo } from 'react';
import { format } from 'date-fns';

import { PlusIcon } from "@phosphor-icons/react";

import { NewTransactionModal } from "../../components/modals/NewTransactionModal";


import Header from '../../components/Header/Header';
import Summary from '../../components/Summary/Summary';
import TransactionsTable from '../../components/TransactionsTable/TransactionsTable';
import DateSelect from '../../components/DateSelect/DateSelect';
import ExpensesChart from "../../components/ExpensesChart/ExpensesChart";

export default function Dashboard() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [isNewTransactionModalOpen, setIsNewTransactionModalOpen] = useState(false);
  const [transactionToEdit, setTransactionToEdit] = useState(null);

  function handleOpenNewTransactionModal() {
    setTransactionToEdit(null);
    setIsNewTransactionModalOpen(true);
  }
  
  function handleOpenEditTransactionModal(transaction){
    setTransactionToEdit(transaction);
    setIsNewTransactionModalOpen(true);
  }
  
  function handleCloseNewTransactionModal() {
    setIsNewTransactionModalOpen(false);
    setTransactionToEdit(null);
  }
  useEffect(() => {
    async function fetchTransactions(){
      setIsLoading(true);
      try{
        const month = currentDate.getMonth() + 1;
        const year = currentDate.getFullYear();

        const response = await api.get(`/transactions?month=${month}&year=${year}`);
        setTransactions(response.data);
      }catch(error){
        console.error("Erro ao buscar transações: ", error);
      }finally{
        setIsLoading(false);
      }
    }
    fetchTransactions();
  }, [currentDate]);

  const summary = useMemo(() => {
    return transactions.reduce(
      (acc, transaction) => {
        // 1. Garante que o amount é tratado como número
        const amount = Number(transaction.amount);

        // 2. Lógica baseada no seu JSON (type: 0 é Saída, type: 1 é Entrada)
        if (transaction.type === 1) { 
          acc.income += amount;
          acc.total += amount;
        } else { 
          acc.outcome += amount;
          acc.total -= amount;
        }
        
        return acc;
      },
      { income: 0, outcome: 0, total: 0 }
    );
  }, [transactions]);

  return (
    <div>
        <Header />
        <div style={{ maxWidth: '1120px', margin: '0 auto', padding: '0 1.5rem', marginTop: '-2rem', position: 'relative', zIndex: 2 }}>
          <DateSelect 
          currentDate={currentDate}
          onDateChange={setCurrentDate}
          />
        </div>
        <Summary 
        income={summary.income}
        outcome={summary.outcome}
        total={summary.total}
        />
        {transactions.length > 0 && (
          <ExpensesChart transactions={transactions} />
        )}

        <TransactionsTable transactions={transactions} 
        onEdit={handleOpenEditTransactionModal}
        />

        <button 
        className="floating-button" 
        onClick={handleOpenNewTransactionModal}
        //title="Nova Transação"
      >
        <PlusIcon size={24} weight="bold" />
      </button>

      <NewTransactionModal 
        isOpen={isNewTransactionModalOpen}
        onRequestClose={handleCloseNewTransactionModal}
        transactionToEdit={transactionToEdit}
      />
    </div>
  )
}
