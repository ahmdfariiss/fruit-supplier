import StarRating from '@/components/ui/StarRating';

interface ReviewCardProps {
  review: {
    id: string;
    rating: number;
    comment: string | null;
    createdAt: string;
    user: {
      name: string;
    };
  };
}

export default function ReviewCard({ review }: ReviewCardProps) {
  const initials = review.user.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="bg-white rounded-2xl border border-faint p-5">
      <div className="flex items-start gap-3 mb-3">
        {/* Avatar */}
        <div className="w-10 h-10 rounded-full bg-g5 flex items-center justify-center text-g1 font-bold text-sm flex-shrink-0">
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-sm text-ink">{review.user.name}</p>
          <div className="flex items-center gap-2 mt-0.5">
            <StarRating rating={review.rating} size="sm" />
            <span className="text-xs text-muted">
              {new Date(review.createdAt).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })}
            </span>
          </div>
        </div>
      </div>
      {review.comment && (
        <p className="text-sm text-muted leading-relaxed">{review.comment}</p>
      )}
    </div>
  );
}
