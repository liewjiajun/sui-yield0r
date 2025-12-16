import type { ReactNode } from 'react';

interface NeoCardProps {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'teal' | 'yellow' | 'red' | 'green';
}

const variantStyles = {
  default: 'bg-white',
  teal: 'bg-neo-teal',
  yellow: 'bg-neo-yellow',
  red: 'bg-neo-red',
  green: 'bg-neo-green',
};

export function NeoCard({ children, className = '', variant = 'default' }: NeoCardProps) {
  return (
    <div className={`border-3 border-black shadow-neo p-6 ${variantStyles[variant]} ${className}`}>
      {children}
    </div>
  );
}

interface NeoCardHeaderProps {
  children: ReactNode;
  className?: string;
}

export function NeoCardHeader({ children, className = '' }: NeoCardHeaderProps) {
  return (
    <div className={`font-bold text-lg uppercase tracking-wide mb-4 ${className}`}>
      {children}
    </div>
  );
}

interface NeoCardContentProps {
  children: ReactNode;
  className?: string;
}

export function NeoCardContent({ children, className = '' }: NeoCardContentProps) {
  return <div className={className}>{children}</div>;
}
