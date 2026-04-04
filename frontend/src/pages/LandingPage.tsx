import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      <div className="max-w-lg w-full text-center">
        {/* Logo / Icon */}
        <div className="mb-6 flex justify-center">
          <div className="rounded-2xl bg-gray-900 p-4">
            <svg
              className="h-12 w-12 text-white"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.75 21V9.349m0 0a3.001 3.001 0 0 0 3.75-.615A2.993 2.993 0 0 0 9.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 0 0 2.25 1.016 2.993 2.993 0 0 0 2.25-1.016 3.001 3.001 0 0 0 3.75.614m-16.5 0a3.004 3.004 0 0 1-.621-4.72l1.189-1.19A1.5 1.5 0 0 1 5.378 3h13.243a1.5 1.5 0 0 1 1.06.44l1.19 1.189a3 3 0 0 1-.621 4.72M6.75 18h3.75a.75.75 0 0 0 .75-.75V13.5a.75.75 0 0 0-.75-.75H6.75a.75.75 0 0 0-.75.75v3.75c0 .414.336.75.75.75Z"
              />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
          Second-hand Marketplace
        </h1>
        <p className="mt-3 text-lg text-gray-600">
          CSCI3100 Group 2 Project
        </p>

        {/* Description */}
        <p className="mt-6 text-gray-500 text-base leading-relaxed">
          Buy and sell second-hand items within your CUHK community. 
          Only students with a valid CUHK email can join.
        </p>

        {/* Buttons */}
        <div className="mt-10 flex flex-col items-center gap-4">
          <Link
            to="/register"
            className="w-48 text-center rounded-lg bg-gray-900 px-8 py-3 text-sm font-semibold text-white hover:bg-black transition-colors"
          >
            Register
          </Link>
          <Link
            to="/login"
            className="w-48 text-center rounded-lg border border-gray-300 bg-white px-8 py-3 text-sm font-semibold text-gray-900 hover:bg-gray-50 transition-colors"
          >
            Login
          </Link>
        </div>

        {/* Footer note */}
        <p className="mt-10 text-xs text-gray-400">
          Restricted to @cuhk.edu.hk email addresses
        </p>
      </div>
    </div>
  );
}
