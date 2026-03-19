// src/nodes/BaseNode.js
// Core abstraction for all nodes — define type, title, fields, and handles.
import React from 'react';
import { Handle, Position } from 'reactflow';

/**
 * BaseNode — shared UI shell for every node type.
 *
 * Props:
 *  id          — ReactFlow node id
 *  title       — label shown in the header
 *  color       — accent color for the header strip (hex / css)
 *  inputs      — array of { id, label, position? } for left-side handles
 *  outputs     — array of { id, label, position? } for right-side handles
 *  children    — body content (fields, selects, textareas, etc.)
 *  width       — optional fixed width (default 220)
 *  style       — optional extra inline styles on the wrapper
 */
export function BaseNode({
  id,
  title,
  color = '#6366f1',
  inputs = [],
  outputs = [],
  children,
  width = 220,
  style = {},
}) {
  return (
    <div
      style={{
        width,
        background: '#1e1e2e',
        border: '1.5px solid #313244',
        borderRadius: 12,
        boxShadow: '0 4px 24px rgba(0,0,0,0.45)',
        fontFamily: "'Inter', sans-serif",
        fontSize: 13,
        color: '#cdd6f4',
        overflow: 'visible',
        position: 'relative',
        ...style,
      }}
    >
      {/* Header */}
      <div
        style={{
          background: color,
          borderRadius: '10px 10px 0 0',
          padding: '8px 12px',
          fontWeight: 700,
          fontSize: 12,
          letterSpacing: '0.05em',
          color: '#fff',
          textTransform: 'uppercase',
          display: 'flex',
          alignItems: 'center',
          gap: 6,
        }}
      >
        <span>{title}</span>
      </div>

      {/* Body */}
      <div style={{ padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {children}
      </div>

      {/* Input Handles */}
      {inputs.map((handle, idx) => {
        const top = calcHandleTop(idx, inputs.length);
        return (
          <React.Fragment key={handle.id}>
            <Handle
              type="target"
              position={Position.Left}
              id={handle.id}
              style={{ top, background: color, border: '2px solid #1e1e2e', width: 10, height: 10, left: -5 }}
            />
            <span
              style={{
                position: 'absolute',
                left: 10,
                top: top - 7,
                fontSize: 10,
                color: '#a6adc8',
                pointerEvents: 'none',
              }}
            >
              {handle.label}
            </span>
          </React.Fragment>
        );
      })}

      {/* Output Handles */}
      {outputs.map((handle, idx) => {
        const top = calcHandleTop(idx, outputs.length);
        return (
          <React.Fragment key={handle.id}>
            <Handle
              type="source"
              position={Position.Right}
              id={handle.id}
              style={{ top, background: color, border: '2px solid #1e1e2e', width: 10, height: 10, right: -5 }}
            />
            <span
              style={{
                position: 'absolute',
                right: 10,
                top: top - 7,
                fontSize: 10,
                color: '#a6adc8',
                pointerEvents: 'none',
                textAlign: 'right',
              }}
            >
              {handle.label}
            </span>
          </React.Fragment>
        );
      })}
    </div>
  );
}

function calcHandleTop(idx, total) {
  // Distribute handles evenly across the node height, starting after header (~36px)
  // Body padding + approximate height
  const headerH = 36;
  const bodyH = 80;
  const totalH = headerH + bodyH;
  if (total === 1) return totalH / 2;
  const step = bodyH / (total + 1);
  return headerH + step * (idx + 1);
}

/** Helper: a labeled text input field */
export function NodeField({ label, value, onChange, placeholder = '', type = 'text' }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {label && <label style={{ fontSize: 11, color: '#7f849c', fontWeight: 600 }}>{label}</label>}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          background: '#313244',
          border: '1px solid #45475a',
          borderRadius: 6,
          padding: '5px 8px',
          color: '#cdd6f4',
          fontSize: 12,
          outline: 'none',
          width: '100%',
          boxSizing: 'border-box',
        }}
      />
    </div>
  );
}

/** Helper: a labeled select field */
export function NodeSelect({ label, value, onChange, options = [] }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {label && <label style={{ fontSize: 11, color: '#7f849c', fontWeight: 600 }}>{label}</label>}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          background: '#313244',
          border: '1px solid #45475a',
          borderRadius: 6,
          padding: '5px 8px',
          color: '#cdd6f4',
          fontSize: 12,
          outline: 'none',
          width: '100%',
          cursor: 'pointer',
        }}
      >
        {options.map((opt) => (
          <option key={opt.value ?? opt} value={opt.value ?? opt}>
            {opt.label ?? opt}
          </option>
        ))}
      </select>
    </div>
  );
}

/** Helper: textarea */
export function NodeTextarea({ label, value, onChange, placeholder = '', rows = 3, style = {} }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {label && <label style={{ fontSize: 11, color: '#7f849c', fontWeight: 600 }}>{label}</label>}
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        style={{
          background: '#313244',
          border: '1px solid #45475a',
          borderRadius: 6,
          padding: '5px 8px',
          color: '#cdd6f4',
          fontSize: 12,
          outline: 'none',
          width: '100%',
          resize: 'none',
          boxSizing: 'border-box',
          fontFamily: 'inherit',
          ...style,
        }}
      />
    </div>
  );
}
