import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Download, Upload, Image, Plus, FileJson, Home,
  ChevronDown, Pencil, Save, FolderOpen
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import useDiagramStore from '../../hooks/useDiagramStore';
import { saveDiagram } from '../../api/diagramsApi';
import useAuthStore from '../../hooks/useAuth';
import CostWidget from './CostWidget';
import { exportCanvasAsPNG, exportDiagramAsJSON, importDiagramFromJSON } from '../../utils/exportUtils';
import { createTemplate } from '../../api/templatesApi';
import { useToast } from '../../hooks/useToast';

export default function TopToolbar() {
  const navigate = useNavigate(); // FIX: To make the Home button work

  const diagramName = useDiagramStore((s) => s.diagramName);
  const setDiagramMeta = useDiagramStore((s) => s.setDiagramMeta);
  const getDiagramJSON = useDiagramStore((s) => s.getDiagramJSON);
  const loadDiagram = useDiagramStore((s) => s.loadDiagram);
  const clearDiagram = useDiagramStore((s) => s.clearDiagram);

  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const fileInputRef = useRef(null);

  const [editingName, setEditingName] = useState(false);
  const [exportMenuOpen, setExportMenuOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState('');


  const isViewMode = useDiagramStore((s) => s.isViewMode);
  const setViewMode = useDiagramStore((s) => s.setViewMode);


  const handleSave = async () => {
    if (!isAuthenticated) {
      useToast.getState().addToast({
        message: "Template saved!",
        type: "success"
      });
      return;
    }

    setIsSaving(true);
    setSaveStatus('');

    try {
      const payload = getDiagramJSON();
      const savedData = await saveDiagram(payload);

      // FIX: Capture the MongoDB _id so we don't create multiple copies
      if (!payload.id && savedData.diagram && savedData.diagram._id) {
        setDiagramMeta({ id: savedData.diagram._id });
      }

      setSaveStatus('success');
      setTimeout(() => setSaveStatus(''), 3000);
    } catch (error) {
      console.error("Save failed:", error);
      setSaveStatus('error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveTemplate = async () => {
    const { nodes, edges, viewport } = useDiagramStore.getState();

    // Ask user for name
    const name = prompt("Template name:");
    if (!name) return;

    try {
      await createTemplate({
        name,
        description: "",
        nodes,
        edges,
        viewport
      });

      useToast.getState().addToast({
        message: "Template saved!",
        type: "success"
      });
    } catch (err) {
      console.error("Template save failed:", err);
      useToast.getState().addToast({
        message: "Failed to save template!",
        type: "error"
      });
    }
  };

  const handleExportPNG = async () => {
    setExportMenuOpen(false);
    try { await exportCanvasAsPNG(); } catch (err) { console.error('PNG export failed:', err); }
  };

  const handleExportJSON = () => {
    setExportMenuOpen(false);
    const data = getDiagramJSON();
    exportDiagramAsJSON(data);
  };

  const handleImportJSON = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const data = await importDiagramFromJSON(file);
      const cleanedData = {
        ...data,
        id: null,
      };

      loadDiagram(cleanedData);

      useToast.getState().addToast({
        message: "Diagram imported. Save to create a new one.",
        type: "info"
      });
    } catch (err) {
      console.error('Import failed:', err);
    }
    event.target.value = '';
  };

  return (
    <div className="toolbar">
      <div className="toolbar__left">
        {/* FIX: Home Button navigation */}
        <button
          onClick={() => navigate('/dashboard')}
          className="toolbar__icon-btn"
          title="Back to Home"
        >
          <Home size={15} />
        </button>

        <div className="toolbar__divider" />

        {editingName ? (
          <input
            autoFocus
            type="text"
            className="toolbar__diagram-name toolbar__diagram-name--editing"
            value={diagramName}
            onChange={(e) => setDiagramMeta({ name: e.target.value })}
            onBlur={() => setEditingName(false)}
            onKeyDown={(e) => e.key === 'Enter' && setEditingName(false)}
            placeholder="Untitled Architecture"
          />
        ) : (
          <button
            className="toolbar__name-display"
            onClick={() => setEditingName(true)}
            title="Rename diagram"
          >
            <span>{diagramName || 'Untitled Architecture'}</span>
            <Pencil size={11} className="toolbar__name-edit-icon" />
          </button>
        )}
      </div>

      <div className="toolbar__center">
        <CostWidget />
      </div>

      <div className="toolbar__right">
        <button onClick={clearDiagram} className="toolbar__btn" title="New diagram">
          <Plus size={14} />
          <span>New</span>
        </button>

        <button
          onClick={handleSave}
          disabled={isSaving}
          className={`toolbar__btn ${isSaving ? 'opacity-50 cursor-not-allowed' :
            saveStatus === 'success' ? 'bg-green-500 text-black' :
              saveStatus === 'error' ? 'bg-red-500 text-white' : ''
            }`}
          title="Save diagram"
        >
          <Save size={14} />
          <span>
            {isSaving ? 'Saving...' : saveStatus === 'success' ? 'Saved!' : saveStatus === 'error' ? 'Error' : 'Save'}
          </span>
        </button>

        <button
          onClick={handleSaveTemplate}
          className="
    flex items-center gap-2
    px-3 py-1.5
    rounded-lg
    text-sm font-medium
    text-[#FF5C00]
    bg-[#FF5C00]/10
    border border-[#FF5C00]/20
    hover:bg-[#FF5C00]/20
    transition-all
  "
        >
          Save as Template
        </button>

        <button onClick={() => fileInputRef.current?.click()} className="toolbar__icon-btn" title="Import JSON">
          <FolderOpen size={15} />
        </button>

        <div className="toolbar__export-wrap">
          <button onClick={() => setExportMenuOpen(!exportMenuOpen)} className="toolbar__btn" title="Export">
            <Upload size={14} />
            <span>Export</span>
            <ChevronDown size={11} className={`transition-transform ${exportMenuOpen ? 'rotate-180' : ''}`} />
          </button>

          <AnimatePresence>
            {exportMenuOpen && (
              <>
                <div className="toolbar__export-backdrop" onClick={() => setExportMenuOpen(false)} />
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.96 }}
                  transition={{ duration: 0.15 }}
                  className="toolbar__export-menu"
                >
                  <button onClick={handleExportJSON} className="toolbar__export-item">
                    <FileJson size={14} className="text-[#FF5C00]" />
                    <div>
                      <div className="font-semibold text-white">Export JSON</div>
                      <div className="text-[10px] text-[#555] font-mono">Architecture graph state</div>
                    </div>
                  </button>
                  <button onClick={handleExportPNG} className="toolbar__export-item">
                    <Image size={14} className="text-[#3b82f6]" />
                    <div>
                      <div className="font-semibold text-white">Export PNG</div>
                      <div className="text-[10px] text-[#555] font-mono">High-res canvas snapshot</div>
                    </div>
                  </button>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
        <button
          onClick={() => {
            const id = useDiagramStore.getState().diagramId;

            if (!id) {
              useToast.getState().addToast({
                message: "Save diagram first",
                type: "error"
              });
              return;
            }

            const url = `${window.location.origin}/view/${id}`;
            navigator.clipboard.writeText(url);

            useToast.getState().addToast({
              message: "Link copied!",
              type: "success"
            });
          }}
          className="toolbar__btn"
        >
          Share
        </button>
        <button
          onClick={() => setViewMode(!isViewMode)}
          className="px-4 py-2 rounded-lg text-sm font-medium 
           bg-white/5 border border-white/10 
           text-white hover:border-[#FF5C00]/40 
           hover:text-[#FF5C00] transition"
        >
          {isViewMode ? "Exit View" : "View Mode"}
        </button>
        <input ref={fileInputRef} type="file" accept=".json" onChange={handleImportJSON} className="toolbar__file-input" />
      </div>
    </div>
  );
}