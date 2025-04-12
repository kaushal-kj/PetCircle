import { Bar, Doughnut } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
Chart.register(...registerables);

const AdminOverview = () => {
  const barData = {
    labels: ["Users", "Experts", "Posts", "Pets", "Adoptions", "Communities"],
    datasets: [
      {
        label: "Count",
        data: [120, 35, 340, 200, 45, 20],
        backgroundColor: "rgba(59, 130, 246, 0.6)",
      },
    ],
  };

  const pieData = {
    labels: ["Male", "Female", "Other"],
    datasets: [
      {
        label: "Gender Distribution",
        data: [60, 80, 10],
        backgroundColor: ["#3b82f6", "#ef4444", "#10b981"],
      },
    ],
  };

  return (
    <div className="p-6 w-full">
      <h1 className="text-2xl font-bold mb-4">Overview</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded shadow p-4">
          <h2 className="text-lg font-semibold mb-2">Entity Counts</h2>
          <Bar data={barData} />
        </div>
        <div className="bg-white rounded shadow p-4">
          <h2 className="text-lg font-semibold mb-2">User Gender Split</h2>
          <Doughnut data={pieData} />
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;
