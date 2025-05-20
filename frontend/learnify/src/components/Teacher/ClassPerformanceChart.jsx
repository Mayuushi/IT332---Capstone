import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export default function ClassPerformanceChart({ data }) {
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-2">Class Performance</h2>
      <BarChart width={600} height={300} data={data}>
        <XAxis dataKey="studentName" />
        <YAxis />
        <Tooltip />
        <CartesianGrid stroke="#ccc" />
        <Bar dataKey="averageScore" fill="#8884d8" />
      </BarChart>
    </div>
  );
}
