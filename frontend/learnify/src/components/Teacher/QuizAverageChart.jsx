import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export default function QuizAverageChart({ data }) {
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-2">Quiz Average Scores</h2>
      <LineChart width={600} height={300} data={data}>
        <XAxis dataKey="quizTitle" />
        <YAxis />
        <Tooltip />
        <CartesianGrid stroke="#ccc" />
        <Line type="monotone" dataKey="averageScore" stroke="#82ca9d" />
      </LineChart>
    </div>
  );
}
