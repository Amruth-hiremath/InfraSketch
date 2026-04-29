import { useCallback, useRef, useMemo, useState, useEffect } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  BackgroundVariant,
  useReactFlow
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import nodeTypes from '../nodes/nodeTypes';
import CustomEdge from './CustomEdge';
import useDiagramStore from '../../hooks/useDiagramStore';
import useLinter from '../../hooks/useLinter';
import { getServiceById } from '../../data/awsServices';

import DotField from '../landing/DotField';

const edgeTypes = { custom: CustomEdge };

let nodeIdCounter = 0;

export default function DesignerCanvas() {
  const reactFlowWrapper = useRef(null);
  
  // Ref-based fullscreen (user’s preferred approach)
  const enterFullscreen = () => {
    const el = reactFlowWrapper.current;
    if (!el) return;
    if (el.requestFullscreen) el.requestFullscreen();
  };

  const reactFlowInstance = useRef(null);
  const { screenToFlowPosition } = useReactFlow();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isReady, setIsReady] = useState(false);

  // Global state
  const nodes = useDiagramStore((s) => s.nodes);
  const edges = useDiagramStore((s) => s.edges);
  const viewport = useDiagramStore((s) => s.viewport);
  const diagramId = useDiagramStore((s) => s.diagramId);
  const isViewMode = useDiagramStore((s) => s.isViewMode);
  const isPublicView = useDiagramStore((s) => s.isPublicView); // ← needed for guard

  const onNodesChange = useDiagramStore((s) => s.onNodesChange);
  const onEdgesChange = useDiagramStore((s) => s.onEdgesChange);
  const onConnect = useDiagramStore((s) => s.onConnect);
  const addNode = useDiagramStore((s) => s.addNode);
  const setSelectedNode = useDiagramStore((s) => s.setSelectedNode);

  const { getWarningsForNode } = useLinter();

  // ── Fullscreen entry (only in editor) ──
  useEffect(() => {
    if (isViewMode && !isPublicView) {
      enterFullscreen();
    }
  }, [isViewMode, isPublicView]);

  // ── Handle ESC (exit fullscreen) ──
  useEffect(() => {
    const handleEsc = () => {
      if (!document.fullscreenElement) {
        // Only reset view mode if we're NOT in the public view
        if (!useDiagramStore.getState().isPublicView) {
          useDiagramStore.getState().setViewMode(false);
        }
      }
    };
    document.addEventListener('fullscreenchange', handleEsc);
    return () => document.removeEventListener('fullscreenchange', handleEsc);
  }, []);

  useEffect(() => {
    setIsReady(true);
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // ── Initial fit / viewport restore ──
  const [hasFitted, setHasFitted] = useState(false);
  useEffect(() => {
    setHasFitted(false);
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
  }, [nodes]);

  const nodesWithWarnings = useMemo(() => {
    return (nodes || [])
      .filter((n) => n && n.data)
      .map((n) => ({
        ...n,
        data: {
          ...n.data,
          warnings: isPublicView ? [] : getWarningsForNode(n.id),
        },
      }));
  }, [nodes, getWarningsForNode, isPublicView]);

  const onInit = useCallback((instance) => {
    reactFlowInstance.current = instance;
  }, []);

  const onNodeClick = useCallback((_event, node) => {
    if (!isViewMode) setSelectedNode(node.id);
  }, [setSelectedNode, isViewMode]);

  const onPaneClick = useCallback(() => {
    if (!isViewMode) setSelectedNode(null);
  }, [setSelectedNode, isViewMode]);

  const onDragOver = useCallback((event) => {
    if (!isViewMode) event.preventDefault();
  }, [isViewMode]);

  const onDrop = useCallback(
    (event) => {
      if (isViewMode) return;
      event.preventDefault();

      const serviceId = event.dataTransfer.getData('application/infrasketch-service');
      if (!serviceId) return;

      const service = getServiceById(serviceId);
      if (!service) return;

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
    [addNode, screenToFlowPosition, isViewMode]
  );

  return (
    <div className="canvas-wrapper" ref={reactFlowWrapper} style={{ position: 'relative' }}>
      <style dangerouslySetInnerHTML={{
        __html: `
        .react-flow__controls {
          background-color: rgba(10, 10, 10, 0.6) !important;
          backdrop-filter: blur(12px) !important;
          border: 1px solid rgba(255, 255, 255, 0.08) !important;
          border-radius: 12px !important;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4) !important;
          display: flex !important;
          flex-direction: row !important; 
          padding: 4px !important;
          gap: 4px !important;
          margin: 0 !important;
        }
        .react-flow__controls-button {
          background-color: transparent !important;
          border: 1px solid transparent !important;
          border-radius: 8px !important;
          color: #888 !important;
          width: 32px !important;
          height: 32px !important;
          display: flex !important;
          justify-content: center !important;
          align-items: center !important;
          transition: all 0.2s ease !important;
          cursor: pointer !important;
          border-bottom: none !important;
        }
        .react-flow__controls-button:hover {
          background-color: rgba(255, 92, 0, 0.1) !important;
          color: #FF5C00 !important;
        }
        .react-flow__controls-button svg {
          fill: currentColor !important;
          width: 15px !important;
          height: 15px !important;
        }
      `}} />

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
          proOptions={{ hideAttribution: true }}
          nodesDraggable={!isViewMode}
          nodesConnectable={!isViewMode}
          elementsSelectable={!isViewMode}
          zoomOnScroll={true}
          zoomOnPinch={true}
          panOnDrag={true}
          zoomOnDoubleClick={!isViewMode}
          deleteKeyCode={isViewMode ? null : ['Backspace', 'Delete']}
        >
          <Background
            variant={BackgroundVariant.Dots}
            gap={20}
            size={1}
            color="#333"
          />

          {!isViewMode && (
            <>
              <Controls
                position="bottom-left"
                style={{ left: '350px', bottom: '24px', margin: 0 }}
              />

              <MiniMap
                position="bottom-right"
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
                maskColor="rgba(0, 0, 0, 0.6)"
                style={{
                  width: 200,
                  height: 140,
                  right: '350px',
                  bottom: '24px',
                  background: 'rgba(10,10,10,0.6)',
                  backdropFilter: 'blur(12px)',
                }}
                className="border border-white/10 rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.5)] !m-0"
              />
            </>
          )}
        </ReactFlow>
      </div>

      {/* Only show these overlays in editor view mode (not public) */}
      {isViewMode && !isPublicView && (
        <>
          <div className="fixed top-4 right-4 z-[9999]">
            <button
              onClick={() => {
                useDiagramStore.getState().setViewMode(false);
                if (document.fullscreenElement) {
                  document.exitFullscreen();
                }
              }}
              className="px-4 py-2 bg-[#FF5C00] text-black rounded-lg text-sm font-medium shadow-lg"
            >
              Exit View
            </button>
          </div>

          <div className="fixed bottom-4 left-4 text-xs text-white/50 z-[9999]">
            Press ESC to exit
          </div>
        </>
      )}
    </div>
  );
}