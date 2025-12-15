import type { ReactNode } from 'react';
import { Header } from './Header';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-terminal-black">
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-8">
        {children}
      </main>
      <footer className="border-t border-terminal-green/20 mt-16 py-6">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between text-terminal-green-dim font-mono text-xs">
            <div>
              sui yield0r v0.1.0 // read-only intelligence
            </div>
            <div className="flex items-center gap-4">
              <span>CHAIN: MAINNET</span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 bg-terminal-green rounded-full animate-pulse" />
                LIVE
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
