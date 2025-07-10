import { Link } from "wouter";
import { TrendingUp } from "lucide-react";

export function Header() {
  return (
    <header className="bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-5">
          <Link href="/">
            <div className="flex items-center space-x-4 cursor-pointer group">
              <div className="w-12 h-12 bg-gradient-modern rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all-smooth group-hover:scale-105">
                <TrendingUp className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-brand-dark tracking-tight">Stock Chart Analyzer</h1>
                <p className="text-sm text-brand-gray-light font-medium">Professional Pattern Recognition</p>
              </div>
            </div>
          </Link>
          <nav className="hidden md:flex space-x-8">
            <Link href="/" className="group relative text-brand-gray hover:text-brand-blue transition-all-smooth py-2 px-4 rounded-lg hover:bg-blue-50 font-medium">
              Home
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-brand-blue group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link href="/all-stocks" className="group relative text-brand-gray hover:text-brand-blue transition-all-smooth py-2 px-4 rounded-lg hover:bg-blue-50 font-medium">
              All Stocks
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-brand-blue group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link href="/portfolio" className="group relative text-brand-gray hover:text-brand-blue transition-all-smooth py-2 px-4 rounded-lg hover:bg-blue-50 font-medium">
              Portfolio
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-brand-blue group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link href="/learn" className="group relative text-brand-gray hover:text-brand-blue transition-all-smooth py-2 px-4 rounded-lg hover:bg-blue-50 font-medium">
              Learn
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-brand-blue group-hover:w-full transition-all duration-300"></span>
            </Link>
            <a href="#features" className="group relative text-brand-gray hover:text-brand-blue transition-all-smooth py-2 px-4 rounded-lg hover:bg-blue-50 font-medium">
              Features
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-brand-blue group-hover:w-full transition-all duration-300"></span>
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
}
