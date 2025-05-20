import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from 'recharts';

const COLORS = [
  '#e0f7fa', // light
  '#80deea',
  '#26c6da',
  '#00acc1',
  '#00838f', // dark
];

const getColor = (value, maxValue) => {
  const index = Math.floor((value / maxValue) * (COLORS.length - 1));
  return COLORS[index];
};

export default function EngagementHeatmap({ data }) {
  const maxSubmissions = Math.max(...data.map(d => d.submissions), 1);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-2">Engagement by Day of Week</h2>
      <BarChart width={600} height={300} data={data}>
        <XAxis dataKey="dayOfWeek" />
        <YAxis />
        <Tooltip />
        <CartesianGrid strokeDasharray="3 3" />
        <Bar dataKey="submissions">
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={getColor(entry.submissions, maxSubmissions)} />
          ))}
        </Bar>
      </BarChart>
    </div>
  );
}
