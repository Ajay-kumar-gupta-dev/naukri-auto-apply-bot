// src/nodes/LLMNode.js
import React, { useState } from 'react';
import { BaseNode, NodeSelect } from './BaseNode';

export function LLMNode({ id, data }) {
  const [model, setModel] = useState(data?.model ?? 'gpt-4o');

  return (
    <BaseNode
      id={id}
      title="LLM"
      color="#a6e3a1"
      inputs={[
        { id: `${id}-system`, label: 'system' },
        { id: `${id}-prompt`, label: 'prompt' },
      ]}
      outputs={[{ id: `${id}-response`, label: 'response' }]}
    >
      <NodeSelect
        label="Model"
        value={model}
        onChange={setModel}
        options={['gpt-4o', 'gpt-4o-mini', 'claude-3-5-sonnet', 'claude-3-haiku', 'gemini-1.5-pro']}
      />
      <p style={{ fontSize: 11, color: '#7f849c', margin: 0 }}>
        Connect a system prompt and user prompt to generate a response.
      </p>
    </BaseNode>
  );
}
