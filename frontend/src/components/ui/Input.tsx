'use client';

import { forwardRef, InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, className = '', id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s/g, '-');

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-semibold text-ink mb-1.5"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`
            w-full px-4 py-3 rounded-2xl border bg-white text-ink
            text-sm font-medium transition-all duration-200
            placeholder:text-muted/50
            focus:outline-none focus:ring-2 focus:ring-g3/30 focus:border-g3
            ${error ? 'border-red-400 focus:ring-red-300/30 focus:border-red-400' : 'border-faint'}
            ${className}
          `}
          {...props}
        />
        {error && (
          <p className="mt-1 text-xs text-red-500 font-medium">{error}</p>
        )}
        {hint && !error && <p className="mt-1 text-xs text-muted">{hint}</p>}
      </div>
    );
  },
);

Input.displayName = 'Input';
export default Input;
