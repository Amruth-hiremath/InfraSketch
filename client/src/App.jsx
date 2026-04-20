import { useState, useEffect } from 'react';
import { ReactFlowProvider } from '@xyflow/react';
import DesignerCanvas from './components/canvas/DesignerCanvas';
import ComponentPalette from './components/sidebar/ComponentPalette';
import PropertyInspector from './components/inspector/PropertyInspector';
import TopToolbar from './components/toolbar/TopToolbar';
import LinterPanel from './components/linter/LinterPanel';
import AuthModal from './components/auth/AuthModal';
import useAuthStore from './hooks/useAuth';
import Landing from './pages/Landing';
import './App.css';

function App() {
  const [showAuth, setShowAuth] = useState(false);
  const [inWorkspace, setInWorkspace] = useState(false);

  const fetchUser = useAuthStore((s) => s.fetchUser);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    if (isAuthenticated) {
      fetchUser();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  if (!inWorkspace) {
    return (
      <>
        <Landing
          onLaunch={() => setInWorkspace(true)}
          onSignIn={() => setShowAuth(true)}
          isAuthenticated={isAuthenticated}
          user={user}
        />
        {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
      </>
    );
  }

  return (
    <ReactFlowProvider>
      <div className="app bg-[#000000] text-gray-200">
        <TopToolbar
          onOpenAuth={() => setShowAuth(true)}
          onNavigateHome={() => setInWorkspace(false)}
        />

        <div className="app__workspace border-t border-white/5">
          <ComponentPalette />

          <div className="app__canvas-area bg-[#0A0A0A]">
            <DesignerCanvas />
            <LinterPanel />
          </div>

          <PropertyInspector />
        </div>

        {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
      </div>
    </ReactFlowProvider>
  );
}

export default App;
