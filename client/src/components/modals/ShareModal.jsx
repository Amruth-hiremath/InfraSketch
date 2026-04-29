import { motion, AnimatePresence } from 'framer-motion';
import useDiagramStore from '../../hooks/useDiagramStore';
import { useToast } from '../../hooks/useToast';

export default function ShareModal({ open, onClose }) {
  const { diagramId, isPublic } = useDiagramStore();

  if (!diagramId) return null;

  const url = `${window.location.origin}/view/${diagramId}`;

  const copyLink = async () => {
    await navigator.clipboard.writeText(url);
    useToast.getState().addToast({
      message: "Link copied!",
      type: "success"
    });
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[9998]"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Modal */}
          <motion.div
            className="fixed z-[9999] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
              w-full max-w-md p-6 rounded-2xl bg-[#0A0A0A] border border-white/10 shadow-2xl"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            <h2 className="text-white text-lg font-bold mb-4">Share Diagram</h2>

            {/* URL box */}
            <div className="bg-black/40 border border-white/10 rounded-lg p-3 text-xs text-white/70 break-all mb-4">
              {url}
            </div>

            {/* Buttons */}
            <div className="flex gap-2">
              <button
                onClick={copyLink}
                className="flex-1 bg-[#FF5C00] text-black font-semibold py-2 rounded-lg"
              >
                Copy Link
              </button>

              <button
                onClick={() => window.open(url, '_blank')}
                className="flex-1 bg-white/10 text-white py-2 rounded-lg"
              >
                Open
              </button>
            </div>

            {/* Status */}
            <div className="mt-4 text-xs text-center">
              {isPublic ? (
                <span className="text-green-400">Public</span>
              ) : (
                <span className="text-gray-400">Private (won’t work)</span>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}