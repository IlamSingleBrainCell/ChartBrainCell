import { Link } from "wouter";
import { TrendingUp } from "lucide-react";

export function Header() {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <Link href="/">
            <div className="flex items-center space-x-3 cursor-pointer">
              <div className="w-10 h-10 bg-brand-blue rounded-lg flex items-center justify-center">
                <TrendingUp className="text-white" size={20} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-brand-dark">Stock Chart Analyzer</h1>
                <p className="text-sm text-brand-gray">AI-Powered Analysis</p>
              </div>
            </div>
          </Link>
          <nav className="hidden md:flex space-x-8">
            <Link href="/" className="text-brand-gray hover:text-brand-blue transition-colors">Home</Link>
            <Link href="/all-stocks" className="text-brand-gray hover:text-brand-blue transition-colors">All Stocks</Link>
            <Link href="/portfolio" className="text-brand-gray hover:text-brand-blue transition-colors">Portfolio</Link>
            <a href="#features" className="text-brand-gray hover:text-brand-blue transition-colors">Features</a>
          </nav>
        </div>
      </div>
    </header>
  );
}
