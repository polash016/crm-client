"use client";

const SidebarSkeleton = () => {
  return (
    <div className="relative h-full px-4 py-6 min-h-screen flex flex-col items-stretch bg-white shadow-lg">
      {/* Logo/Title Skeleton */}
      <div className="text-center mt-4 mb-8">
        <div className="h-10 w-[70%] bg-slate-200 rounded-lg mx-auto animate-pulse"></div>
      </div>

      {/* Menu Items Skeleton */}
      <div className="flex flex-col gap-3 px-2">
        {/* Parent Menu Items */}
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <div key={item} className="space-y-3">
            {/* Parent Item */}
            <div className="flex items-center gap-4 p-3 rounded-lg bg-slate-200/70 animate-pulse">
              <div className="w-7 h-7 rounded-md bg-slate-300"></div>
              <div className="flex-1 h-5 bg-slate-300 rounded"></div>
              {item % 2 === 0 && (
                <div className="w-5 h-5 rounded-full bg-slate-300"></div>
              )}
            </div>

            {/* Child Items (randomly show for some parents) */}
            {item % 2 === 0 && (
              <div className="pl-8 space-y-3">
                {[1, 2, 3].map((child) => (
                  <div
                    key={child}
                    className="flex items-center gap-4 p-3 rounded-lg bg-slate-200/50 animate-pulse"
                  >
                    <div className="w-6 h-6 rounded-md bg-slate-300/50"></div>
                    <div className="flex-1 h-4 bg-slate-300/50 rounded"></div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Shimmer Effect Container */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-[shimmer_2s_infinite] transform"></div>
      </div>
    </div>
  );
};

export default SidebarSkeleton;
