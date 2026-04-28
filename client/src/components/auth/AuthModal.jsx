import { X } from 'lucide-react';
import { FcGoogle } from 'react-icons/fc';
import { FaGithub } from 'react-icons/fa';
import useAuthStore from '../../hooks/useAuth';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider, GithubAuthProvider } from 'firebase/auth';

// Firebase config
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
};

let firebaseAuth;
try {
  const app = initializeApp(firebaseConfig);
  firebaseAuth = getAuth(app);
} catch (e) {
  console.warn('Firebase init failed:', e.message);
}

export default function AuthModal({ onClose }) {
  const { firebaseLogin, loading } = useAuthStore();

  const handleGoogleSignIn = async () => {
    if (!firebaseAuth) return;
    try {
      const provider = new GoogleAuthProvider();
      // FIX: Force the "Choose an account" screen every single time
      provider.setCustomParameters({ prompt: 'select_account' });
      
      const result = await signInWithPopup(firebaseAuth, provider);
      const token = await result.user.getIdToken();
      const success = await firebaseLogin(token);
      if (success) onClose();
    } catch (err) {
      console.error('Google sign-in failed:', err);
    }
  };

  const handleGithubSignIn = async () => {
    if (!firebaseAuth) return;
    try {
      const provider = new GithubAuthProvider();
      // FIX: Force account selection
      provider.setCustomParameters({ prompt: 'select_account' });

      const result = await signInWithPopup(firebaseAuth, provider);
      const token = await result.user.getIdToken();
      const success = await firebaseLogin(token);
      if (success) onClose();
    } catch (err) {
      console.error('GitHub sign-in failed:', err);
    }
  };

  // FIX: Stripped the double-wrapper divs that were creating the grey bar.
  // The layout/blur is completely handled by App.jsx now.
  return (
    <div className="flex flex-col relative w-full h-full z-10">
      
      {/* Close Button */}
      <button className="absolute -top-2 -right-2 p-2 text-white/50 hover:text-white transition-colors" onClick={onClose}>
        <X size={20} />
      </button>

      {/* Header */}
      <div className="flex flex-col items-center pt-4">
        <div className="mb-4">
          <img
              src="/InfraSketch.png"
              alt="InfraSketch Logo"
              className="w-20 h-20 object-contain rounded-xl shadow-lg"
          />
        </div>
        <h2 className="text-2xl font-bold text-white mb-1">Welcome</h2>
        <p className="text-[#888] text-sm">Sign in to continue</p>
      </div>

      {/* Social Login */}
      <div className="mt-8 space-y-3">
        {/* Google */}
        <button
          className="w-full flex items-center justify-center gap-3 py-3.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors"
          onClick={handleGoogleSignIn}
          disabled={loading}
        >
          <FcGoogle size={20} />
          <span className="text-white font-medium text-sm">{loading ? "Connecting..." : "Continue with Google"}</span>
        </button>

        {/* GitHub */}
        <button
          className="w-full flex items-center justify-center gap-3 py-3.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors"
          onClick={handleGithubSignIn}
          disabled={loading}
        >
          <FaGithub size={20} className="text-white" />
          <span className="text-white font-medium text-sm">{loading ? "Connecting..." : "Continue with GitHub"}</span>
        </button>
      </div>
    </div>
  );
}