"use client";

import { Globe, ArrowRight } from "lucide-react";
import Link from "next/link";

const Header = () => {
  return (
    <nav className="relative z-50 px-4 py-4 md:px-6 md:py-6">
      <div className="max-w-7xl mx-auto w-full flex justify-between items-center">
        <div className="flex items-center space-x-3 sm:space-x-4">
          <div className="relative">
            <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center">
              <Globe className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <div className="absolute inset-0 w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-r from-orange-500 to-red-600 rounded-full blur-md opacity-30" />
          </div>
          <div>
            <h1 className="text-base sm:text-lg md:text-xl font-bold text-white">
              Mars Control
            </h1>
            <p className="text-[10px] sm:text-xs text-gray-400">
              Mission Dashboard
            </p>
          </div>
        </div>

        <Link href="/dashboard">
          <button className="cursor-pointer bg-white/10 text-white backdrop-blur-md border border-white/20 px-3 py-1.5 sm:px-5 sm:py-2 rounded-full hover:bg-white/20 transition-all duration-300 flex items-center space-x-2">
            <span className="text-xs sm:text-sm">Launch Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </Link>
      </div>
    </nav>
  );
};

export default Header;
