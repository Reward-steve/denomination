interface HeaderProps {
  setShowLogin: (value: React.SetStateAction<boolean>) => void;
}

export function Header({ setShowLogin }: HeaderProps) {
  return (
    <header className="absolute top-0 left-0 w-full flex items-center justify-between z-20 p-6">
      <div className="flex items-center">
        <div className="bg-white h-10 w-10 rounded-full mr-2 flex items-center justify-center font-bold text-blue-600 shadow-lg">
          D
        </div>
        <span className="text-white font-bold text-2xl drop-shadow-lg">
          Denomination
        </span>
      </div>
      <button
        onClick={() => setShowLogin(true)}
        className="px-6 py-2 rounded-full text-sm font-semibold text-white bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all duration-300 transform hover:scale-105"
      >
        Login
      </button>
    </header>
  );
}
