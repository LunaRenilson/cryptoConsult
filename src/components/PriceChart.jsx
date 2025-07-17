import { useEffect, useRef } from 'react';
import axios from 'axios';
import { Chart } from 'chart.js/auto'; // Importa tudo automaticamente

export default function PriceChart({ coinId, style }) {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=30`
        );

        const prices = response.data.prices;
        const labels = prices.map(([timestamp]) => 
          new Date(timestamp).toLocaleDateString('pt-BR') 
        );
        const data = prices.map(([, price]) => price);

        // Destrói o gráfico anterior se existir
        if (chartInstance.current) {
          chartInstance.current.destroy();
        }

        const ctx = chartRef.current.getContext('2d');

        chartInstance.current = new Chart(ctx, {
          type: 'line',
          data: {
            labels,
            datasets: [{
              label: `Preço (USD)`,
              data,
              borderColor: '#6a11cb',
              backgroundColor: 'rgba(106, 17, 203, 0.1)',
              borderWidth: 2,
              pointRadius: 0, // Remove os pontos para visualização mais limpa
              tension: 0.4,
              fill: true,
            }]
          },
          options: {
            responsive: true,
            plugins: {
              tooltip: {
                mode: 'index',
                intersect: false,
                callbacks: {
                  label: (context) => 
                    `$${context.parsed.y.toFixed(2)}`
                }
              },
              legend: {
                display: false
              }
            },
            scales: {
              x: {
                grid: {
                  display: false
                }
              },
              y: {
                ticks: {
                  callback: (value) => `$${value}`
                }
              }
            },
            interaction: {
              mode: 'nearest',
              axis: 'x'
            }
          }
        });

      } catch (error) {
        console.error('Erro ao buscar dados:', error);
      }
    };

    fetchData();

    // Limpeza ao desmontar
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [coinId]);

  return (
    <div className={`chart-container bg-gray-200 p-5 rounded-lg ${style}`}>
      <canvas ref={chartRef} />
    </div>
  );
}