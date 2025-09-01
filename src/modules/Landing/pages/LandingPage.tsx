import { useState, useEffect } from "react";
import { FaPhoneAlt, FaLock, FaTimes } from "react-icons/fa";
import images from "../index";

const App = () => {
  const [current, setCurrent] = useState(0);
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 4000); // smoother 4s per slide
    return () => clearInterval(interval);
  }, []);

  const handleCloseLogin = () => setShowLogin(false);

  return (
    <div className="relative h-screen w-full overflow-hidden font-sans antialiased">
      {/* Background Slideshow */}
      {images.map((img, idx) => (
        <div
          key={idx}
          style={{ backgroundImage: `url(${img})` }}
          className={`absolute inset-0 bg-cover bg-center transition-all duration-[2500ms]  ease-in-out transform ${
            current === idx ? "opacity-100 scale-105" : "opacity-0 scale-100"
          }`}
        />
      ))}

      {/* Darker Overlay for vivid text */}
      <div className="absolute inset-0 bg-[#0000002c]" />

      {/* Header */}
      <header className="absolute top-0 left-0 w-full flex items-center justify-between p-6 z-20">
        <div className="flex items-center">
          <div className="bg-white h-10 w-10 rounded-full mr-2 flex items-center justify-center font-bold text-blue-600 shadow-lg">
            D
          </div>
          <div className="text-white font-bold text-2xl drop-shadow-lg">
            Denomination
          </div>
        </div>
        <button
          onClick={() => setShowLogin(true)}
          className="px-6 py-2 rounded-full text-sm font-semibold text-white bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all duration-300 transform hover:scale-105"
        >
          Login
        </button>
      </header>

      {/* Hero Section */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center text-white px-6">
        <h1 className="text-4xl md:text-6xl font-extrabold mb-4 drop-shadow-2xl animate-fade-in-up">
          Welcome to Our Denomination
        </h1>
        <p className="text-lg md:text-xl max-w-xl animate-fade-in-up animation-delay-300">
          Experience faith, community, and growth like never before.
        </p>
      </div>

      {/* Login Modal */}
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300 ${
          showLogin ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Backdrop */}
        <div
          onClick={handleCloseLogin}
          className="absolute inset-0 bg-black/70 backdrop-blur-sm cursor-pointer"
        />

        {/* Modal */}
        <div
          className={`bg-white rounded-2xl p-8 w-11/12 max-w-sm shadow-2xl relative transition-transform duration-300 ease-out ${
            showLogin ? "scale-100" : "scale-95"
          }`}
        >
          {/* Close Button */}
          <button
            onClick={handleCloseLogin}
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
                type="text"
                placeholder="Phone Number"
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
            </div>

            {/* Password */}
            <div className="relative">
              <FaLock className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                placeholder="Password"
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
      </div>
    </div>
  );
};

export default App;
