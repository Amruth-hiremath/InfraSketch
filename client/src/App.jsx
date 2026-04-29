import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import DesignerCanvas from './components/canvas/DesignerCanvas';
import ComponentPalette from './components/sidebar/ComponentPalette';
import PropertyInspector from './components/inspector/PropertyInspector';
import TopToolbar from './components/toolbar/TopToolbar';
import AuthModal from './components/auth/AuthModal';
import LinterPanel from './components/linter/LinterPanel';

import useAuthStore from './hooks/useAuth';
import useDiagramStore from './hooks/useDiagramStore';

import { ReactFlowProvider } from '@xyflow/react';

import Toast from './components/Toast';
import Modal from './components/Modal';
import PublicView from './pages/PublicView';

import './App.css';


const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
};


const EditorLayout = () => {
  const isViewMode = useDiagramStore((s) => s.isViewMode);

  return (
    <div className="app">
      <div className="app__canvas-area">
        <DesignerCanvas />
        <LinterPanel />
      </div>

      <div className="app__workspace pointer-events-none [&>*]:pointer-events-auto">
        {!isViewMode && <ComponentPalette />}
        {!isViewMode && <PropertyInspector />}
      </div>

      <div className="pointer-events-auto z-[100]">
        {!isViewMode && <TopToolbar />}
      </div>
    </div>
  );
};


const AppContent = () => {
  const { isAuthenticated, user } = useAuthStore();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const pageVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 }
  };

  const pageTransition = {
    duration: 0.35,
    ease: [0.25, 0.8, 0.25, 1]
  };

  return (
    <>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>

          {/* Landing */}
          <Route
            path="/"
            element={
              <motion.div
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={pageTransition}
                className="h-full"
              >
                <Landing
                  onLaunch={() => isAuthenticated ? navigate('/dashboard') : setIsAuthModalOpen(true)}
                  onSignIn={() => isAuthenticated ? navigate('/dashboard') : setIsAuthModalOpen(true)}
                  isAuthenticated={isAuthenticated}
                  user={user}
                />
              </motion.div>
            }
          />

          {/* Dashboard */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <motion.div
                  variants={pageVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={pageTransition}
                  className="h-full"
                >
                  <Dashboard />
                </motion.div>
              </ProtectedRoute>
            }
          />

          {/* App (Canvas) */}
          <Route
            path="/app"
            element={
              <ProtectedRoute>
                <motion.div
                  variants={pageVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={pageTransition}
                  className="h-full"
                >
                  <ReactFlowProvider>
                    <EditorLayout />
                  </ReactFlowProvider>
                </motion.div>
              </ProtectedRoute>
            }
          />

          <Route
            path="/view/:id"
            element={
              <motion.div
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={pageTransition}
                className="h-full"
              >
                <ReactFlowProvider>
                  <PublicView />
                </ReactFlowProvider>
              </motion.div>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />

        </Routes>
      </AnimatePresence>


      <AnimatePresence>
        {isAuthModalOpen && !isAuthenticated && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xl"
            onClick={() => setIsAuthModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.92, y: 30, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.92, y: 20, opacity: 0 }}
              transition={{ type: "spring", stiffness: 220, damping: 18 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md rounded-3xl p-6 bg-white/5 backdrop-blur-2xl border border-white/10 shadow-[0_20px_80px_rgba(0,0,0,0.6)] relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#FF5C00]/10 via-transparent to-transparent pointer-events-none" />
              <AuthModal onClose={() => setIsAuthModalOpen(false)} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};


export default function App() {
  const { fetchUser, loading } = useAuthStore();

  useEffect(() => {
  const init = async () => {
    try {
      await fetchUser();
    } catch (err) {
      console.error("Auth check failed");
    }
  };

  init();
}, [fetchUser]);

  if (loading) {
    return (
      <div className="h-screen w-screen bg-black flex items-center justify-center text-white font-mono text-sm">
        Initializing Workspace...
      </div>
    );
  }

  return (
    <Router>
      <Toast />
      <Modal />
      <AppContent />
    </Router>
  );
}