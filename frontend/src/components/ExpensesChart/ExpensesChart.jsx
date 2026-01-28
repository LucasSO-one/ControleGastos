import {useMemo} from 'react';
import {PieChart, Pie, Cell, ResponsiveContainer, Tooltip} from 'recharts';
import './ExpensesChart.scss';

const COLORS = [
    '#00B37E', // Verde (Ignite)
    '#F75A68', // Vermelho claro
    '#FBA94C', // Laranja
    '#8257E5', // Roxo
    '#E1E1E6', // Cinza claro
    '#00875F', // Verde escuro
    '#AB222E', // Vermelho escuro
];

export default function ExpensesChart({transactions}) {
    //useMemo para calcular os dados do gráfico apenas quando 'transactions' mudar
    const chartData = useMemo(() => {
        //filtra apenas as despesas
        const expenses = transactions.filter(t => t.type === 0);

        if (expenses.length === 0){
            return [];
        }

        const groupedData = expenses.reduce((acc, transaction) =>{
            const categoryName = transaction.category?.name || 'Outros';

            if(!acc[categoryName]){
                acc[categoryName] = 0;
            }
            acc[categoryName] += transaction.amount;
            return acc;
        }, {});

        const totalExpenses = Object.values(groupedData).reduce((a, b) => a + b, 0);

        return Object.keys(groupedData).map((key, index) => ({
            name: key,
            value: groupedData[key],
            percent: totalExpenses > 0 ? (groupedData[key]/totalExpenses * 100).toFixed(2) : 0,
            color: COLORS[index % COLORS.length]
        }));
    }, [transactions]);

    // Se não tiver dados após o processamento, não mostra o componente
    if (chartData.length === 0) {
        return null;
    }

    // Formatador para o Tooltip (quando passa o mouse)
    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
          return (
            <div className="custom-tooltip" 
            style={{ backgroundColor: '#202024', 
            padding: '10px', 
            borderRadius: '5px', 
            border: '1px solid #323238' }} >
              <p style={{ color: payload[0].payload.color }}>
                {`${payload[0].name} : ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
                .format(payload[0].value)}`}</p>
            </div>
          );
        }
        return null;
    };

  return (
    <div className='chart-container'>
        <h2>Despesas Por Categoria</h2>

        <div className="chart-content">
            {/*lado esquerdo*/ }
            <div className="pie-wrapper">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={chartData}
                            cx={"50%"}
                            cy={"50%"}
                            innerRadius={60} 
                            outerRadius={90}
                            paddingAngle={4} 
                            dataKey="value"
                            stroke="none"
                        >
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                </ResponsiveContainer>
            </div>

            <div className="legend-wrapper">
                {/*lado direito */}
                {chartData.map((item) => (
                    <div key={item.name} className="legend-item">
                        <div className="legend-info">
                            <span className='dot' style={{backgroundColor:item.color}}></span>
                            <span className='label'>{item.name}</span>
                        </div>
                        <span className="percent">
                                {item.percent ? Number(item.percent).toFixed(0) : 0}%
                        </span>
                    </div>
                ))}
            </div>
        </div>
    </div>
  );
}
