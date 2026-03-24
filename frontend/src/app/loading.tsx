export default function HomeLoading() {
  return (
    <div className="min-h-screen bg-g6">
      {/* Hero Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 px-[6%] pt-[130px] pb-20 gap-10 items-center">
        <div className="animate-pulse space-y-6">
          <div className="h-14 bg-g5 rounded-full w-3/4" />
          <div className="h-8 bg-g5 rounded-full w-1/2" />
          <div className="h-4 bg-g5 rounded-full w-2/3" />
          <div className="h-4 bg-g5 rounded-full w-1/2" />
          <div className="flex gap-3 mt-8">
            <div className="h-12 bg-g5 rounded-full w-40" />
            <div className="h-12 bg-g5 rounded-full w-36" />
          </div>
        </div>
        <div className="hidden md:grid grid-cols-2 grid-rows-2 gap-3.5 min-h-[480px]">
          <div className="row-span-2 rounded-[22px] bg-g5 animate-pulse" />
          <div className="rounded-[22px] bg-g5 animate-pulse" />
          <div className="rounded-[22px] bg-g5 animate-pulse" />
        </div>
      </div>
    </div>
  );
}
