import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info';
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onClose();
    }, 3000); // Toast desaparece después de 3 segundos

    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-blue-500';

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.3 }} // Empieza invisible, abajo y pequeño
          animate={{ opacity: 1, y: 0, scale: 1 }} // Animación de entrada
          exit={{ opacity: 0, y: 20, scale: 0.5 }} // Animación de salida
          className={`fixed bottom-4 right-4 p-4 rounded-md shadow-lg text-white ${bgColor} z-50`}
        >
          <div className="flex items-center">
            <span className="material-icons mr-2">
              {type === 'success' ? 'check_circle' : type === 'error' ? 'error' : 'info'}
            </span>
            <span>{message}</span>
            <button onClick={() => setIsVisible(false)} className="ml-4 text-white opacity-75 hover:opacity-100">
              <span className="material-icons">close</span>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Toast;
