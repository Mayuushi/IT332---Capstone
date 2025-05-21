import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';

export default function ClassPerformanceChart({ data }) {
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
        color: '#4F46E5',
        position: 'relative',
        display: 'inline-block',
        paddingBottom: '0.5rem',
      }}>
        Class Performance
        <div style={{
          position: 'absolute',
          bottom: '0',
          left: '0',
          width: '40px',
          height: '3px',
          background: 'linear-gradient(135deg, #4F46E5 0%, #7367F0 100%)',
          borderRadius: '3px',
        }}></div>
      </h2>
      <div style={{ flex: 1, minHeight: '250px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
            <XAxis 
              dataKey="studentName" 
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
            <Bar 
              dataKey="averageScore" 
              fill="url(#primaryGradient)" 
              radius={[4, 4, 0, 0]}
              animationDuration={1500}
            />
            <defs>
              <linearGradient id="primaryGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#4F46E5" />
                <stop offset="100%" stopColor="#7367F0" />
              </linearGradient>
            </defs>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
