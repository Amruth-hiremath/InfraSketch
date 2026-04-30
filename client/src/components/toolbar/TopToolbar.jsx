import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPortal } from 'react-dom';
import {
  Download, Upload, Image, Plus, FileJson, Home,
  ChevronDown, Pencil, Save, FolderOpen
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import useDiagramStore from '../../hooks/useDiagramStore';
import { toggleDiagramVisibility, saveDiagram } from '../../api/diagramsApi';
import useAuthStore from '../../hooks/useAuth';
import CostWidget from './CostWidget';
import { exportCanvasAsPNG, exportDiagramAsJSON, importDiagramFromJSON } from '../../utils/exportUtils';
import { createTemplate } from '../../api/templatesApi';
import { useToast } from '../../hooks/useToast';
import ShareModal from '../modals/ShareModal';

export default function TopToolbar() {
  const navigate = useNavigate();

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

  const isPublic = useDiagramStore((s) => s.isPublic);
  const setIsPublic = useDiagramStore((s) => s.setIsPublic);
  const diagramId = useDiagramStore((s) => s.diagramId);

  const isViewMode = useDiagramStore((s) => s.isViewMode);
  const setViewMode = useDiagramStore((s) => s.setViewMode);

  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [templateName, setTemplateName] = useState("");

  const [shareOpen, setShareOpen] = useState(false);


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

  const handleShare = async () => {
    const { diagramId, isPublic } = useDiagramStore.getState();

    if (!diagramId) {
      useToast.getState().addToast({
        message: "Save diagram first",
        type: "error"
      });
      return;
    }

    try {
      let publicStatus = isPublic;

      // If not public → make it public first
      if (!isPublic) {
        const res = await toggleDiagramVisibility(diagramId);
        useDiagramStore.getState().setIsPublic(res.isPublic);
      }

      // Now generate share link
      const url = `${window.location.origin}/view/${diagramId}`;

      await navigator.clipboard.writeText(url);

      useToast.getState().addToast({
        message: "Share link copied!",
        type: "success"
      });

    } catch (err) {
      console.error(err);
      useToast.getState().addToast({
        message: "Failed to share diagram",
        type: "error"
      });
    }
  };

  const handleToggleVisibility = async () => {
    if (!diagramId) {
      useToast.getState().addToast({
        message: "Save diagram first",
        type: "error"
      });
      return;
    }

    try {
      const res = await toggleDiagramVisibility(diagramId);
      setIsPublic(res.isPublic);

      useToast.getState().addToast({
        message: res.isPublic ? "Diagram is now Public" : "Diagram is now Private",
        type: "success"
      });

    } catch (err) {
      useToast.getState().addToast({
        message: "Failed to update visibility",
        type: "error"
      });
    }
  };

  const handleSaveTemplate = () => {
    setShowTemplateModal(true);
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

  const confirmSaveTemplate = async () => {
    const name = templateName.trim();

    if (!name) {
      useToast.getState().addToast({
        message: "Template name cannot be empty",
        type: "error"
      });
      return;
    }

    if (name.length > 100) {
      useToast.getState().addToast({
        message: "Template name too long",
        type: "error"
      });
      return;
    }

    const { nodes, edges, viewport } = useDiagramStore.getState();

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

      setShowTemplateModal(false);
      setTemplateName("");

    } catch (err) {
      console.error("Template save failed:", err);

      useToast.getState().addToast({
        message: err.response?.data?.message || "Failed to save template",
        type: "error"
      });
    }
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
          onClick={async () => {
            const { diagramId, isPublic, setIsPublic } = useDiagramStore.getState();

            if (!diagramId) {
              useToast.getState().addToast({
                message: "Save diagram first",
                type: "error"
              });
              return;
            }

            try {
              if (!isPublic) {
                const res = await toggleDiagramVisibility(diagramId);
                setIsPublic(res.isPublic);
              }

              const url = `${window.location.origin}/view/${diagramId}`;
              await navigator.clipboard.writeText(url);

              useToast.getState().addToast({
                message: "Share link copied!",
                type: "success"
              });

            } catch (err) {
              console.error(err);

              useToast.getState().addToast({
                message: "Failed to share diagram",
                type: "error"
              });
            }
          }}
          className="toolbar__btn"
        >
          {isPublic ? "Copy Link" : "Share"}
        </button>
        <button
          onClick={() => setViewMode(!isViewMode)}
          className="px-4 py-2 rounded-lg text-sm font-medium 
           bg-white/5 border border-white/10 
           text-white hover:border-[#FF5C00]/40 
           hover:text-[#FF5C00] transition"
        >
          {isViewMode ? "Exit Full Screen" : "View Full Screen"}
        </button>
        <div
          onClick={handleToggleVisibility}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg cursor-pointer text-sm font-medium transition-all
    ${isPublic
              ? "bg-green-500/10 text-green-400 border border-green-500/30"
              : "bg-gray-500/10 text-gray-400 border border-gray-500/20"
            }`}
        >
          <span>{isPublic ? "Public" : "Private"}</span>
        </div>
        <input ref={fileInputRef} type="file" accept=".json" onChange={handleImportJSON} className="toolbar__file-input" />
      </div>
      
      {/* Portal to break out of toolbar layout boundaries */}
      {showTemplateModal && createPortal(
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/60 backdrop-blur-sm">

          <div className="bg-[#0a0a0a] border border-[#FF5C00]/20 rounded-xl p-6 w-[380px] shadow-xl">

            <h2 className="text-white text-lg font-semibold mb-4">
              Save as Template
            </h2>

            <input
              type="text"
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
              placeholder="Enter template name..."
              autoFocus
              className="w-full p-3 rounded-lg bg-black border border-gray-700 text-white focus:outline-none focus:border-[#FF5C00]"
            />

            <div className="flex justify-end gap-3 mt-5">
              <button
                onClick={() => setShowTemplateModal(false)}
                className="px-4 py-2 text-sm text-gray-300 hover:text-white"
              >
                Cancel
              </button>

              <button
                onClick={confirmSaveTemplate}
                disabled={!templateName.trim()}
                className={`px-4 py-2 rounded-lg font-semibold
            ${templateName.trim()
                    ? 'bg-[#FF5C00] hover:bg-[#ff7a2a] text-black'
                    : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                  }`}
              >
                Save
              </button>
            </div>

          </div>
        </div>,
        document.body
      )}
    </div>
  );
}