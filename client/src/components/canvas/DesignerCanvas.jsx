import { useCallback, useRef, useMemo, useState, useEffect } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  BackgroundVariant,
  Panel,
  useReactFlow
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import nodeTypes from '../nodes/nodeTypes';
import CustomEdge from './CustomEdge';
import useDiagramStore from '../../hooks/useDiagramStore';
import useLinter from '../../hooks/useLinter';
import { getServiceById } from '../../data/awsServices';

import DotField from '../landing/DotField';
import { Activity, Zap, Cpu, Server } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const edgeTypes = { custom: CustomEdge };

let nodeIdCounter = 0;

export default function DesignerCanvas() {
  const reactFlowWrapper = useRef(null);
  const reactFlowInstance = useRef(null);
  const { screenToFlowPosition } = useReactFlow();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isReady, setIsReady] = useState(false);

  const nodes = useDiagramStore((s) => s.nodes);
  const edges = useDiagramStore((s) => s.edges);
  const viewport = useDiagramStore((s) => s.viewport);
  const diagramId = useDiagramStore((s) => s.diagramId);
  const onNodesChange = useDiagramStore((s) => s.onNodesChange);
  const onEdgesChange = useDiagramStore((s) => s.onEdgesChange);
  const onConnect = useDiagramStore((s) => s.onConnect);
  const addNode = useDiagramStore((s) => s.addNode);
  const setSelectedNode = useDiagramStore((s) => s.setSelectedNode);

  const { getWarningsForNode } = useLinter();

  useEffect(() => {
    setIsReady(true);
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Fit View / Apply Viewport on Diagram Load
  const [hasFitted, setHasFitted] = useState(false);

  useEffect(() => {
    setHasFitted(false); // Reset whenever diagram ID or name changes
  }, [diagramId, useDiagramStore.getState().diagramName]);

  useEffect(() => {
    if (reactFlowInstance.current && nodes.length > 0 && !hasFitted) {
      setTimeout(() => {
        if (viewport?.zoom) {
           reactFlowInstance.current.setViewport(viewport);
        } else {
           reactFlowInstance.current.fitView({ padding: 0.2 });
        }
        setHasFitted(true);
      }, 50);
    }
  }, [nodes]); // Fired on nodes change as requested, but locked to execute only once per diagram/template load

  // SAFE nodes + inject warnings
  const nodesWithWarnings = useMemo(() => {
    return (nodes || [])
      .filter((n) => n && n.data)
      .map((n) => ({
        ...n,
        data: {
          ...n.data,
          warnings: getWarningsForNode(n.id),
        },
      }));
  }, [nodes, getWarningsForNode]);

  const onInit = useCallback((instance) => {
    reactFlowInstance.current = instance;
  }, []);

  const onNodeClick = useCallback((_event, node) => {
    setSelectedNode(node.id);
  }, [setSelectedNode]);

  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
  }, [setSelectedNode]);

  // IMPROVED DROP (merged logic)
  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const serviceId = event.dataTransfer.getData('application/infrasketch-service');
      if (!serviceId) return;

      const service = getServiceById(serviceId);
      if (!service) return;

      // NEW positioning method (more accurate)
      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode = {
        id: `${serviceId}-${++nodeIdCounter}-${Date.now()}`,
        type: 'awsService',
        position,
        data: {
          label: service.name,
          serviceType: service.id,
          category: service.category,
          fullName: service.fullName,
          properties: { ...service.defaultProperties },
          warnings: [],
        },
      };

      addNode(newNode);
    },
    [addNode, screenToFlowPosition]
  );

  return (
    <div className="canvas-wrapper" ref={reactFlowWrapper} style={{ position: 'relative' }}>

      {/* Background Effects */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-40">
        <DotField
          dotRadius={1.2}
          dotSpacing={20}
          bulgeStrength={40}
          glowRadius={150}
          sparkle={false}
          gradientFrom="#ffffff"
          gradientTo="#cccccc"
          glowColor="rgba(255,255,255,0.1)"
        />
      </div>

      <div className="absolute inset-0 z-10 w-full h-full pointer-events-none opacity-30"
        style={{ background: 'radial-gradient(circle at center, transparent 30%, #080808 100%)' }}
      />

      <div className="absolute inset-0 z-20 w-full h-full pointer-events-auto">
        <ReactFlow
          nodes={nodesWithWarnings}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onInit={onInit}
          onNodeClick={onNodeClick}
          onPaneClick={onPaneClick}
          onDragOver={onDragOver}
          onDrop={onDrop}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          defaultEdgeOptions={{
            type: 'custom',
            animated: true,
            style: { stroke: '#555', strokeWidth: 2 },
          }}
          fitView
          snapToGrid
          snapGrid={[20, 20]}
          minZoom={0.1}
          maxZoom={2}
          deleteKeyCode={['Backspace', 'Delete']}
          proOptions={{ hideAttribution: true }}
        >
          <Background
            variant={BackgroundVariant.Dots}
            gap={20}
            size={1}
            color="#333"
          />

          {/* Upgraded Controls */}
          <Controls
            className="bg-[#0A0A0A] border border-[#222] text-white rounded-lg shadow-xl"
          />

          {/* Upgraded Minimap */}
          <MiniMap
            nodeColor={(n) => {
              const colors = {
                compute: '#f97316',
                storage: '#22c55e',
                database: '#3b82f6',
                networking: '#a855f7',
                security: '#ef4444',
                management: '#64748b',
                analytics: '#06b6d4',
                integration: '#ec4899',
              };
              return colors[n.data?.category] || '#FF5C00';
            }}
            maskColor="rgba(0,0,0,0.7)"
            className="bg-[#0A0A0A] border border-[#222] rounded-xl shadow-2xl"
            style={{ width: 180, height: 120 }}
          />

          {/* Analytics Panel (unchanged) */}
          <AnimatePresence>
            {isReady && (
              <Panel position="bottom-left" className="pointer-events-none mb-10 ml-4 hidden md:block">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="bg-[#0a0a0a]/60 backdrop-blur-sm border border-white/5 rounded-2xl p-4 w-64"
                >
                  <p className="text-[10px] uppercase text-gray-500 font-bold mb-3 tracking-wider flex items-center gap-2">
                    <Zap size={12} className="text-[#FF5C00]" /> Intelligence
                  </p>

                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-400 flex gap-2"><Cpu size={12} /> Compute</span>
                      <span>{nodes.filter(n => n?.data?.category === 'compute').length}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-400 flex gap-2"><Server size={12} /> Storage</span>
                      <span>{nodes.filter(n => n?.data?.category === 'storage').length}</span>
                    </div>
                  </div>
                </motion.div>
              </Panel>
            )}
          </AnimatePresence>

        </ReactFlow>
      </div>
    </div>
  );
}