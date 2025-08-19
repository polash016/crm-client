"use client";

const TableSkeleton = ({
  rowCount = 5,
  showImage = true,
  showActions = true,
  middleSection = null,
  headerTitle = "Items",
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Skeleton */}
        <div className="mb-8 animate-pulse">
          <div className="h-10 w-48 bg-slate-200 rounded-lg mb-3"></div>
          <div className="h-6 w-96 bg-slate-200/70 rounded-lg"></div>
        </div>

        {/* Search and Button Skeleton */}
        <div className="flex justify-between items-center mb-8">
          <div className="w-80 h-12 bg-slate-200 rounded-2xl animate-pulse"></div>
          <div className="w-40 h-12 bg-slate-200 rounded-2xl animate-pulse"></div>
        </div>

        {/* Table Skeleton */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-white/20 shadow-sm overflow-hidden">
          {/* Table Header */}
          <div className="px-6 py-4 border-b border-slate-200/50">
            <div className="flex items-center justify-between">
              <div className="h-6 w-32 bg-slate-200 rounded-lg animate-pulse"></div>
              <div className="h-6 w-24 bg-slate-200 rounded-lg animate-pulse"></div>
            </div>
          </div>

          {/* Table Content */}
          <div className="divide-y divide-slate-200/50">
            {[...Array(rowCount)].map((_, index) => (
              <div key={index} className="px-6 py-4 relative overflow-hidden">
                <div className="flex items-center justify-between">
                  {/* Item Details Skeleton */}
                  <div className="flex items-center space-x-4 animate-pulse">
                    <div className="w-12 h-12 bg-slate-200 rounded-xl"></div>
                    <div>
                      <div className="h-5 w-48 bg-slate-200 rounded-lg mb-2"></div>
                      <div className="h-4 w-32 bg-slate-200/70 rounded-lg"></div>
                    </div>
                  </div>

                  {/* Middle Section if provided */}
                  {middleSection && (
                    <div className="animate-pulse">
                      {typeof middleSection === "function"
                        ? middleSection()
                        : middleSection}
                    </div>
                  )}

                  {/* Image Section */}
                  {showImage && (
                    <div className="flex items-center space-x-2 animate-pulse">
                      <div className="w-10 h-10 bg-slate-200 rounded-lg"></div>
                      <div className="w-10 h-10 bg-slate-200 rounded-lg"></div>
                    </div>
                  )}

                  {/* Actions Section */}
                  {showActions && (
                    <div className="flex items-center space-x-2 animate-pulse">
                      <div className="w-8 h-8 bg-slate-200 rounded-lg"></div>
                      <div className="w-8 h-8 bg-slate-200 rounded-lg"></div>
                    </div>
                  )}
                </div>
                {/* Shimmer Effect */}
                <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white/30 to-70% opacity-40 animate-[shimmer_2s_infinite]"></div>
              </div>
            ))}
          </div>

          {/* Pagination Skeleton */}
          <div className="px-6 py-4 border-t border-slate-200/50 bg-slate-50/30">
            <div className="flex items-center justify-between animate-pulse">
              <div className="h-5 w-72 bg-slate-200 rounded-lg"></div>
              <div className="flex items-center space-x-2">
                <div className="h-8 w-24 bg-slate-200 rounded-lg"></div>
                <div className="h-8 w-8 bg-slate-200 rounded-lg"></div>
                <div className="h-8 w-24 bg-slate-200 rounded-lg"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TableSkeleton;
