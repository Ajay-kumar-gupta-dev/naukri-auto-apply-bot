// src/components/Toolbar.js
import React from 'react';
import useStore from '../store';

const NODE_TYPES = [
  { type: 'input', label: '⬅ Input', color: '#6366f1' },
  { type: 'output', label: 'Output ➡', color: '#f38ba8' },
  { type: 'llm', label: '🤖 LLM', color: '#a6e3a1' },
  { type: 'text', label: '📝 Text', color: '#fab387' },
  { type: 'note', label: '🗒 Note', color: '#f9e2af' },
  { type: 'math', label: '➕ Math', color: '#89b4fa' },
  { type: 'api', label: '🌐 API', color: '#cba6f7' },
  { type: 'condition', label: '⚡ Condition', color: '#94e2d5' },
  { type: 'transform', label: '🔄 Transform', color: '#f38ba8' },
];

export function Toolbar() {
  const addNode = useStore((s) => s.addNode);

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: 56,
        background: '#181825',
        borderBottom: '1px solid #313244',
        display: 'flex',
        alignItems: 'center',
        padding: '0 16px',
        gap: 8,
        zIndex: 100,
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <span
        style={{
          color: '#cdd6f4',
          fontWeight: 800,
          fontSize: 16,
          marginRight: 16,
          letterSpacing: '-0.02em',
          whiteSpace: 'nowrap',
        }}
      >
        ⚡ VectorShift
      </span>

      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', flex: 1 }}>
        {NODE_TYPES.map(({ type, label, color }) => (
          <button
            key={type}
            onClick={() => addNode(type)}
            style={{
              background: '#313244',
              border: `1px solid ${color}33`,
              borderRadius: 8,
              padding: '5px 12px',
              color: '#cdd6f4',
              fontSize: 12,
              cursor: 'pointer',
              fontFamily: 'inherit',
              fontWeight: 500,
              transition: 'background 0.15s, border-color 0.15s',
              whiteSpace: 'nowrap',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = color + '22';
              e.currentTarget.style.borderColor = color;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#313244';
              e.currentTarget.style.borderColor = color + '33';
            }}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
