import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';

export default function QuizAverageChart({ data }) {
  return (
    <div style={{
      padding: '1.5rem',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
    }}>
      <h2 style={{
        fontSize: '1.25rem',
        fontWeight: '700',
        marginBottom: '1rem',
        color: '#34a853',
        position: 'relative',
        display: 'inline-block',
        paddingBottom: '0.5rem',
      }}>
        Quiz Average Scores
        <div style={{
          position: 'absolute',
          bottom: '0',
          left: '0',
          width: '40px',
          height: '3px',
          background: 'linear-gradient(135deg, #34a853 0%, #4eca6a 100%)',
          borderRadius: '3px',
        }}></div>
      </h2>
      <div style={{ flex: 1, minHeight: '250px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
            <XAxis 
              dataKey="quizTitle" 
              tick={{ fontSize: 12 }} 
              angle={-45} 
              textAnchor="end"
              height={70}
            />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#fff', 
                borderRadius: '8px', 
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
                border: 'none',
              }} 
            />
            <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
            <Line 
              type="monotone" 
              dataKey="averageScore" 
              stroke="url(#secondaryGradient)" 
              strokeWidth={3}
              dot={{ stroke: '#34a853', strokeWidth: 2, fill: '#fff', r: 4 }}
              activeDot={{ stroke: '#34a853', strokeWidth: 2, fill: '#34a853', r: 6 }}
              animationDuration={1500}
            />
            <defs>
              <linearGradient id="secondaryGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#34a853" />
                <stop offset="100%" stopColor="#4eca6a" />
              </linearGradient>
            </defs>
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
