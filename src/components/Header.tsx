import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { WalletConnect } from './WalletConnect';
import { ThemeToggle } from './ThemeToggle';

export function Header() {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  return (
    <header
      className="sticky top-0 z-50 transition-colors duration-200"
      style={{
        backgroundColor: 'var(--card-bg)',
        borderBottom: '3px solid var(--border-color)',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 py-3 md:py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 md:gap-3 group">
            <div
              className="w-10 h-10 md:w-12 md:h-12 bg-neo-red flex items-center justify-center group-hover:-translate-x-[2px] group-hover:-translate-y-[2px] transition-all"
              style={{
                border: '3px solid var(--border-color)',
                boxShadow: '2px 2px 0px 0px var(--shadow-color)',
              }}
            >
              <span className="text-black font-bold text-xl md:text-2xl">$</span>
            </div>
            <div className="hidden sm:block">
              <div
                className="font-bold text-lg md:text-xl tracking-tight uppercase"
                style={{ color: 'var(--foreground)' }}
              >
                sui yield0r
              </div>
              <div className="text-neutral text-xs font-medium uppercase tracking-wide">
                Real-time Yield Intelligence
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-2">
            <Link
              to="/"
              className={`px-4 py-2 font-bold text-sm uppercase transition-all ${
                isActive('/')
                  ? 'bg-neo-yellow text-black'
                  : 'text-black hover:bg-neo-yellow hover:-translate-x-[1px] hover:-translate-y-[1px]'
              }`}
              style={{
                border: '3px solid var(--border-color)',
                boxShadow: isActive('/') ? '2px 2px 0px 0px var(--shadow-color)' : 'none',
                backgroundColor: isActive('/') ? undefined : 'var(--card-bg)',
                color: isActive('/') ? '#000000' : 'var(--foreground)',
              }}
            >
              Leaderboard
            </Link>
            <Link
              to="/my-yields"
              className={`px-4 py-2 font-bold text-sm uppercase transition-all ${
                isActive('/my-yields')
                  ? 'bg-neo-teal text-black'
                  : 'hover:bg-neo-teal hover:-translate-x-[1px] hover:-translate-y-[1px]'
              }`}
              style={{
                border: '3px solid var(--border-color)',
                boxShadow: isActive('/my-yields') ? '2px 2px 0px 0px var(--shadow-color)' : 'none',
                backgroundColor: isActive('/my-yields') ? undefined : 'var(--card-bg)',
                color: isActive('/my-yields') ? '#000000' : 'var(--foreground)',
              }}
            >
              My Yields
            </Link>
          </nav>

          {/* Right Side - Theme Toggle & Wallet */}
          <div className="flex items-center gap-2 md:gap-3">
            <ThemeToggle />
            <div className="hidden sm:block">
              <WalletConnect />
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden w-10 h-10 flex items-center justify-center"
              style={{
                border: '3px solid var(--border-color)',
                backgroundColor: 'var(--card-bg)',
                boxShadow: '2px 2px 0px 0px var(--shadow-color)',
              }}
              aria-label="Toggle menu"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2.5}
                stroke="currentColor"
                className="w-5 h-5"
                style={{ color: 'var(--foreground)' }}
              >
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pb-2 space-y-2">
            <Link
              to="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`block px-4 py-3 font-bold text-sm uppercase transition-all ${
                isActive('/') ? 'bg-neo-yellow text-black' : ''
              }`}
              style={{
                border: '3px solid var(--border-color)',
                backgroundColor: isActive('/') ? undefined : 'var(--card-bg)',
                color: isActive('/') ? '#000000' : 'var(--foreground)',
                boxShadow: '2px 2px 0px 0px var(--shadow-color)',
              }}
            >
              Leaderboard
            </Link>
            <Link
              to="/my-yields"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`block px-4 py-3 font-bold text-sm uppercase transition-all ${
                isActive('/my-yields') ? 'bg-neo-teal text-black' : ''
              }`}
              style={{
                border: '3px solid var(--border-color)',
                backgroundColor: isActive('/my-yields') ? undefined : 'var(--card-bg)',
                color: isActive('/my-yields') ? '#000000' : 'var(--foreground)',
                boxShadow: '2px 2px 0px 0px var(--shadow-color)',
              }}
            >
              My Yields
            </Link>
            <div className="pt-2">
              <WalletConnect />
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
