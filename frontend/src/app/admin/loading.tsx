export default function AdminLoading() {
  return (
    <div className="animate-pulse">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="h-8 bg-g5 rounded-xl w-32" />
        <div className="h-10 bg-g5 rounded-xl w-40" />
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl border border-faint p-4 mb-5">
        <div className="h-10 bg-g6 rounded-xl" />
      </div>

      {/* Table skeleton */}
      <div className="bg-white rounded-2xl border border-faint overflow-hidden">
        <div className="bg-g6 border-b border-faint px-4 py-3 flex gap-8">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="h-3 bg-g5 rounded-full flex-1" />
          ))}
        </div>
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 px-4 py-4 border-b border-faint/40">
            <div className="w-10 h-10 rounded-xl bg-g6 flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-3.5 bg-g6 rounded-full w-28" />
              <div className="h-2.5 bg-g6 rounded-full w-16" />
            </div>
            <div className="h-3.5 bg-g6 rounded-full w-20" />
            <div className="h-3.5 bg-g6 rounded-full w-24" />
            <div className="h-3.5 bg-g6 rounded-full w-24" />
            <div className="h-5 bg-g6 rounded-full w-16" />
            <div className="h-6 bg-g6 rounded-full w-10" />
            <div className="flex gap-1.5">
              <div className="h-7 bg-g6 rounded-lg w-12" />
              <div className="h-7 bg-g6 rounded-lg w-14" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
