export default function ProductsLoading() {
  return (
    <div className="min-h-screen bg-g6">
      {/* Header Skeleton */}
      <div className="pt-[120px] pb-[60px] px-[6%]">
        <div className="animate-pulse space-y-4">
          <div className="h-3 bg-g5 rounded-full w-32" />
          <div className="h-10 bg-g5 rounded-full w-72" />
          <div className="h-4 bg-g5 rounded-full w-96" />
        </div>
      </div>

      {/* Grid Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-8 px-[6%] py-12">
        {/* Sidebar */}
        <aside className="hidden lg:block">
          <div className="bg-white rounded-[20px] p-6 border border-faint animate-pulse space-y-4">
            <div className="h-4 bg-g6 rounded-full w-24" />
            <div className="h-10 bg-g6 rounded-full w-full" />
            <div className="h-4 bg-g6 rounded-full w-20 mt-6" />
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-8 bg-g6 rounded-xl w-full" />
            ))}
          </div>
        </aside>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[18px]">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-[22px] border border-faint overflow-hidden animate-pulse"
            >
              <div className="bg-g5 min-h-[160px]" />
              <div className="p-5 space-y-2">
                <div className="h-3 bg-g6 rounded-full w-1/3" />
                <div className="h-4 bg-g6 rounded-full w-2/3" />
                <div className="h-3 bg-g6 rounded-full w-full" />
                <div className="h-5 bg-g6 rounded-full w-1/2 mt-3" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
