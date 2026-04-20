import { useState, useRef } from 'react';
import {
  Download, Upload, Image, LogIn, LogOut, Plus,
  User, FileJson, Home, DollarSign, ChevronDown,
  Pencil, Save, FolderOpen
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import useDiagramStore from '../../hooks/useDiagramStore';
import useAuthStore from '../../hooks/useAuth';
import CostWidget from './CostWidget';
import { exportCanvasAsPNG, exportDiagramAsJSON, importDiagramFromJSON } from '../../utils/exportUtils';

export default function TopToolbar({ onOpenAuth, onNavigateHome }) {
  const diagramName = useDiagramStore((s) => s.diagramName);
  const setDiagramMeta = useDiagramStore((s) => s.setDiagramMeta);
  const getDiagramJSON = useDiagramStore((s) => s.getDiagramJSON);
  const loadDiagram = useDiagramStore((s) => s.loadDiagram);
  const clearDiagram = useDiagramStore((s) => s.clearDiagram);

  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const logout = useAuthStore((s) => s.logout);

  const fileInputRef = useRef(null);
  const [editingName, setEditingName] = useState(false);
  const [exportMenuOpen, setExportMenuOpen] = useState(false);

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
      loadDiagram(data);
    } catch (err) {
      console.error('Import failed:', err);
    }
    event.target.value = '';
  };

  return (
    
    <div className="toolbar">
      
      {/* Left: Brand + Name */}
      <div className="toolbar__left">
        <button
          onClick={onNavigateHome}
          className="toolbar__icon-btn"
          title="Back to Home"
        >
          <Home size={15} />
        </button>

        <div className="toolbar__divider" />

        {/* Diagram name */}
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

      {/* Center: Cost */}
      <div className="toolbar__center">
        <CostWidget />
      </div>

      {/* Right: Actions + Auth */}
      <div className="toolbar__right">
        <button
          onClick={clearDiagram}
          className="toolbar__btn"
          title="New diagram"
        >
          <Plus size={14} />
          <span>New</span>
        </button>

        <button
          onClick={() => fileInputRef.current?.click()}
          className="toolbar__icon-btn"
          title="Import JSON"
        >
          <FolderOpen size={15} />
        </button>

        {/* Export dropdown */}
        <div className="toolbar__export-wrap">
          <button
            onClick={() => setExportMenuOpen(!exportMenuOpen)}
            className="toolbar__btn"
            title="Export"
          >
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

        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleImportJSON}
          className="toolbar__file-input"
        />
      </div>
    </div>
  );
}