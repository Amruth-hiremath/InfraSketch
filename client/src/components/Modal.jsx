import { useModal } from '../hooks/useModal';
import { motion, AnimatePresence } from 'framer-motion';

export default function Modal() {
  const { modal, closeModal } = useModal();

  if (!modal) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={closeModal}
      >
        <motion.div
          onClick={(e) => e.stopPropagation()}
          initial={{ scale: 0.9, y: 30, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.9, y: 20, opacity: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 18 }}
          className="w-full max-w-sm p-6 rounded-2xl bg-[#0A0A0A] border border-white/10 shadow-xl"
        >
          <h2 className="text-lg font-bold mb-3 text-white">
            {modal.title}
          </h2>

          <p className="text-sm text-[#888] mb-4">
            {modal.message}
          </p>

          {modal.input && (
            <input
              autoFocus
              defaultValue={modal.defaultValue}
              onChange={(e) => modal.setInput(e.target.value)}
              className="w-full px-3 py-2 rounded-md bg-[#111] border border-white/10 text-white mb-4 outline-none"
            />
          )}

          <div className="flex justify-end gap-3">
            <button
              onClick={closeModal}
              className="px-3 py-1.5 text-sm text-[#aaa] hover:text-white"
            >
              Cancel
            </button>

            <button
              onClick={modal.onConfirm}
              className="px-4 py-1.5 text-sm font-bold bg-[#FF5C00] text-black rounded-md"
            >
              Confirm
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}