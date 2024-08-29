import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

interface DoughnutChartProps {
  data: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      backgroundColor: string[];
    }[];
  };
  options?: any; // Define a more specific type if needed
}

const DoughnutChart: React.FC<DoughnutChartProps> = ({ data, options }) => {
  return <Doughnut data={data} options={options} />;
};

export default DoughnutChart;
