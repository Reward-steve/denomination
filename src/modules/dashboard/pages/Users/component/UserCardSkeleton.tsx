
const UserCardSkeleton = ({items=8}) => {
  return (
    <div className="grid gap-3 sm:gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 ">
      {[...Array(items)].map((_,i) => (
        <div key={i} className="bg-surface rounded-lg overflow-hidden animate-pulse">
          <div className="w-full h-48 bg-surface"></div>
          <div className="p-4">
            <div className="h-4 bg-background rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-background rounded w-1/2"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default UserCardSkeleton;
