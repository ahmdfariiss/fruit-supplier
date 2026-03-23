'use client';

import { useToast } from '@/hooks/useToast';
import {
  AlertTriangleIcon,
  CheckCircleIcon,
  CloseIcon,
  InfoIcon,
} from '@/components/ui/icons';

const typeStyles = {
  success: 'bg-g1 text-white',
  error: 'bg-red-500 text-red',
  info: 'bg-blue-500 text-blue',
  warning: 'bg-yellow-500 text-yellow',
};

export default function Toast() {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-11 right-6 z-[1100] flex flex-col gap-3">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`
            flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-lg
            min-w-[280px] max-w-[400px] font-medium text-sm
            animate-in slide-in-from-right fade-in duration-300
            ${typeStyles[toast.type]}
          `}
        >
          <span className="text-lg">
            {toast.type === 'success' && (
              <CheckCircleIcon className="w-5 h-5" />
            )}
            {toast.type === 'error' && <CloseIcon className="w-5 h-5" />}
            {toast.type === 'info' && <InfoIcon className="w-5 h-5" />}
            {toast.type === 'warning' && (
              <AlertTriangleIcon className="w-5 h-5" />
            )}
          </span>
          <p className="flex-1">{toast.message}</p>
          <button
            onClick={() => removeToast(toast.id)}
            className="opacity-70 hover:opacity-100 transition-opacity text-lg"
          >
            <CloseIcon className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
