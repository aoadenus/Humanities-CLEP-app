"use client";

import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import { Bar, Line } from "react-chartjs-2";

import { Card } from "@/components/editorial/Card";
import type { EditorialDiagramDefinition } from "@/lib/types";

ChartJS.register(
  ArcElement,
  BarElement,
  CategoryScale,
  Filler,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
);

export function ChartDiagram({
  diagram,
}: {
  diagram: EditorialDiagramDefinition;
}) {
  const color = diagram.accentColor ?? "#5B4A3F";
  const data = {
    labels: diagram.labels,
    datasets: [
      {
        label: diagram.valueLabel ?? diagram.title,
        data: diagram.values,
        borderColor: color,
        backgroundColor: diagram.type === "bar" ? `${color}CC` : `${color}33`,
        pointBackgroundColor: color,
        fill: diagram.type !== "bar",
        tension: 0.35,
        borderRadius: 10,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "#2C2420",
      },
    },
    scales: {
      x: {
        grid: {
          color: "rgba(229,221,211,0.45)",
        },
        ticks: {
          color: "#6B5E54",
          font: {
            family: "var(--font-sans)",
          },
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(229,221,211,0.45)",
        },
        ticks: {
          color: "#6B5E54",
          stepSize: 1,
          font: {
            family: "var(--font-sans)",
          },
        },
      },
    },
  };

  return (
    <Card className="p-5">
      <div className="mb-2 text-lg font-bold text-[var(--text-primary)]">{diagram.title}</div>
      {diagram.description ? (
        <p className="mb-4 text-sm leading-6 text-[var(--text-secondary)]">{diagram.description}</p>
      ) : null}
      <div className="h-[280px]">
        {diagram.type === "bar" ? <Bar data={data} options={options} /> : <Line data={data} options={options} />}
      </div>
    </Card>
  );
}
