import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
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
import './App.css';

// Secure Wrapper for Protected Pages
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  if (!isAuthenticated) return <Navigate to="/" replace />;
  return children;
};

// Layout for the canvas
const EditorLayout = () => {
  return (
    <div className="app">
      <div className="app__canvas-area">
        <DesignerCanvas />
        <LinterPanel />
      </div>
      <div className="app__workspace pointer-events-none [&>*]:pointer-events-auto">
        <ComponentPalette />
        <PropertyInspector />
      </div>
      <div className="pointer-events-auto z-[100]">
        <TopToolbar />
      </div>
    </div>
  );
};

// We create an internal component to utilize the useNavigate hook!
const AppContent = () => {
  const { isAuthenticated, user } = useAuthStore();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      <Routes>
        {/* FIX: The Root URL always serves the Landing Page! */}
        <Route
          path="/"
          element={
            <Landing
              // FIX: If logged in, buttons navigate to Dashboard instead of opening modal
              onLaunch={() => isAuthenticated ? navigate('/dashboard') : setIsAuthModalOpen(true)}
              onSignIn={() => isAuthenticated ? navigate('/dashboard') : setIsAuthModalOpen(true)}
              isAuthenticated={isAuthenticated}
              user={user}
            />
          }
        />

        {/* PROTECTED: Dashboard & App */}
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/app" element={<ProtectedRoute><EditorLayout /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* Global Auth Modal Overlay */}
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
    fetchUser();
  }, [fetchUser]);

  if (loading) {
    return (
      <div className="h-screen w-screen bg-black flex items-center justify-center text-white font-mono text-sm">
        Initializing Workspace...
      </div>
    );
  }

  // Router must be at the very top level
  return (
    <Router>
      <AppContent />
    </Router>
  );
}