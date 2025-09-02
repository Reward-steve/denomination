import { FaPhoneAlt, FaLock, FaTimes } from "react-icons/fa";

interface ModalProps {
  showLogin: boolean;
  handleCloseLogin: () => void;
}

export function Modal({ showLogin, handleCloseLogin }: ModalProps) {
  return (
    <div
      className={`bg-white rounded-2xl p-8 w-11/12 max-w-sm shadow-2xl relative transition-transform duration-300 ease-out ${
        showLogin ? "scale-100" : "scale-95"
      }`}
    >
      {/* Close Button */}
      <button
        onClick={handleCloseLogin}
        aria-label="Close login form"
        className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition-colors"
      >
        <FaTimes className="h-5 w-5" />
      </button>

      {/* Title */}
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Member Login
      </h2>

      {/* Form */}
      <form className="space-y-6">
        {/* Phone */}
        <div className="relative">
          <FaPhoneAlt className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400" />
          <input
            type="tel"
            placeholder="Phone Number"
            aria-label="Phone Number"
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
        </div>

        {/* Password */}
        <div className="relative">
          <FaLock className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400" />
          <input
            type="password"
            placeholder="Password"
            aria-label="Password"
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-semibold py-3 rounded-xl hover:bg-blue-700 transition-colors duration-300"
        >
          Login
        </button>
      </form>
    </div>
  );
}
