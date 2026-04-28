import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { updateDiagramName, deleteDiagram, getUserDiagrams, getDiagramById } from '../api/diagramsApi';
import useDiagramStore from '../hooks/useDiagramStore';
import useAuthStore from '../hooks/useAuth';
import { Plus, LayoutTemplate, LogOut, Clock, ArrowLeft, ChevronRight, Box, Activity, Search, Hexagon, Rocket, Server, Database } from 'lucide-react';
import { ARCHITECTURE_TEMPLATES } from '../data/templates';

export default function Dashboard() {
  const [diagrams, setDiagrams] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const searchInputRef = useRef(null);
  const [activeMenu, setActiveMenu] = useState(null);
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const loadDiagram = useDiagramStore((s) => s.loadDiagram);
  const clearDiagram = useDiagramStore((s) => s.clearDiagram);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    const fetchDiagrams = async () => {
      try {
        const data = await getUserDiagrams();
        setDiagrams(data.diagrams || []);
      } catch (error) {
        console.error('Failed to load diagrams');
      } finally {
        setLoading(false);
      }
    };
    fetchDiagrams();
  }, []);

  useEffect(() => {
    const handleClickOutside = () => {
      setActiveMenu(null);
    };

    window.addEventListener("click", handleClickOutside);

    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const handleOpenDiagram = async (selectedDiagram) => {
    try {
      const response = await getDiagramById(selectedDiagram._id);
      const { diagram } = response;

      if (loadDiagram && diagram) {
        loadDiagram({
          id: diagram._id,
          name: diagram.name,
          description: diagram.description,
          nodes: diagram.nodes,
          edges: diagram.edges,
          viewport: diagram.viewport
        });
      }
      navigate('/app');
    } catch (error) {
      console.error('Failed to open diagram:', error);
    }
  };

  const handleCreateNew = () => {
    if (clearDiagram) clearDiagram();
    navigate('/app');
  };

  const handleLoadTemplate = (template) => {
    if (loadDiagram) {
      loadDiagram({
        id: null,
        name: `Copy of ${template.name}`,
        description: template.description,
        nodes: template.nodes,
        edges: template.edges,
        viewport: template.viewport
      });
    }
    navigate('/app');
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleRename = async (diag) => {
    const newName = prompt("Enter new name:", diag.name);
    if (!newName || newName === diag.name) return;

    try {
      const res = await updateDiagramName(diag._id, newName);

      setDiagrams(prev =>
        prev.map(d =>
          d._id === diag._id ? { ...d, name: res.diagram.name } : d
        )
      );
    } catch (err) {
      console.error("Rename failed", err);
    }

    setActiveMenu(null);
  };

  const handleDelete = async (id) => {
    const confirmDelete = confirm("Delete this diagram?");
    if (!confirmDelete) return;

    try {
      await deleteDiagram(id);

      setDiagrams(prev => prev.filter(d => d._id !== id));
    } catch (err) {
      console.error("Delete failed", err);
    }

    setActiveMenu(null);
  };

  const filteredDiagrams = diagrams.filter(diag =>
    diag.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (diag.description && diag.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredTemplates = ARCHITECTURE_TEMPLATES.filter(tpl =>
    tpl.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#000] flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-2 border-[#111] border-t-[#FF5C00] rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#000] text-[#EDEDED] font-sans selection:bg-[#FF5C00]/30 selection:text-[#FF5C00] overflow-hidden relative">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-[#FF5C00]/5 blur-[120px] rounded-full mix-blend-screen" />
        <div style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.03) 1px, transparent 0)', backgroundSize: '32px 32px' }} className="absolute inset-0" />
      </div>

      {/* Floating Nano Nav */}
      <div className="fixed top-0 left-0 right-0 z-50 flex justify-center w-full pt-6 pointer-events-none px-4">
        <motion.nav
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="pointer-events-auto flex items-center justify-between w-full max-w-4xl px-4 py-3 rounded-full bg-[#0A0A0A]/80 backdrop-blur-md border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.6)]"
        >
          <div
            onClick={() => navigate('/')}
            className="flex items-center justify-center cursor-pointer group bg-white/5 hover:bg-white/10 w-11 h-11 rounded-full transition-all border border-white/5 hover:border-white/10 shadow-sm flex-shrink-0"
            title="Return to Landing Page"
          >
            <ArrowLeft size={18} className="text-[#aaa] group-hover:text-white transition-colors" />
          </div>

          <div className="flex items-center flex-1 max-w-xl mx-4 w-full relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-[#FF5C00]/0 via-[#FF5C00]/10 to-[#FF5C00]/0 rounded-full opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
            <div className="flex items-center w-full bg-[#050505] border border-white/10 rounded-full px-5 py-2.5 focus-within:border-[#FF5C00]/50 focus-within:bg-[#080503] focus-within:shadow-[0_0_15px_rgba(255,92,0,0.2)] transition-all z-10 relative">
              <Search size={16} className="text-[#555] group-focus-within:text-[#FF5C00] transition-colors mr-3" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search diagrams..."
                className="bg-transparent border-none outline-none text-sm text-white placeholder-[#555] w-full"
              />
              <div className="flex items-center space-x-1.5 opacity-60 ml-2">
                <span className="flex items-center justify-center min-w-[20px] text-[10px] font-mono font-medium text-[#888] bg-white/5 px-2 py-0.5 rounded border border-white/10">⌘</span>
                <span className="flex items-center justify-center min-w-[20px] text-[10px] font-mono font-medium text-[#888] bg-white/5 px-2 py-0.5 rounded border border-white/10">K</span>
              </div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-2.5 bg-white/5 hover:bg-white/10 px-5 py-2.5 rounded-full transition-all border border-white/5 hover:border-white/10 group flex-shrink-0"
          >
            <span className="text-sm font-bold text-[#aaa] group-hover:text-white transition-colors hidden sm:block">Log Out</span>
            <LogOut size={16} className="text-[#888] group-hover:text-[#FF5C00] transition-colors" />
          </button>
        </motion.nav>
      </div>

      <main className="relative z-10 max-w-5xl mx-auto px-6 pt-36 pb-20">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: "easeOut" }} className="mb-12">
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-[-0.02em] leading-tight mb-3">
            Your Infrastructure, <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF5C00] to-[#FFa066]">Architected.</span>
          </h1>
          <p className="text-[#666] text-lg font-medium max-w-xl">
            Create, analyze, and manage your cloud environments in real-time.
          </p>
        </motion.div>

        {/* =========================================
            SECTION 1: STARTER TEMPLATES & NEW CANVAS
            ========================================= */}
        <section className="mb-16">
          <div className="flex items-center gap-2 mb-6">
            <Rocket size={20} className="text-[#FF5C00]" />
            <h2 className="text-2xl font-bold text-white tracking-tight">Starter Templates</h2>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {/* Create New Card (Always visible) */}
            <motion.div
              variants={itemVariants}
              onClick={handleCreateNew}
              whileHover={{ scale: 1.03, y: -8 }}
              whileTap={{ scale: 0.96 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
              className="group relative h-56 rounded-3xl p-[1px] overflow-hidden cursor-pointer shadow-xl hover:shadow-[0_20px_40px_rgba(255,92,0,0.15)]"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#FF5C00]/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <div className="absolute -inset-2 bg-gradient-to-tr from-[#FF5C00]/20 to-transparent blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

              <div className="absolute inset-[1px] bg-[#060403] rounded-3xl z-10 flex flex-col items-center justify-center transition-colors duration-500 group-hover:bg-[#0b0805]">
                <motion.div
                  className="w-16 h-16 rounded-2xl bg-[#FF5C00]/10 border border-[#FF5C00]/20 flex items-center justify-center mb-4 shadow-[0_0_15px_rgba(255,92,0,0.1)] group-hover:shadow-[0_0_25px_rgba(255,92,0,0.3)] transition-all duration-300"
                  whileHover={{ rotate: 90 }}
                  transition={{ type: "spring", stiffness: 200, damping: 10 }}
                >
                  <Plus className="text-[#FF5C00]" size={30} />
                </motion.div>
                <span className="font-bold text-white text-lg mb-1 group-hover:text-[#FF5C00] transition-colors">New Canvas</span>
                <span className="text-xs text-[#888] font-medium">Start building from scratch</span>
              </div>
            </motion.div>

            {/* Template Cards */}
            {filteredTemplates.map((tpl) => (
              <motion.div
                key={tpl.id}
                variants={itemVariants}
                onClick={() => handleLoadTemplate(tpl)}
                whileHover={{ scale: 1.03, y: -8 }}
                whileTap={{ scale: 0.96 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                className="group relative h-56 rounded-3xl p-[1px] overflow-hidden cursor-pointer shadow-lg hover:shadow-[0_20px_40px_rgba(255,92,0,0.15)]"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-[#FF5C00]/10 opacity-40 group-hover:from-[#FF5C00]/40 group-hover:to-[#FF5C00]/20 transition-all duration-700" />
                <div className="absolute inset-[1px] bg-[#0A0A0A] rounded-3xl z-10 p-6 flex flex-col justify-between transition-colors duration-500 group-hover:bg-[#100c0a]">

                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                    {tpl.id.includes('serverless') ? <Database size={80} /> : <Server size={80} />}
                  </div>

                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                      <motion.div
                        className="p-2.5 rounded-xl bg-[#FF5C00]/10 border border-[#FF5C00]/20 group-hover:border-[#FF5C00]/40 transition-colors"
                        whileHover={{ scale: 1.1, rotate: 10 }}
                      >
                        <Rocket size={18} className="text-[#FF5C00]" />
                      </motion.div>
                      <h3 className="font-bold text-white text-xl truncate pr-2 tracking-tight group-hover:text-[#FF5C00] transition-colors">{tpl.name}</h3>
                    </div>
                    <p className="text-sm text-[#777] line-clamp-2 leading-relaxed font-medium group-hover:text-[#999] transition-colors">
                      {tpl.description}
                    </p>
                  </div>

                  <div className="relative z-10 flex items-center justify-between border-t border-white/5 pt-4 mt-4 text-xs font-bold text-[#FF5C00] uppercase tracking-wider group-hover:border-white/10 transition-colors">
                    <span>Load Template</span>
                    <ChevronRight size={16} />
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* =========================================
            SECTION 2: SAVED DIAGRAMS
            ========================================= */}
        <section>
          <div className="flex items-center gap-2 mb-6 pt-10 border-t border-white/10">
            <LayoutTemplate size={20} className="text-[#888]" />
            <h2 className="text-2xl font-bold text-white tracking-tight">Your Architectures</h2>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredDiagrams.length > 0 ? (
              filteredDiagrams.map((diag) => (
                <motion.div
                  key={diag._id}
                  variants={itemVariants}
                  onClick={() => handleOpenDiagram(diag)}
                  whileHover={{ scale: 1.03, y: -8 }}
                  whileTap={{ scale: 0.96 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  className="group relative h-56 rounded-3xl p-[1px] overflow-hidden cursor-pointer shadow-lg hover:shadow-[0_20px_40px_rgba(0,0,0,0.8)]"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-[#FF5C00]/20 opacity-40 group-hover:from-[#FF5C00]/60 group-hover:to-[#FF5C00]/40 transition-all duration-700" />
                  {/* Top-right menu */}
                  <div className="absolute top-2 right-2 z-20">
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveMenu(diag._id === activeMenu ? null : diag._id);
                      }}
                      className="
      p-2 rounded-lg
      cursor-pointer
      hover:bg-white/10
      transition
    "
                    >
                      <span className="text-lg text-[#888] hover:text-white">⋮</span>
                    </div>

                    {activeMenu === diag._id && (
                      <div
                        onClick={(e) => e.stopPropagation()}
                        className="absolute right-0 mt-2 w-32 bg-[#0A0A0A] border border-white/10 rounded-xl shadow-lg overflow-hidden"
                      >
                        <button
                          onClick={() => handleRename(diag)}
                          className="w-full text-left px-4 py-2 text-sm hover:bg-white/10"
                        >
                          Rename
                        </button>

                        <button
                          onClick={() => handleDelete(diag._id)}
                          className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500/10"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="absolute inset-[1px] bg-[#0A0A0A] rounded-3xl z-10 p-6 flex flex-col justify-between transition-colors duration-500 group-hover:bg-[#100c0a]">
                    <div>
                      <div className="flex items-center gap-3 mb-4">
                        <motion.div
                          className="p-2.5 rounded-xl bg-white/5 border border-white/10 group-hover:border-[#FF5C00]/40 group-hover:bg-[#FF5C00]/10 transition-colors"
                          whileHover={{ scale: 1.1, rotate: -10 }}
                        >
                          <Box size={18} className="text-[#FF5C00]" />
                        </motion.div>
                        <h3 className="font-bold text-white text-xl truncate pr-2 tracking-tight group-hover:text-[#FF5C00] transition-colors">{diag.name}</h3>
                      </div>
                      <p className="text-sm text-[#777] line-clamp-2 leading-relaxed font-medium group-hover:text-[#999] transition-colors">
                        {diag.description || 'Untitled Architecture Draft'}
                      </p>
                    </div>

                    <div className="flex items-center justify-between border-t border-white/5 pt-4 mt-4 text-xs font-bold text-[#555] uppercase tracking-wider group-hover:border-white/10 transition-colors">
                      <div className="flex items-center gap-2">
                        <Clock size={14} className="text-[#444] group-hover:text-[#FF5C00] transition-colors" />
                        {new Date(diag.updatedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>
                      <motion.div
                        initial={{ x: 0, opacity: 0.5 }}
                        whileHover={{ x: 5, opacity: 1 }}
                        className="flex items-center justify-center p-1 rounded-full group-hover:bg-white/5"
                      >
                        <ChevronRight size={16} className="text-[#444] group-hover:text-[#FF5C00] transition-all" />
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              /* Empty State */
              <motion.div variants={itemVariants} className="col-span-1 md:col-span-2 lg:col-span-3 flex flex-col items-center justify-center h-56 border border-white/10 border-dashed rounded-3xl bg-[#0A0A0A]/50">
                {searchQuery ? (
                  <>
                    <Search size={32} className="text-[#444] mb-3" />
                    <h3 className="text-white font-bold text-lg">No diagrams found</h3>
                    <p className="text-[#777] text-sm mt-1">We couldn't find anything matching "{searchQuery}"</p>
                  </>
                ) : (
                  <>
                    <LayoutTemplate size={32} className="text-[#444] mb-3" />
                    <h3 className="text-white font-bold text-lg">No saved architectures</h3>
                    <p className="text-[#777] text-sm mt-1">Start by creating a new canvas or using a template above.</p>
                  </>
                )}
              </motion.div>
            )}
          </motion.div>
        </section>
      </main>
    </div>
  );
}