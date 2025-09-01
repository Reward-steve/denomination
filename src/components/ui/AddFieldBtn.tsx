import { FaPlus } from "react-icons/fa";
import { useResponsive } from "../../hooks/useResponsive";

type AddFieldBtnType = {
  name: string;
  onClick: () => void;
};

export function AddFieldBtn({ name, onClick }: AddFieldBtnType) {
  const { isMobile } = useResponsive();
  return (
    <button
      onClick={onClick}
      className={`bg-primary hover:bg-secondary text-[#ffff] hover:text-white  transition-colors duration-300 ${
        isMobile
          ? "rounded-full h-8 w-8 p-0 flex items-center justify-center"
          : "rounded-md px-4 py-2"
      }`}
    >
      {!isMobile ? `${name}` : <FaPlus />}
    </button>
  );
}
