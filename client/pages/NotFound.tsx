import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 via-purple-100 to-sky-100">
      <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl p-10 text-center max-w-md w-full">
        {/* 404 Number */}
        <h1 className="text-8xl font-extrabold bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-600 bg-clip-text text-transparent mb-4 animate-bounce">
          404
        </h1>

        {/* Subtext */}
        <p className="text-lg text-slate-700 mb-6 animate-pulse">
          Oops! The page you're looking for doesn’t exist.
        </p>

        {/* Home Button */}
        <a
          href="/"
          className="inline-block px-8 py-3 rounded-xl bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-600 text-white font-semibold shadow-lg hover:shadow-2xl hover:scale-110 transition-transform duration-300"
        >
          🚀 Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
