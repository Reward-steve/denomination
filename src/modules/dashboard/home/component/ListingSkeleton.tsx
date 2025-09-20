
const ListingSkeleton = ({ items = 5 }: any) => {
  return (
    <div className="">


      {[...Array(items)].map(() => (<div className="flex justify-between items-center p-3 border rounded-lg mb-2">
        <div className="flex gap-3 justify-center items-center">
          <div className="h-10 w-10 bg-gray-200 rounded animate-pulse"></div>
          <div>
            <div className="h-4 w-40 bg-gray-200 rounded animate-pulse mb-1"></div>
            <div className="h-3 w-24 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
        <div className="h-8 w-[4rem] bg-gray-200 rounded animate-pulse"></div>
      </div>))}
    </div>
  );
};

export default ListingSkeleton;
