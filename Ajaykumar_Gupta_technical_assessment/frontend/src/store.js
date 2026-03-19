// src/store.js
import { create } from 'zustand';
import { addEdge, applyNodeChanges, applyEdgeChanges, MarkerType } from 'reactflow';

let nodeIdCounter = 0;
export const getId = (type) => `${type}-${++nodeIdCounter}`;

const useStore = create((set, get) => ({
  nodes: [],
  edges: [],

  onNodesChange: (changes) =>
    set({ nodes: applyNodeChanges(changes, get().nodes) }),

  onEdgesChange: (changes) =>
    set({ edges: applyEdgeChanges(changes, get().edges) }),

  onConnect: (connection) =>
    set({
      edges: addEdge(
        {
          ...connection,
          type: 'smoothstep',
          animated: true,
          markerEnd: { type: MarkerType.ArrowClosed, color: '#6366f1' },
          style: { stroke: '#6366f1', strokeWidth: 1.5 },
        },
        get().edges
      ),
    }),

  addNode: (type) => {
    const id = getId(type);
    const position = {
      x: 100 + Math.random() * 300,
      y: 100 + Math.random() * 200,
    };
    set({ nodes: [...get().nodes, { id, type, position, data: {} }] });
  },
}));

export default useStore;
