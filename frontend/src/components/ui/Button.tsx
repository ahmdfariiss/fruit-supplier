'use client';

import { forwardRef, ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  fullWidth?: boolean;
}

const variants = {
  primary:
    'bg-g1 text-white hover:bg-g2 shadow-md hover:shadow-lg hover:-translate-y-0.5',
  secondary: 'bg-g5 text-g1 hover:bg-g4 border border-g4',
  ghost:
    'bg-transparent text-ink hover:bg-g6 border border-faint hover:border-g2 hover:text-g2',
  danger: 'bg-red-500 text-white hover:bg-red-600 shadow-md',
  outline:
    'bg-transparent text-g1 border-2 border-g1 hover:bg-g1 hover:text-white',
};

const sizes = {
  sm: 'px-4 py-2 text-xs',
  md: 'px-6 py-2.5 text-sm',
  lg: 'px-8 py-3.5 text-base',
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      fullWidth = false,
      className = '',
      children,
      disabled,
      ...props
    },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        className={`
          inline-flex items-center justify-center gap-2 rounded-full font-bold
          transition-all duration-200 font-cabinet disabled:opacity-50
          disabled:cursor-not-allowed disabled:hover:transform-none
          ${variants[variant]} ${sizes[size]}
          ${fullWidth ? 'w-full' : ''}
          ${className}
        `}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && (
          <svg
            className="animate-spin h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
        )}
        {children}
      </button>
    );
  },
);

Button.displayName = 'Button';
export default Button;
