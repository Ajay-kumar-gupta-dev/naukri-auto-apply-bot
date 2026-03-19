// src/App.js
import React from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  BackgroundVariant,
} from 'reactflow';
import 'reactflow/dist/style.css';

import useStore from './store';
import { Toolbar } from './components/Toolbar';
import { SubmitButton } from './components/SubmitButton';

import { InputNode } from './nodes/InputNode';
import { OutputNode } from './nodes/OutputNode';
import { LLMNode } from './nodes/LLMNode';
import { TextNode } from './nodes/TextNode';
import { NoteNode, MathNode, APINode, ConditionNode, TransformNode } from './nodes/ExtraNodes';

const nodeTypes = {
  input: InputNode,
  output: OutputNode,
  llm: LLMNode,
  text: TextNode,
  note: NoteNode,
  math: MathNode,
  api: APINode,
  condition: ConditionNode,
  transform: TransformNode,
};

export default function App() {
  const nodes = useStore((s) => s.nodes);
  const edges = useStore((s) => s.edges);
  const onNodesChange = useStore((s) => s.onNodesChange);
  const onEdgesChange = useStore((s) => s.onEdgesChange);
  const onConnect = useStore((s) => s.onConnect);

  return (
    <div style={{ width: '100vw', height: '100vh', background: '#11111b' }}>
      <Toolbar />
      <div style={{ height: 'calc(100vh - 56px)' }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
          snapToGrid
          snapGrid={[16, 16]}
          defaultEdgeOptions={{
            type: 'smoothstep',
            animated: true,
          }}
          proOptions={{ hideAttribution: true }}
        >
          <Background
            variant={BackgroundVariant.Dots}
            gap={24}
            size={1}
            color="#313244"
          />
          <Controls
            style={{
              background: '#1e1e2e',
              border: '1px solid #313244',
              borderRadius: 8,
            }}
          />
          <MiniMap
            style={{
              background: '#181825',
              border: '1px solid #313244',
              borderRadius: 8,
            }}
            nodeColor="#313244"
            maskColor="rgba(17,17,27,0.7)"
          />
        </ReactFlow>
      </div>
      <SubmitButton />
    </div>
  );
}
