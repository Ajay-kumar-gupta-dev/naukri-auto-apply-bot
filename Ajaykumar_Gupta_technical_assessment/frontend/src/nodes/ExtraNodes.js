// src/nodes/ExtraNodes.js — 5 additional nodes demonstrating the BaseNode abstraction

import React, { useState } from 'react';
import { BaseNode, NodeField, NodeSelect, NodeTextarea } from './BaseNode';

// 1. Note Node — a sticky note, no handles
export function NoteNode({ id, data }) {
  const [note, setNote] = useState(data?.note ?? '');
  return (
    <BaseNode id={id} title="Note" color="#f9e2af" inputs={[]} outputs={[]}>
      <NodeTextarea value={note} onChange={setNote} placeholder="Write a note..." rows={4} />
    </BaseNode>
  );
}

// 2. Math Node — takes two numeric inputs and outputs a result
export function MathNode({ id, data }) {
  const [op, setOp] = useState(data?.op ?? '+');
  return (
    <BaseNode
      id={id}
      title="Math"
      color="#89b4fa"
      inputs={[
        { id: `${id}-a`, label: 'a' },
        { id: `${id}-b`, label: 'b' },
      ]}
      outputs={[{ id: `${id}-result`, label: 'result' }]}
    >
      <NodeSelect
        label="Operation"
        value={op}
        onChange={setOp}
        options={[
          { label: 'Add (+)', value: '+' },
          { label: 'Subtract (−)', value: '-' },
          { label: 'Multiply (×)', value: '*' },
          { label: 'Divide (÷)', value: '/' },
          { label: 'Power (^)', value: '^' },
        ]}
      />
    </BaseNode>
  );
}

// 3. API Request Node — configure an HTTP request
export function APINode({ id, data }) {
  const [url, setUrl] = useState(data?.url ?? '');
  const [method, setMethod] = useState(data?.method ?? 'GET');
  return (
    <BaseNode
      id={id}
      title="API Request"
      color="#cba6f7"
      inputs={[{ id: `${id}-body`, label: 'body' }]}
      outputs={[
        { id: `${id}-response`, label: 'response' },
        { id: `${id}-status`, label: 'status' },
      ]}
      width={260}
    >
      <NodeSelect
        label="Method"
        value={method}
        onChange={setMethod}
        options={['GET', 'POST', 'PUT', 'DELETE', 'PATCH']}
      />
      <NodeField label="URL" value={url} onChange={setUrl} placeholder="https://api.example.com/..." />
    </BaseNode>
  );
}

// 4. Condition / Router Node — routes based on a condition
export function ConditionNode({ id, data }) {
  const [condition, setCondition] = useState(data?.condition ?? '');
  return (
    <BaseNode
      id={id}
      title="Condition"
      color="#94e2d5"
      inputs={[{ id: `${id}-input`, label: 'input' }]}
      outputs={[
        { id: `${id}-true`, label: 'true' },
        { id: `${id}-false`, label: 'false' },
      ]}
      width={240}
    >
      <NodeField
        label="Condition Expression"
        value={condition}
        onChange={setCondition}
        placeholder="e.g. value > 10"
      />
      <p style={{ fontSize: 11, color: '#7f849c', margin: 0 }}>
        Routes data to <strong>true</strong> or <strong>false</strong> based on the expression.
      </p>
    </BaseNode>
  );
}

// 5. Data Transform Node — map/filter/reduce
export function TransformNode({ id, data }) {
  const [mode, setMode] = useState(data?.mode ?? 'map');
  const [expr, setExpr] = useState(data?.expr ?? '');
  return (
    <BaseNode
      id={id}
      title="Transform"
      color="#f38ba8"
      inputs={[{ id: `${id}-input`, label: 'array' }]}
      outputs={[{ id: `${id}-output`, label: 'result' }]}
      width={240}
    >
      <NodeSelect
        label="Mode"
        value={mode}
        onChange={setMode}
        options={['map', 'filter', 'reduce']}
      />
      <NodeField
        label="Expression"
        value={expr}
        onChange={setExpr}
        placeholder="e.g. item => item * 2"
      />
    </BaseNode>
  );
}
