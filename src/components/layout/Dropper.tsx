import React, { useEffect, useRef, useState, type ReactElement } from "react";


export const Dropper = ({
  children,
  className,
  trigger,
}: {
  className?: string,
  children: ReactElement[];
  trigger: ReactElement;
}) => {
  const [showing, setShowing] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // toggle dropdown when trigger clicked
  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowing((prev) => !prev);
  };

  // close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setShowing(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);


  return (
    <div className={className} ref={ref}>
      <div className="relative">

        {React.cloneElement(trigger as React.ReactElement<any>, { onClick: handleToggle })}
          <div className={`absolute right-0 top-[100%] w-max bg-surface border border-border rounded-lg shadow-md overflow-hidden animate ${showing?'fadeInDownShort':'fadeInUpShort'}`}>
            {children.map((child, idx) =>
              React.cloneElement(child as React.ReactElement<any>, {
                key: idx,
                onClick: (e: React.MouseEvent) => {
                  (child as any).props.onClick?.(e);
                  setShowing(false);
                },
              })
            )}
          </div>
        
      </div>
    </div>
  );
};

interface ItemProps {
  className?: string;
  children: React.ReactNode;
  [x: string]: any;
}

export const Item = ({ children, className, ...rest }: ItemProps) => {
  return (
    <button
      className={`flex items-center gap-2 w-full px-4 py-2 text-sm text-text hover:bg-accent hover:text-white transition-colors ${className}`}
      {...rest}
    >
      {children}
    </button>
  );

}