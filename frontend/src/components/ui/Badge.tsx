interface BadgeProps {
  children: React.ReactNode;
  variant?: 'green' | 'yellow' | 'red' | 'blue' | 'gray' | 'orange';
  size?: 'sm' | 'md';
  className?: string;
}

const variantClasses = {
  green: 'bg-g5 text-g1 border-g4',
  yellow: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  red: 'bg-red-50 text-red-600 border-red-200',
  blue: 'bg-blue-50 text-blue-600 border-blue-200',
  gray: 'bg-gray-100 text-gray-600 border-gray-200',
  orange: 'bg-orange-50 text-orange-600 border-orange-200',
};

const sizeClasses = {
  sm: 'px-2 py-0.5 text-[0.65rem]',
  md: 'px-3 py-1 text-xs',
};

export default function Badge({
  children,
  variant = 'green',
  size = 'md',
  className = '',
}: BadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center gap-1 rounded-full font-bold border
        ${variantClasses[variant]} ${sizeClasses[size]} ${className}
      `}
    >
      {children}
    </span>
  );
}
