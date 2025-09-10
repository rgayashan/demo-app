import React from 'react';


/**
 * A full-screen loading indicator with a logo and a progress bar.
 *
 * Renders a full-screen white background with a centered column containing
 * the logo, a loading message, and a progress bar. The progress bar is animated
 * so that it appears to fill up. The logo is animated to pulse.
 *
 * This component is meant to be used as a top-level route component, so that
 * it will render as a full-screen loading indicator.
 */
export const SplashScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white z-50 p-4">
      <div className="flex flex-col items-center space-y-4 max-w-sm w-full">
        <img src="/demo.jpg" alt="Logo" className="w-16 h-16 sm:w-20 sm:h-20 animate-pulse" />
        <div className="text-gray-700 font-semibold text-base sm:text-lg text-center">Loading...</div>
        <div className="h-1 w-full max-w-40 bg-gray-200 overflow-hidden rounded">
          <div className="h-full w-1/2 bg-blue-600 animate-[progress_1.2s_ease-in-out_infinite]"></div>
        </div>
      </div>

      <style>
        {`
          @keyframes progress {
            0% { transform: translateX(-100%); }
            50% { transform: translateX(0%); }
            100% { transform: translateX(100%); }
          }
        `}
      </style>
    </div>
  );
};


