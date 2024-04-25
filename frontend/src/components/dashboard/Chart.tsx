import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register necessary components for Line chart
ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
);

interface ChartProps {
  data: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      backgroundColor: string;
      borderColor?: string;
      fill?: boolean;
    }[];
  };
}

const SalesAndOrdersChart = ({ data }: ChartProps) => {
  // Adjust dataset properties for line chart visualization
  const lineData = {
    ...data,
    datasets: data.datasets.map((dataset) => ({
      ...dataset,
      borderColor: dataset.borderColor || dataset.backgroundColor,
      backgroundColor: "rgba(0, 0, 0, 0)",
      fill: false,
    })),
  };

  // Define chart options including Y-axis starting from zero
  const options = {
    scales: {
      y: {
        beginAtZero: true, // Ensure Y-axis starts at zero
        min: 0, // Explicitly setting minimum value
        ticks: {
          precision: 0, // Avoid non-integer values on Y-axis
        },
      },
    },
  };

  return <Line data={lineData} options={options} />;
};

export default SalesAndOrdersChart;
