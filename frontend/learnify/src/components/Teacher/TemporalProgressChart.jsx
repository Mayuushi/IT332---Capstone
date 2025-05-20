import { AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export default function TemporalProgressChart({ data }) {
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-2">Performance Over Time</h2>
      <AreaChart width={600} height={300} data={data}>
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <CartesianGrid stroke="#ccc" />
        <Area type="monotone" dataKey="averageScore" stroke="#8884d8" fill="#8884d8" />
      </AreaChart>
    </div>
  );
}
