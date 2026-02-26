// src/components/Loader.tsx
import React from "react";

type LoaderProps = {
  fullScreen?: boolean;
  message?: string;
};

export const Loader: React.FC<LoaderProps> = ({
  fullScreen = false,
  message = "Loading...",
}) => {
  const wrapper = fullScreen
    ? "fixed inset-0 z-50 flex flex-col items-center justify-center bg-white dark:bg-gray-900"
    : "flex flex-col items-center justify-center py-20";

  return (
    <div className={wrapper}>
      {/* Bubble ring */}
      <div className="relative w-20 h-20 mb-6">
        {[...Array(8)].map((_, i) => (
          <span
            key={i}
            className="absolute w-3 h-3 rounded-full bg-gradient-to-br from-orange-400 to-pink-500"
            style={{
              top: "50%",
              left: "50%",
              transform: `rotate(${i * 45}deg) translate(28px) translateY(-50%)`,
              animation: `loaderFade 1.2s ease-in-out ${i * 0.15}s infinite`,
            }}
          />
        ))}

        {/* Center baby icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <svg
            viewBox="0 0 24 24"
            className="w-7 h-7 text-peach-500"
            fill="currentColor"
            style={{ animation: "loaderPulse 1.2s ease-in-out infinite" }}
          >
            <path d="M12 2a4 4 0 1 1 0 8 4 4 0 0 1 0-8zm0 10c4.42 0 8 1.79 8 4v2H4v-2c0-2.21 3.58-4 8-4z" />
          </svg>
        </div>
      </div>

      {/* Animated dots text */}
      <p className="text-sm font-semibold tracking-widest uppercase text-gray-400 dark:text-gray-500">
        {message}
        <span style={{ animation: "loaderDot 1.4s 0s infinite" }}>.</span>
        <span style={{ animation: "loaderDot 1.4s 0.2s infinite" }}>.</span>
        <span style={{ animation: "loaderDot 1.4s 0.4s infinite" }}>.</span>
      </p>

      <style>{`
        @keyframes loaderFade {
          0%, 100% { opacity: 0.2; transform: rotate(var(--r, 0deg)) translate(28px) translateY(-50%) scale(0.8); }
          50%       { opacity: 1;   transform: rotate(var(--r, 0deg)) translate(28px) translateY(-50%) scale(1.2); }
        }
        @keyframes loaderPulse {
          0%, 100% { opacity: 0.6; transform: scale(0.9); }
          50%       { opacity: 1;   transform: scale(1.1); }
        }
        @keyframes loaderDot {
          0%, 80%, 100% { opacity: 0; }
          40%            { opacity: 1; }
        }
      `}</style>
    </div>
  );
};
