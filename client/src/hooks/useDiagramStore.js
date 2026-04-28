import { create } from 'zustand';
import { applyNodeChanges, applyEdgeChanges, addEdge } from '@xyflow/react';

const useDiagramStore = create((set, get) => ({
  // ── Diagram metadata ──
  diagramId: null,
  diagramName: 'Untitled Architecture',
  diagramDescription: '',

  // ── React Flow state ──
  nodes: [],
  edges: [],
  selectedNodeId: null,

  // ── Viewport ──
  viewport: { x: 0, y: 0, zoom: 1 },

  // ── Actions: Nodes ──
  onNodesChange: (changes) => {
    set({ nodes: applyNodeChanges(changes, get().nodes) });
  },

  addNode: (node) => {
    set({ nodes: [...get().nodes, node] });
  },

  updateNodeData: (nodeId, dataUpdates) => {
    set({
      nodes: get().nodes.map((n) =>
        n.id === nodeId
          ? { ...n, data: { ...n.data, ...dataUpdates } }
          : n
      ),
    });
  },

  updateNodeProperties: (nodeId, propertyUpdates) => {
    set({
      nodes: get().nodes.map((n) =>
        n.id === nodeId
          ? {
              ...n,
              data: {
                ...n.data,
                properties: { ...n.data.properties, ...propertyUpdates },
              },
            }
          : n
      ),
    });
  },

  removeNode: (nodeId) => {
    set({
      nodes: get().nodes.filter((n) => n.id !== nodeId),
      edges: get().edges.filter((e) => e.source !== nodeId && e.target !== nodeId),
      selectedNodeId: get().selectedNodeId === nodeId ? null : get().selectedNodeId,
    });
  },

  // ── Actions: Edges ──
  onEdgesChange: (changes) => {
    set({ edges: applyEdgeChanges(changes, get().edges) });
  },

  onConnect: (connection) => {
    set({ edges: addEdge({ ...connection, type: 'custom', animated: true }, get().edges) });
  },

  // ── Actions: Selection ──
  setSelectedNode: (nodeId) => {
    set({ selectedNodeId: nodeId });
  },

  getSelectedNode: () => {
    const { nodes, selectedNodeId } = get();
    return nodes.find((n) => n.id === selectedNodeId) || null;
  },

  // ── Actions: Diagram ──
  setDiagramMeta: ({ id, name, description }) => {
    set({
      diagramId: id ?? get().diagramId,
      diagramName: name ?? get().diagramName,
      diagramDescription: description ?? get().diagramDescription,
    });
  },

  setViewport: (viewport) => {
    set({ viewport });
  },

  loadDiagram: ({ id, name, description, nodes, edges, viewport }) => {
    // Sanitize incoming arrays to prevent null nodes/edges
    const safeNodes = (nodes || []).filter(n => n != null);
    const safeEdges = (edges || []).filter(e => e != null);

    set({
      diagramId: id || null,
      diagramName: name || 'Untitled Architecture',
      diagramDescription: description || '',
      nodes: safeNodes,
      edges: safeEdges,
      viewport: viewport || { x: 0, y: 0, zoom: 1 },
      selectedNodeId: null,
    });
  },

  clearDiagram: () => {
    set({
      diagramId: null,
      diagramName: 'Untitled Architecture',
      diagramDescription: '',
      nodes: [],
      edges: [],
      selectedNodeId: null,
      viewport: { x: 0, y: 0, zoom: 1 },
    });
  },

  // Get full serializable state
  getDiagramJSON: () => {
    const { diagramId, diagramName, diagramDescription, nodes, edges, viewport } = get();
    return {
      id: diagramId,
      name: diagramName,
      description: diagramDescription,
      nodes,
      edges,
      viewport,
    };
  },
}));

export default useDiagramStore;
