'use client';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const getPages = () => {
    const pages: (number | '...')[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push('...');
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      if (currentPage < totalPages - 2) pages.push('...');
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="w-10 h-10 rounded-full flex items-center justify-center
          border border-faint hover:bg-g6 transition-colors
          disabled:opacity-30 disabled:cursor-not-allowed text-sm font-bold"
      >
        ‹
      </button>

      {getPages().map((page, idx) => (
        <button
          key={idx}
          onClick={() => typeof page === 'number' && onPageChange(page)}
          disabled={page === '...'}
          className={`
            w-10 h-10 rounded-full flex items-center justify-center
            text-sm font-bold transition-all duration-200
            ${
              page === currentPage
                ? 'bg-g1 text-white shadow-md'
                : page === '...'
                  ? 'cursor-default text-muted'
                  : 'hover:bg-g6 text-muted hover:text-ink'
            }
          `}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="w-10 h-10 rounded-full flex items-center justify-center
          border border-faint hover:bg-g6 transition-colors
          disabled:opacity-30 disabled:cursor-not-allowed text-sm font-bold"
      >
        ›
      </button>
    </div>
  );
}
