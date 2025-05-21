import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, ResponsiveContainer } from 'recharts';

const COLORS = [
  '#e0f7fa', // lightest
  '#80deea',
  '#26c6da',
  '#00acc1',
  '#00838f', // darkest
];

const getColor = (value, maxValue) => {
  const index = Math.floor((value / maxValue) * (COLORS.length - 1));
  return COLORS[index];
};

export default function EngagementHeatmap({ data }) {
  const maxSubmissions = Math.max(...data.map(d => d.submissions), 1);

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
        color: '#f6ad55',
        position: 'relative',
        display: 'inline-block',
        paddingBottom: '0.5rem',
      }}>
        Engagement by Day of Week
        <div style={{
          position: 'absolute',
          bottom: '0',
          left: '0',
          width: '40px',
          height: '3px',
          background: 'linear-gradient(135deg, #f6ad55 0%, #f97316 100%)',
          borderRadius: '3px',
        }}></div>
      </h2>
      <div style={{ flex: 1, minHeight: '250px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 10 }}>
            <XAxis dataKey="dayOfWeek" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#fff', 
                borderRadius: '8px', 
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
                border: 'none',
              }} 
              formatter={(value) => [`${value} submissions`, 'Activity']}
            />
            <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
            <Bar 
              dataKey="submissions" 
              radius={[4, 4, 0, 0]}
              animationDuration={1500}
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={getColor(entry.submissions, maxSubmissions)} 
                  stroke="#fff"
                  strokeWidth={1}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        marginTop: '1rem',
        gap: '0.5rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', fontSize: '0.8rem' }}>
          <div style={{ 
            width: '12px', 
            height: '12px', 
            backgroundColor: COLORS[0], 
            marginRight: '4px',
            borderRadius: '2px',
          }}></div>
          <span>Low</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', fontSize: '0.8rem' }}>
          <div style={{ 
            width: '12px', 
            height: '12px', 
            backgroundColor: COLORS[2], 
            marginRight: '4px',
            borderRadius: '2px',
          }}></div>
          <span>Medium</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', fontSize: '0.8rem' }}>
          <div style={{ 
            width: '12px', 
            height: '12px', 
            backgroundColor: COLORS[4], 
            marginRight: '4px',
            borderRadius: '2px',
          }}></div>
          <span>High</span>
        </div>
      </div>
    </div>
  );
}
