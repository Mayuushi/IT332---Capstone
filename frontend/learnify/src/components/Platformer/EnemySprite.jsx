import React from 'react';

const enemies = {
  synapse_slime: (
    <svg viewBox="0 0 120 120" width="120" height="120">
      <defs>
        <radialGradient id="slimeGrad" cx="50%" cy="60%" r="50%">
          <stop offset="0%" stopColor="#34d399"/>
          <stop offset="100%" stopColor="#065f46"/>
        </radialGradient>
      </defs>
      <ellipse cx="60" cy="75" rx="50" ry="35" fill="url(#slimeGrad)" opacity="0.5"/>
      <ellipse cx="60" cy="60" rx="42" ry="42" fill="url(#slimeGrad)"/>
      <circle cx="44" cy="52" r="8" fill="#064e3b"/>
      <circle cx="76" cy="52" r="8" fill="#064e3b"/>
      <circle cx="46" cy="50" r="3" fill="white"/>
      <circle cx="78" cy="50" r="3" fill="white"/>
      <path d="M45,70 Q60,82 75,70" fill="none" stroke="#064e3b" strokeWidth="3" strokeLinecap="round"/>
      <circle cx="25" cy="40" r="6" fill="#10b981" opacity="0.7">
        <animate attributeName="cy" values="40;35;40" dur="2s" repeatCount="indefinite"/>
      </circle>
      <circle cx="95" cy="45" r="5" fill="#10b981" opacity="0.7">
        <animate attributeName="cy" values="45;38;45" dur="2.5s" repeatCount="indefinite"/>
      </circle>
      <circle cx="60" cy="18" r="4" fill="#34d399" opacity="0.8">
        <animate attributeName="cy" values="18;12;18" dur="1.8s" repeatCount="indefinite"/>
      </circle>
    </svg>
  ),
  reflex_rex: (
    <svg viewBox="0 0 120 120" width="120" height="120">
      <defs>
        <linearGradient id="rexGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f97316"/>
          <stop offset="100%" stopColor="#7c2d12"/>
        </linearGradient>
      </defs>
      {/* Body */}
      <rect x="35" y="45" width="50" height="55" rx="12" fill="url(#rexGrad)"/>
      {/* Head */}
      <ellipse cx="60" cy="38" rx="28" ry="25" fill="#ea580c"/>
      {/* Eyes */}
      <circle cx="50" cy="32" r="7" fill="#1c1917"/>
      <circle cx="70" cy="32" r="7" fill="#1c1917"/>
      <circle cx="52" cy="30" r="3" fill="#fef3c7"/>
      <circle cx="72" cy="30" r="3" fill="#fef3c7"/>
      {/* Spikes */}
      <polygon points="42,15 48,28 36,28" fill="#c2410c"/>
      <polygon points="60,10 66,24 54,24" fill="#c2410c"/>
      <polygon points="78,15 84,28 72,28" fill="#c2410c"/>
      {/* Mouth */}
      <path d="M48,48 Q60,58 72,48" fill="none" stroke="#7c2d12" strokeWidth="3" strokeLinecap="round"/>
      {/* Arms */}
      <rect x="15" y="50" width="20" height="10" rx="5" fill="#ea580c">
        <animate attributeName="y" values="50;46;50" dur="1.5s" repeatCount="indefinite"/>
      </rect>
      <rect x="85" y="50" width="20" height="10" rx="5" fill="#ea580c">
        <animate attributeName="y" values="50;54;50" dur="1.5s" repeatCount="indefinite"/>
      </rect>
      {/* Lightning */}
      <path d="M55,65 L50,78 L58,78 L53,92" stroke="#fbbf24" strokeWidth="3" fill="none" strokeLinecap="round">
        <animate attributeName="opacity" values="1;0.2;1" dur="0.8s" repeatCount="indefinite"/>
      </path>
    </svg>
  ),
  sense_specter: (
    <svg viewBox="0 0 120 120" width="120" height="120">
      <defs>
        <radialGradient id="specterGrad" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.9"/>
          <stop offset="100%" stopColor="#4c1d95" stopOpacity="0.6"/>
        </radialGradient>
      </defs>
      {/* Ghost body */}
      <path d="M20,50 Q20,15 60,15 Q100,15 100,50 L100,95 Q85,88 75,95 Q65,102 60,95 Q55,88 45,95 Q35,102 20,95 Z"
            fill="url(#specterGrad)"/>
      {/* Eyes */}
      <ellipse cx="46" cy="52" rx="10" ry="12" fill="#1e1b4b"/>
      <ellipse cx="74" cy="52" rx="10" ry="12" fill="#1e1b4b"/>
      <circle cx="49" cy="49" r="4" fill="#c4b5fd"/>
      <circle cx="77" cy="49" r="4" fill="#c4b5fd"/>
      {/* Floating particles */}
      <circle cx="30" cy="30" r="4" fill="#c4b5fd" opacity="0.8">
        <animate attributeName="cx" values="30;25;35;30" dur="3s" repeatCount="indefinite"/>
        <animate attributeName="cy" values="30;22;26;30" dur="3s" repeatCount="indefinite"/>
      </circle>
      <circle cx="90" cy="25" r="3" fill="#e879f9" opacity="0.8">
        <animate attributeName="cx" values="90;96;84;90" dur="2.5s" repeatCount="indefinite"/>
        <animate attributeName="cy" values="25;18;30;25" dur="2.5s" repeatCount="indefinite"/>
      </circle>
      <circle cx="60" cy="8" r="5" fill="#a78bfa" opacity="0.9">
        <animate attributeName="cy" values="8;2;8" dur="2s" repeatCount="indefinite"/>
      </circle>
    </svg>
  ),
  nerve_ninja: (
    <svg viewBox="0 0 120 120" width="120" height="120">
      <defs>
        <linearGradient id="ninjaGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#0ea5e9"/>
          <stop offset="100%" stopColor="#0c4a6e"/>
        </linearGradient>
      </defs>
      {/* Body */}
      <rect x="38" y="50" width="44" height="50" rx="10" fill="url(#ninjaGrad)"/>
      {/* Head */}
      <circle cx="60" cy="38" r="26" fill="#0284c7"/>
      {/* Mask */}
      <rect x="35" y="32" width="50" height="20" rx="5" fill="#0c4a6e"/>
      {/* Eyes */}
      <ellipse cx="50" cy="38" rx="6" ry="5" fill="#38bdf8"/>
      <ellipse cx="70" cy="38" rx="6" ry="5" fill="#38bdf8"/>
      <circle cx="51" cy="37" r="2" fill="white"/>
      <circle cx="71" cy="37" r="2" fill="white"/>
      {/* Nerve lines */}
      <path d="M15,60 Q28,55 38,65" stroke="#38bdf8" strokeWidth="2" fill="none" strokeDasharray="3,2">
        <animate attributeName="strokeDashoffset" values="0;-20" dur="1s" repeatCount="indefinite"/>
      </path>
      <path d="M82,65 Q92,55 105,60" stroke="#38bdf8" strokeWidth="2" fill="none" strokeDasharray="3,2">
        <animate attributeName="strokeDashoffset" values="0;-20" dur="1s" repeatCount="indefinite"/>
      </path>
      {/* Throwing star */}
      <g transform="translate(60,85)">
        <polygon points="0,-8 3,-3 8,-3 4,1 6,7 0,3 -6,7 -4,1 -8,-3 -3,-3" fill="#fbbf24">
          <animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="2s" repeatCount="indefinite"/>
        </polygon>
      </g>
    </svg>
  ),
  brain_boss: (
    <svg viewBox="0 0 120 120" width="120" height="120">
      <defs>
        <radialGradient id="bossGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ec4899"/>
          <stop offset="100%" stopColor="#7f1d1d"/>
        </radialGradient>
        <radialGradient id="bossGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.5"/>
          <stop offset="100%" stopColor="#f43f5e" stopOpacity="0"/>
        </radialGradient>
      </defs>
      {/* Glow */}
      <circle cx="60" cy="60" r="55" fill="url(#bossGlow)"/>
      {/* Crown */}
      <polygon points="25,45 35,25 45,38 60,20 75,38 85,25 95,45" fill="#fbbf24"/>
      <circle cx="60" cy="20" r="5" fill="#f59e0b"/>
      <circle cx="35" cy="25" r="4" fill="#f59e0b"/>
      <circle cx="85" cy="25" r="4" fill="#f59e0b"/>
      {/* Brain body */}
      <ellipse cx="60" cy="72" rx="48" ry="38" fill="url(#bossGrad)"/>
      <ellipse cx="40" cy="58" rx="25" ry="30" fill="#db2777"/>
      <ellipse cx="80" cy="58" rx="25" ry="30" fill="#db2777"/>
      {/* Folds */}
      <path d="M32,50 Q44,38 55,50" fill="none" stroke="#fda4af" strokeWidth="2.5" strokeLinecap="round"/>
      <path d="M65,50 Q76,38 88,50" fill="none" stroke="#fda4af" strokeWidth="2.5" strokeLinecap="round"/>
      <path d="M38,68 Q50,56 62,68" fill="none" stroke="#fda4af" strokeWidth="2.5" strokeLinecap="round"/>
      <path d="M58,68 Q70,56 82,68" fill="none" stroke="#fda4af" strokeWidth="2.5" strokeLinecap="round"/>
      {/* Evil eyes */}
      <ellipse cx="46" cy="76" rx="9" ry="9" fill="#1c1917"/>
      <ellipse cx="74" cy="76" rx="9" ry="9" fill="#1c1917"/>
      <circle cx="49" cy="73" r="4" fill="#f43f5e">
        <animate attributeName="r" values="4;5;4" dur="1s" repeatCount="indefinite"/>
      </circle>
      <circle cx="77" cy="73" r="4" fill="#f43f5e">
        <animate attributeName="r" values="4;5;4" dur="1s" repeatCount="indefinite"/>
      </circle>
      {/* Mean mouth */}
      <path d="M48,90 Q60,84 72,90" fill="none" stroke="#fda4af" strokeWidth="3" strokeLinecap="round"/>
      {/* Lightning bolts */}
      <path d="M12,60 L18,72 L14,72 L20,84" stroke="#fbbf24" strokeWidth="2.5" fill="none" strokeLinecap="round">
        <animate attributeName="opacity" values="1;0;1" dur="0.6s" repeatCount="indefinite"/>
      </path>
      <path d="M100,60 L106,72 L102,72 L108,84" stroke="#fbbf24" strokeWidth="2.5" fill="none" strokeLinecap="round">
        <animate attributeName="opacity" values="0;1;0" dur="0.6s" repeatCount="indefinite"/>
      </path>
    </svg>
  ),
};

export default function EnemySprite({ type, isHurt, isDefeated }) {
  const sprite = enemies[type] || enemies.synapse_slime;

  return (
    <div className={`enemy-sprite ${isHurt ? 'hurt' : ''} ${isDefeated ? 'defeated' : ''}`}>
      {sprite}
      {isDefeated && <div className="defeated-x">✕</div>}
    </div>
  );
}
