import type { ReactNode } from 'react';
import { Header } from './Header';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div
      className="min-h-screen transition-colors duration-200"
      style={{ backgroundColor: 'var(--background)' }}
    >
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-4 md:py-8">
        {children}
      </main>
      <footer
        className="mt-8 md:mt-16 py-4 md:py-6"
        style={{
          borderTop: '3px solid var(--border-color)',
          backgroundColor: 'var(--card-bg)',
        }}
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-sm font-medium">
            <div className="flex items-center gap-3">
              <span className="tag-neo text-xs">v0.1.0</span>
              <span style={{ color: 'var(--foreground)' }}>Read-only Intelligence</span>
            </div>
            <div className="flex items-center gap-4">
              <span style={{ color: 'var(--foreground)' }}>
                Vibe coded poorly by{' '}
                <a
                  href="https://x.com/jjonlydown"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold underline decoration-2 decoration-neo-red hover:bg-neo-red hover:no-underline hover:text-black px-1 transition-all"
                >
                  @jjonlydown
                </a>
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
