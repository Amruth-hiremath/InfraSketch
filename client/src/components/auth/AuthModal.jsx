import { X } from 'lucide-react';
import { FcGoogle } from 'react-icons/fc';
import { FaGithub } from 'react-icons/fa';
import useAuthStore from '../../hooks/useAuth';
import {
  signInWithPopup,
  signInWithRedirect,
  GoogleAuthProvider,
  GithubAuthProvider
} from 'firebase/auth';
import { auth } from '../../config/firebase';

const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

export default function AuthModal({ onClose }) {
  const { firebaseLogin, loading } = useAuthStore();

  const handleGoogleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });

      let result;

      try {
        result = await signInWithPopup(auth, provider);
      } catch (err) {
        if (err.code === "auth/popup-blocked") {
          await signInWithRedirect(auth, provider);
          return;
        }
        throw err;
      }
      const token = await result.user.getIdToken();
      const success = await firebaseLogin(token);

      if (success) onClose();

    } catch (err) {
      console.error("Google sign-in failed:", err);
    }
  };

  const handleGithubSignIn = async () => {
    try {
      const provider = new GithubAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });

      let result;

      try {
        result = await signInWithPopup(auth, provider);
      } catch (err) {
        if (err.code === "auth/popup-blocked") {
          await signInWithRedirect(auth, provider);
          return;
        }
        throw err;
      }

      const token = await result.user.getIdToken();
      const success = await firebaseLogin(token);

      if (success) onClose();

    } catch (err) {
      console.error("GitHub sign-in failed:", err);
    }
  };

  return (
    <div className="flex flex-col relative w-full h-full z-10">

      <button
        className="absolute -top-2 -right-2 p-2 text-white/50 hover:text-white transition-colors"
        onClick={onClose}
      >
        <X size={20} />
      </button>

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

      <div className="mt-8 space-y-3">
        <button
          className="w-full flex items-center justify-center gap-3 py-3.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors"
          onClick={handleGoogleSignIn}
          disabled={loading}
        >
          <FcGoogle size={20} />
          <span className="text-white font-medium text-sm">
            {loading ? "Connecting..." : "Continue with Google"}
          </span>
        </button>

        <button
          className="w-full flex items-center justify-center gap-3 py-3.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors"
          onClick={handleGithubSignIn}
          disabled={loading}
        >
          <FaGithub size={20} className="text-white" />
          <span className="text-white font-medium text-sm">
            {loading ? "Connecting..." : "Continue with GitHub"}
          </span>
        </button>
      </div>
    </div>
  );
}