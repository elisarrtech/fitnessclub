// frontend/src/components/admin/charts/DashboardCharts.jsx
import React, { useEffect, useRef } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  DoughnutController
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  DoughnutController
);

const DashboardCharts = ({ data }) => {
  const barChartRef = useRef(null);
  const doughnutChartRef = useRef(null);
  const lineChartRef = useRef(null);
  const barChartInstance = useRef(null);
  const doughnutChartInstance = useRef(null);
  const lineChartInstance = useRef(null);

  useEffect(() => {
    if (data && data.bookingsByDay) {
      createBarChart();
      createDoughnutChart();
      createLineChart();
    }

    return () => {
      if (barChartInstance.current) barChartInstance.current.destroy();
      if (doughnutChartInstance.current) doughnutChartInstance.current.destroy();
      if (lineChartInstance.current) lineChartInstance.current.destroy();
    };
  }, [data]);

  const createBarChart = () => {
    if (barChartInstance.current) barChartInstance.current.destroy();

    const ctx = barChartRef.current.getContext('2d');
    barChartInstance.current = new ChartJS(ctx, {
      type: 'bar',
      data: {
        labels: data.bookingsByDay.map(item => item.day),
        datasets: [{
          label: 'Reservas por Día',
          data: data.bookingsByDay.map(item => item.count),
          backgroundColor: 'rgba(59, 130, 246, 0.5)',
          borderColor: 'rgba(59, 130, 246, 1)',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Reservas por Día'
          }
        }
      }
    });
  };

  const createDoughnutChart = () => {
    if (doughnutChartInstance.current) doughnutChartInstance.current.destroy();

    const ctx = doughnutChartRef.current.getContext('2d');
    doughnutChartInstance.current = new ChartJS(ctx, {
      type: 'doughnut',
      data: {
        labels: data.classesPopularity.map(item => item.className),
        datasets: [{
          data: data.classesPopularity.map(item => item.bookings),
          backgroundColor: [
            'rgba(255, 99, 132, 0.5)',
            'rgba(54, 162, 235, 0.5)',
            'rgba(255, 205, 86, 0.5)',
            'rgba(75, 192, 192, 0.5)',
            'rgba(153, 102, 255, 0.5)',
            'rgba(255, 159, 64, 0.5)'
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 205, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Popularidad de Clases'
          }
        }
      }
    });
  };

  const createLineChart = () => {
    if (lineChartInstance.current) lineChartInstance.current.destroy();

    const ctx = lineChartRef.current.getContext('2d');
    lineChartInstance.current = new ChartJS(ctx, {
      type: 'line',
      data: {
        labels: data.revenueByMonth.map(item => item.month),
        datasets: [{
          label: 'Ingresos Mensuales',
          data: data.revenueByMonth.map(item => item.revenue),
          borderColor: 'rgba(75, 192, 192, 1)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          tension: 0.1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Ingresos Mensuales'
          }
        },
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <canvas ref={barChartRef} />
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <canvas ref={doughnutChartRef} />
      </div>
      
      <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
        <canvas ref={lineChartRef} />
      </div>
    </div>
  );
};

export default DashboardCharts;
