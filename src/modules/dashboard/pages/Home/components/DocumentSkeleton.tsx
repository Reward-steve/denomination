
const DocumentSkeleton = () => {
  return (
    <div className="p-4 border border-border rounded-lg">
      <div className="flex justify-between items-center mb-2">
        <div className="h-4 w-24 bg-surface rounded animate-pulse"></div>
        <div className="h-3 w-12 bg-surface rounded animate-pulse"></div>
      </div>

      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="flex justify-between items-center p-3 border border-border rounded-lg mb-2"
        >
          <div>
            <div className="h-4 w-32 bg-surface rounded animate-pulse mb-1"></div>
            <div className="h-3 w-24 bg-surface rounded animate-pulse"></div>
          </div>
          <div className="h-8 w-20 bg-surface rounded animate-pulse"></div>
        </div>
      ))}
    </div>
  );
};

export default DocumentSkeleton;
