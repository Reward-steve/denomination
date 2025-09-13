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

  // Rotate slideshow every 6s
  useEffect(() => {
    const interval = setInterval(
      () => setCurrent((prev) => (prev + 1) % images.length),
      6000
    );
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="relative h-screen w-full overflow-hidden font-sans antialiased flex justify-center items-center lg:justify-start lg:items-start">
      {/* Background slideshow */}
      {images.map((img, idx) => (
        <div
          key={idx}
          aria-hidden="true"
          style={{ backgroundImage: `url(${img})` }}
          className={`absolute inset-0 bg-cover bg-center transition-all duration-[2500ms] ease-in-out transform ${
            current === idx ? "opacity-100 scale-105" : "opacity-0 scale-100"
          }`}
        />
      ))}

      {/* Dark gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/70" />

      {/* Header */}
      <Header setShowLogin={setShowLogin} />

      {/* Hero Section */}
      <section className="relative z-10 h-full flex flex-col items-center lg:items-start justify-center text-center lg:text-left text-slate-200 px-6 max-w-2xl">
        <h1 className="text-3xl sm:text-4xl md:text-6xl font-extrabold mb-4 drop-shadow-xl">
          Welcome to UCCA
        </h1>

        <p className="text-base sm:text-lg md:text-xl max-w-xl opacity-90">
          Universal Council of Christ Ambassadors, Aks Portal
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mt-6 w-full sm:w-auto">
          <Button
            variant="primary"
            size="lg"
            onClick={() => navigate("/auth/personal-info")}
            className="w-full sm:w-auto"
          >
            Start Application
          </Button>
          <Button
            variant="secondary"
            size="lg"
            onClick={() => setShowLogin(true)}
            className="w-full sm:w-auto"
          >
            Existing User? Login
          </Button>
        </div>
      </section>

      {/* Login Modal */}
      {showLogin && (
        <Modal
          showLogin={showLogin}
          handleCloseLogin={() => setShowLogin(false)}
        />
      )}
    </main>
  );
};

export default App;
