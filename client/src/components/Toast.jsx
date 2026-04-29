import { useToast } from '../hooks/useToast';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, AlertTriangle, Info } from 'lucide-react';

const typeStyles = {
  success: {
    border: "border-green-500/30",
    icon: <CheckCircle className="text-green-400" size={18} />,
  },
  error: {
    border: "border-red-500/30",
    icon: <XCircle className="text-red-400" size={18} />,
  },
  warning: {
    border: "border-yellow-500/30",
    icon: <AlertTriangle className="text-yellow-400" size={18} />,
  },
  info: {
    border: "border-white/10",
    icon: <Info className="text-gray-400" size={18} />,
  },
};

export default function Toast() {
  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed top-6 right-6 z-[999] space-y-3">
      <AnimatePresence>
        {toasts.map((toast) => {
          const style = typeStyles[toast.type] || typeStyles.info;

          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl bg-[#0A0A0A] border ${style.border} shadow-lg min-w-[240px]`}
            >
              {style.icon}

              <span className="text-sm text-white flex-1">
                {toast.message}
              </span>

              <button
                onClick={() => removeToast(toast.id)}
                className="text-xs text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}