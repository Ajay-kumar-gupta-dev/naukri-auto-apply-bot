// src/nodes/OutputNode.js
import React, { useState } from 'react';
import { BaseNode, NodeField, NodeSelect } from './BaseNode';

export function OutputNode({ id, data }) {
  const [name, setName] = useState(data?.outputName ?? 'output');
  const [type, setType] = useState(data?.outputType ?? 'Text');

  return (
    <BaseNode
      id={id}
      title="Output"
      color="#f38ba8"
      inputs={[{ id: `${id}-value`, label: 'value' }]}
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
