// src/nodes/TextNode.js
// Part 3: Dynamic sizing + variable handle extraction from {{varName}} syntax
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Handle, Position } from 'reactflow';

const VARIABLE_REGEX = /\{\{\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\}\}/g;

const MIN_WIDTH = 220;
const MIN_HEIGHT = 80;
const CHAR_WIDTH = 8;
const LINE_HEIGHT = 18;
const PADDING = 28; // header + vertical padding

function extractVariables(text) {
  const vars = new Set();
  let match;
  VARIABLE_REGEX.lastIndex = 0;
  while ((match = VARIABLE_REGEX.exec(text)) !== null) {
    vars.add(match[1]);
  }
  return [...vars];
}

function calcDimensions(text) {
  const lines = text.split('\n');
  const longestLine = lines.reduce((max, l) => Math.max(max, l.length), 0);
  const width = Math.max(MIN_WIDTH, longestLine * CHAR_WIDTH + 40);
  const height = Math.max(MIN_HEIGHT, lines.length * LINE_HEIGHT + PADDING);
  return { width, height };
}

export function TextNode({ id, data }) {
  const [text, setText] = useState(data?.text ?? '');
  const [vars, setVars] = useState([]);
  const { width, height } = calcDimensions(text);

  const handleChange = useCallback((e) => {
    const val = e.target.value;
    setText(val);
    setVars(extractVariables(val));
  }, []);

  const varHandleSpacing = vars.length > 0 ? (height - 36) / (vars.length + 1) : 0;

  return (
    <div
      style={{
        width,
        minHeight: height,
        background: '#1e1e2e',
        border: '1.5px solid #313244',
        borderRadius: 12,
        boxShadow: '0 4px 24px rgba(0,0,0,0.45)',
        fontFamily: "'Inter', sans-serif",
        fontSize: 13,
        color: '#cdd6f4',
        position: 'relative',
        overflow: 'visible',
        transition: 'width 0.15s, min-height 0.15s',
      }}
    >
      {/* Header */}
      <div
        style={{
          background: '#fab387',
          borderRadius: '10px 10px 0 0',
          padding: '8px 12px',
          fontWeight: 700,
          fontSize: 12,
          letterSpacing: '0.05em',
          color: '#fff',
          textTransform: 'uppercase',
        }}
      >
        Text
      </div>

      {/* Body */}
      <div style={{ padding: '10px 14px' }}>
        <textarea
          value={text}
          onChange={handleChange}
          placeholder="Type text... use {{variable}} to create input handles"
          style={{
            width: '100%',
            height: Math.max(MIN_HEIGHT, height - 56),
            background: '#313244',
            border: '1px solid #45475a',
            borderRadius: 6,
            padding: '6px 8px',
            color: '#cdd6f4',
            fontSize: 12,
            outline: 'none',
            resize: 'none',
            boxSizing: 'border-box',
            fontFamily: 'inherit',
            transition: 'height 0.15s',
          }}
        />
      </div>

      {/* Dynamic variable handles (inputs) */}
      {vars.map((varName, idx) => {
        const top = 36 + varHandleSpacing * (idx + 1);
        return (
          <React.Fragment key={varName}>
            <Handle
              type="target"
              position={Position.Left}
              id={`${id}-${varName}`}
              style={{
                top,
                background: '#fab387',
                border: '2px solid #1e1e2e',
                width: 10,
                height: 10,
                left: -5,
              }}
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
              {varName}
            </span>
          </React.Fragment>
        );
      })}

      {/* Output handle */}
      <Handle
        type="source"
        position={Position.Right}
        id={`${id}-output`}
        style={{
          top: height / 2,
          background: '#fab387',
          border: '2px solid #1e1e2e',
          width: 10,
          height: 10,
          right: -5,
        }}
      />
      <span
        style={{
          position: 'absolute',
          right: 10,
          top: height / 2 - 7,
          fontSize: 10,
          color: '#a6adc8',
          pointerEvents: 'none',
        }}
      >
        output
      </span>
    </div>
  );
}
