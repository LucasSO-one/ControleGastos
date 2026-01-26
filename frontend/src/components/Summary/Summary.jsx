import { ArrowCircleUpIcon, ArrowCircleDownIcon, CurrencyDollarIcon } from "@phosphor-icons/react";
import "./Summary.scss";
import {priceFormatter} from "../../utils/format";

export default function Summary({income, outcome, total}) {
  return (
    <div className="summary-container">
        <div className="summary-card">
            <header>
                <span>Entradas</span>
                <ArrowCircleUpIcon size={32} color="#00b37e"/>
            </header>
            <strong>{priceFormatter.format(income)}</strong>
        </div>

        <div className="summary-card">
            <header>
                <span>Saídas</span>
                <ArrowCircleDownIcon size={32} color="#f75a68"/>
            </header>
            <strong>{priceFormatter.format(outcome)}</strong>
        </div>

        <div className={`summary-card ${total >= 0 ? 'highlight-background' : 'highlight-red'} `}>
            <header>
                <span>Total</span>
                <CurrencyDollarIcon size={32} color="#fff"/>
            </header>
            <strong>{priceFormatter.format(total)}</strong>
        </div>

    </div>
  )
}
