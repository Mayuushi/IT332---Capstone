import React, { useEffect, useRef } from 'react';

export default function BattleLog({ logs }) {
  const bottomRef = useRef(null);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [logs]);

  return (
    <div className="battle-log">
      <div className="bl-header">
        <span className="bl-header-dot" /><span className="bl-header-dot" /><span className="bl-header-dot" />
        <span className="bl-title">Battle Log</span>
      </div>
      <div className="bl-entries">
        {logs.map((log, i) => (
          <div key={i} className={`bl-entry ${i === logs.length - 1 ? 'bl-entry-latest' : ''}`}>
            <span className="bl-entry-arrow">›</span>
            {log}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}