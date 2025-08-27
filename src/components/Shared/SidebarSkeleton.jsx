"use client";

const SidebarSkeleton = () => {
  return (
    <div className="relative h-full px-0 py-2 min-h-screen flex flex-col items-stretch bg-gradient-to-b from-slate-800 via-slate-700 to-slate-900 border-r border-slate-600/20">
      {/* Logo Section Skeleton */}
      <div className="text-center mt-4 mb-8 px-4">
        <div className="h-16 w-48 bg-slate-600 rounded-xl mx-auto animate-pulse mb-2"></div>
        <div className="h-4 w-32 bg-slate-600/70 rounded-lg mx-auto animate-pulse"></div>
      </div>

      {/* User Info Section Skeleton */}
      <div className="mx-2 mb-3 p-3 bg-slate-700/30 border border-slate-600/20 rounded-lg animate-pulse">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-slate-600 rounded-full animate-pulse"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 w-24 bg-slate-600 rounded animate-pulse"></div>
            <div className="h-3 w-20 bg-slate-600/70 rounded animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Divider Skeleton */}
      <div className="mx-2 mb-2 h-px bg-slate-600/30"></div>

      {/* Navigation Items Skeleton */}
      <div className="flex flex-col gap-2 px-2 flex-1">
        {/* Main Navigation Items */}
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <div key={item} className="space-y-2">
            {/* Main Item */}
            <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-700/50 animate-pulse">
              <div className="w-6 h-6 rounded-md bg-slate-500"></div>
              <div className="flex-1 h-4 bg-slate-500 rounded"></div>
              {item % 3 === 0 && (
                <div className="w-4 h-4 rounded-full bg-slate-500"></div>
              )}
            </div>

            {/* Sub Items (show for some main items) */}
            {item % 2 === 0 && (
              <div className="pl-8 space-y-2">
                {[1, 2].map((child) => (
                  <div
                    key={child}
                    className="flex items-center gap-3 p-2 rounded-lg bg-slate-700/30 animate-pulse"
                  >
                    <div className="w-5 h-5 rounded-md bg-slate-500/70"></div>
                    <div className="flex-1 h-3 bg-slate-500/70 rounded"></div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Footer Section Skeleton */}
      <div className="mt-auto p-2 text-center border-t border-slate-600/20">
        <div className="h-3 w-32 bg-slate-600/70 rounded mx-auto animate-pulse mb-1"></div>
        <div className="h-2 w-16 bg-slate-600/50 rounded mx-auto animate-pulse"></div>
      </div>

      {/* Shimmer Effect Container */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_2s_infinite] transform"></div>
      </div>
    </div>
  );
};

export default SidebarSkeleton;
