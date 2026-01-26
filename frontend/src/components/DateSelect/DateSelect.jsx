import { addMonths, subMonths, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CaretLeftIcon, CaretRightIcon, CalendarBlankIcon } from '@phosphor-icons/react';
import './DateSelect.scss';

// Agora recebemos props do pai
export default function DateSelect({ currentDate, onDateChange }) {

  function handlePrevMonth() {
    // Avisa o pai para mudar a data
    onDateChange(subMonths(currentDate, 1)); 
  }

  function handleNextMonth() {
    onDateChange(addMonths(currentDate, 1));
  }

  const formattedDate = format(currentDate, "MMMM yyyy", { locale: ptBR });

  return (
    <div className="date-select-container">
      <button onClick={handlePrevMonth} className="icon-btn">
        <CaretLeftIcon size={24} />
      </button>

      <span className="date-display">
        <CalendarBlankIcon size={20} className="calendar-icon" />
        {formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1)}
      </span>

      <button onClick={handleNextMonth} className="icon-btn">
        <CaretRightIcon size={24} />
      </button>
    </div>
  );
}