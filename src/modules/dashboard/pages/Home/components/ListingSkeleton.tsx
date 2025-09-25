
const ListingSkeleton = ({ items = 5, className = '', borders = true }: any) => {
  return (
    <div className={`${className}`}>


      {[...Array(items)].map((_, i) => (<div key={i} className={`flex justify-between items-center p-3 ${borders?'border border-border':''} rounded-lg mb-2`}>
        <div className="flex gap-3 justify-center items-center">
          <div className="h-10 w-10 bg-text-placeholder rounded animate-pulse"></div>
          <div>
            <div className="h-4 w-40 bg-text-placeholder rounded animate-pulse mb-1"></div>
            <div className="h-3 w-24 bg-text-placeholder rounded animate-pulse"></div>
          </div>
        </div>
        <div className="h-8 w-[4rem] bg-text-placeholder rounded animate-pulse"></div>
      </div>))}
    </div>
  );
};

export default ListingSkeleton;
