// src/nodes/InputNode.js
import React, { useState } from 'react';
import { BaseNode, NodeField, NodeSelect } from './BaseNode';

export function InputNode({ id, data }) {
  const [name, setName] = useState(data?.inputName ?? 'input');
  const [type, setType] = useState(data?.inputType ?? 'Text');

  return (
    <BaseNode
      id={id}
      title="Input"
      color="#6366f1"
      outputs={[{ id: `${id}-value`, label: 'value' }]}
    >
      <NodeField label="Name" value={name} onChange={setName} />
      <NodeSelect
        label="Type"
        value={type}
        onChange={setType}
        options={['Text', 'File', 'Image', 'Number']}
      />
    </BaseNode>
  );
}
