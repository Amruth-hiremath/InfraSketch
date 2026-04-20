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
      const result = await signInWithPopup(firebaseAuth, provider);
      const token = await result.user.getIdToken();
      const success = await firebaseLogin(token);
      if (success) onClose();
    } catch (err) {
      console.error('GitHub sign-in failed:', err);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal auth-modal" onClick={(e) => e.stopPropagation()}>
        
        {/* Close Button */}
        <button className="modal__close" onClick={onClose}>
          <X size={18} />
        </button>

        {/* Header */}
        <div className="auth-modal__header">
          <div className="auth-modal__logo">
            <img
                            src="/InfraSketch.png"
                            alt="InfraSketch Logo"
                            className="w-25 h-25 object-contain rounded-md"
                        />
          </div>
          <h2>Welcome</h2>
          <p>Sign in to continue</p>
        </div>

        {/* Social Login */}
        <div className="auth-modal__social">
          
          {/* Google */}
          <button
            className="auth-modal__social-btn"
            onClick={handleGoogleSignIn}
            disabled={loading}
          >
            <FcGoogle size={20} />
            <span>{loading ? "Connecting..." : "Continue with Google"}</span>
          </button>

          {/* GitHub */}
          <button
            className="auth-modal__social-btn"
            onClick={handleGithubSignIn}
            disabled={loading}
          >
            <FaGithub size={20} />
            <span>{loading ? "Connecting..." : "Continue with GitHub"}</span>
          </button>

        </div>

      </div>
    </div>
  );
}