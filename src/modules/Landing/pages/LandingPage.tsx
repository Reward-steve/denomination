import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import images from "../index";
import { Button } from "../../../components/ui/Button";
import { Modal } from "../components/Modal";
import { Header } from "../components/Header";

const App = () => {
  const [current, setCurrent] = useState(0);
  const [showLogin, setShowLogin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const handleCloseLogin = () => setShowLogin(false);

  return (
    <main className="relative h-screen w-full overflow-hidden font-sans antialiased flex md:justify-start md:items-start sm:justify-center sm:items-center">
      {/* Background Slideshow */}
      {images.map((img, idx) => (
        <div
          key={idx}
          style={{ backgroundImage: `url(${img})` }}
          aria-hidden="true"
          className={`absolute inset-0 bg-cover bg-center transition-all duration-[2500ms] ease-in-out transform ${
            current === idx ? "opacity-100 scale-105" : "opacity-0 scale-100"
          }`}
        />
      ))}

      {/* Gradient Overlay for readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/70" />

      <Header setShowLogin={setShowLogin} />

      {/* Hero Section */}
      <section className="max-w-md relative z-10 h-full flex flex-col sm:items-center md:items-start justify-center sm:text-center md:text-left text-neutral px-6  ">
        <h1 className="text-3xl sm:text-4xl md:text-6xl font-extrabold mb-4 drop-shadow-2xl animate-fade-in-up">
          Welcome to Our Denomination
        </h1>
        <p className="text-base sm:text-lg md:text-xl max-w-xl animate-fade-in-up animation-delay-300 text-neutral">
          Experience faith, community, and growth like never before.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 mt-6">
          <Button
            variant="primary"
            size="lg"
            onClick={() => navigate("/auth/personal-info")}
          >
            Start Application
          </Button>
          <Button
            variant="secondary"
            size="lg"
            onClick={() => setShowLogin(true)}
          >
            Existing User? Login
          </Button>
        </div>
      </section>

      {/* Login Modal */}
      <div
        role="dialog"
        aria-modal="true"
        className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300 ${
          showLogin ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Backdrop */}
        <div
          onClick={handleCloseLogin}
          className="absolute inset-0 cursor-pointer"
        />

        {showLogin && (
          <Modal showLogin={showLogin} handleCloseLogin={handleCloseLogin} />
        )}
      </div>
    </main>
  );
};

export default App;
