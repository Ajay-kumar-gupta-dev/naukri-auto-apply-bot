// src/components/SubmitButton.js
import React, { useState } from 'react';
import useStore from '../store';
import { submitPipeline } from '../submit';

export function SubmitButton() {
  const nodes = useStore((s) => s.nodes);
  const edges = useStore((s) => s.edges);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    setLoading(true);
    setResult(null);
    setError(null);
    try {
      const data = await submitPipeline(nodes, edges);
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={handleSubmit}
        disabled={loading}
        style={{
          position: 'fixed',
          bottom: 24,
          left: '50%',
          transform: 'translateX(-50%)',
          background: loading ? '#45475a' : 'linear-gradient(135deg, #6366f1, #a855f7)',
          border: 'none',
          borderRadius: 12,
          padding: '12px 36px',
          color: '#fff',
          fontSize: 14,
          fontWeight: 700,
          cursor: loading ? 'not-allowed' : 'pointer',
          zIndex: 200,
          boxShadow: '0 4px 20px rgba(99,102,241,0.4)',
          fontFamily: "'Inter', sans-serif",
          letterSpacing: '0.02em',
          transition: 'opacity 0.2s',
        }}
      >
        {loading ? 'Analyzing...' : '⚡ Submit Pipeline'}
      </button>

      {/* Result modal overlay */}
      {(result || error) && (
        <div
          onClick={() => { setResult(null); setError(null); }}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 999,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#1e1e2e',
              border: '1.5px solid #313244',
              borderRadius: 16,
              padding: 32,
              minWidth: 320,
              fontFamily: "'Inter', sans-serif",
              color: '#cdd6f4',
              boxShadow: '0 8px 40px rgba(0,0,0,0.6)',
            }}
          >
            {error ? (
              <>
                <h2 style={{ color: '#f38ba8', margin: '0 0 8px' }}>❌ Error</h2>
                <p style={{ color: '#7f849c', margin: 0 }}>{error}</p>
                <p style={{ fontSize: 12, color: '#585b70', marginTop: 8 }}>
                  Make sure the backend is running at localhost:8000
                </p>
              </>
            ) : (
              <>
                <h2 style={{ color: '#cdd6f4', margin: '0 0 20px', fontSize: 18, fontWeight: 800 }}>
                  📊 Pipeline Analysis
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <Stat label="Nodes" value={result.num_nodes} color="#6366f1" icon="⬡" />
                  <Stat label="Edges" value={result.num_edges} color="#cba6f7" icon="⟶" />
                  <Stat
                    label="Is DAG?"
                    value={result.is_dag ? 'Yes ✓' : 'No ✗'}
                    color={result.is_dag ? '#a6e3a1' : '#f38ba8'}
                    icon={result.is_dag ? '✓' : '✗'}
                  />
                </div>
                {!result.is_dag && (
                  <p style={{ fontSize: 12, color: '#f9e2af', marginTop: 16, background: '#f9e2af11', padding: '8px 12px', borderRadius: 8 }}>
                    ⚠️ Your pipeline contains a cycle. DAG pipelines must be acyclic.
                  </p>
                )}
              </>
            )}
            <button
              onClick={() => { setResult(null); setError(null); }}
              style={{
                marginTop: 20,
                width: '100%',
                background: '#313244',
                border: '1px solid #45475a',
                borderRadius: 8,
                padding: '8px',
                color: '#cdd6f4',
                cursor: 'pointer',
                fontFamily: 'inherit',
                fontSize: 13,
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}

function Stat({ label, value, color, icon }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: '#313244',
        borderRadius: 10,
        padding: '10px 14px',
        border: `1px solid ${color}33`,
      }}
    >
      <span style={{ color: '#a6adc8', fontSize: 13 }}>{label}</span>
      <span style={{ color, fontWeight: 700, fontSize: 16 }}>{value}</span>
    </div>
  );
}
