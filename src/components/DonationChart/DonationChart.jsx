import { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import './DonationChart.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function DonationChart({ bars }) {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 600);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 600);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Helper function to generate short name from full name
  // "Mohit Garg" -> "MG", "Mohit" -> "M"
  const generateShortName = (fullName) => {
    if (!fullName) return '';
    const words = fullName.trim().split(/\s+/);
    if (words.length === 1) {
      // Single word: return first letter
      return words[0].charAt(0).toUpperCase();
    } else {
      // Multiple words: return first letter of each word
      return words.map(word => word.charAt(0).toUpperCase()).join('');
    }
  };

  const labels = bars.map((bar) => generateShortName(bar.label));
  const data = bars.map((bar) => bar.currentValue);

  // Helper function to convert color (hex or rgb) to rgba
  const colorToRgba = (color, alpha = 0.85) => {
    if (!color) return `rgba(43, 122, 120, ${alpha})`; // Default color
    
    // Handle RGB format: rgb(255, 0, 0) or rgba(255, 0, 0, 0.5)
    const rgbMatch = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*[\d.]+)?\)/);
    if (rgbMatch) {
      const r = parseInt(rgbMatch[1], 10);
      const g = parseInt(rgbMatch[2], 10);
      const b = parseInt(rgbMatch[3], 10);
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }
    
    // Handle hex format: #2b7a78 or #2b7a78ff
    if (color.startsWith('#')) {
      let hex = color.slice(1);
      // Handle 3-digit hex
      if (hex.length === 3) {
        hex = hex.split('').map(char => char + char).join('');
      }
      if (hex.length === 6) {
        const r = parseInt(hex.slice(0, 2), 16);
        const g = parseInt(hex.slice(2, 4), 16);
        const b = parseInt(hex.slice(4, 6), 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
      }
    }
    
    // Fallback to default color
    return `rgba(43, 122, 120, ${alpha})`;
  };

  // Get colors for each bar, with fallback to default color
  const backgroundColors = bars.map((bar) => {
    const color = bar.color || '#2b7a78';
    return colorToRgba(color, 0.85);
  });

  const borderColors = bars.map((bar) => {
    const color = bar.color || '#2b7a78';
    return colorToRgba(color, 1);
  });

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Donations',
        data,
        backgroundColor: backgroundColors,
        borderColor: borderColors,
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 0,
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: isMobile ? 8 : 12,
        titleFont: {
          size: isMobile ? 12 : 14,
        },
        bodyFont: {
          size: isMobile ? 11 : 13,
        },
        titleAlign: 'center',
        bodyAlign: 'center',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0,
          font: {
            size: isMobile ? 10 : 12,
          },
          padding: isMobile ? 4 : 8,
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
      },
      x: {
        ticks: {
          font: {
            size: isMobile ? 10 : 12,
          },
          maxRotation: isMobile ? 45 : 0,
          minRotation: isMobile ? 45 : 0,
        },
        grid: {
          display: false,
        },
      },
    },
  };

  return (
    <div className="donation-chart">
      <Bar data={chartData} options={chartOptions} />
    </div>
  );
}

