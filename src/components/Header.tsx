import { Link, useLocation } from 'react-router-dom';
import { WalletConnect } from './WalletConnect';

export function Header() {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="border-b-3 border-terminal-green bg-terminal-black/90 backdrop-blur sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 border-3 border-terminal-green bg-terminal-black flex items-center justify-center group-hover:shadow-brutal transition-all">
              <span className="text-terminal-green font-mono font-bold text-xl">$</span>
            </div>
            <div>
              <div className="text-terminal-green font-mono font-bold text-xl tracking-tight">
                sui yield0r
              </div>
              <div className="text-terminal-green-dim font-mono text-xs">
                real-time yield intelligence
              </div>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="flex items-center gap-1">
            <Link
              to="/"
              className={`px-4 py-2 font-mono text-sm uppercase transition-all ${
                isActive('/')
                  ? 'text-terminal-black bg-terminal-green font-bold'
                  : 'text-terminal-green hover:bg-terminal-green/10'
              }`}
            >
              [LEADERBOARD]
            </Link>
            <Link
              to="/my-yields"
              className={`px-4 py-2 font-mono text-sm uppercase transition-all ${
                isActive('/my-yields')
                  ? 'text-terminal-black bg-terminal-green font-bold'
                  : 'text-terminal-green hover:bg-terminal-green/10'
              }`}
            >
              [MY_YIELDS]
            </Link>
          </nav>

          {/* Wallet */}
          <WalletConnect />
        </div>
      </div>
    </header>
  );
}
