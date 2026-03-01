'use client';

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
  onChange?: (rating: number) => void;
}

const sizes = {
  sm: 'text-sm gap-0.5',
  md: 'text-lg gap-1',
  lg: 'text-2xl gap-1.5',
};

export default function StarRating({
  rating,
  maxRating = 5,
  size = 'md',
  interactive = false,
  onChange,
}: StarRatingProps) {
  return (
    <div className={`flex items-center ${sizes[size]}`}>
      {Array.from({ length: maxRating }, (_, i) => {
        const starValue = i + 1;
        const isFilled = starValue <= rating;
        const isHalf = !isFilled && starValue - 0.5 <= rating;

        return (
          <button
            key={i}
            type="button"
            disabled={!interactive}
            onClick={() => interactive && onChange?.(starValue)}
            className={`
              transition-colors duration-150
              ${interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'}
              ${isFilled ? 'text-yellow-400' : isHalf ? 'text-yellow-300' : 'text-gray-200'}
            `}
          >
            ★
          </button>
        );
      })}
    </div>
  );
}
