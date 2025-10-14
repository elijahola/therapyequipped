interface SkeletonProps {
  className?: string;
}

export const Skeleton = ({ className = '' }: SkeletonProps) => (
  <div
    className={`animate-pulse bg-gray-200 rounded ${className}`}
    role="status"
    aria-label="Loading..."
  />
);

// Skeleton variants for common use cases
export const ProductCardSkeleton = () => (
  <div className="bg-white rounded-lg overflow-hidden shadow-sm">
    <Skeleton className="aspect-square" />
    <div className="p-4 space-y-3">
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-8 w-1/3" />
      <div className="flex gap-2">
        <Skeleton className="w-8 h-8 rounded-full" />
        <Skeleton className="w-8 h-8 rounded-full" />
        <Skeleton className="w-8 h-8 rounded-full" />
      </div>
      <Skeleton className="h-12 w-full" />
    </div>
  </div>
);

export const CartItemSkeleton = () => (
  <div className="flex gap-4 py-4 border-b border-gray-200">
    <Skeleton className="w-24 h-24 flex-shrink-0 rounded-lg" />
    <div className="flex-1 space-y-2">
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-10 w-32" />
    </div>
    <Skeleton className="h-8 w-20" />
  </div>
);
