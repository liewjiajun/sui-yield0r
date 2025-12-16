import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface NeoButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

const variantStyles = {
  primary: 'bg-neo-red text-black',
  secondary: 'bg-neo-teal text-black',
  outline: 'bg-white text-black hover:bg-neo-yellow',
  ghost: 'bg-transparent text-black hover:bg-neo-yellow/50',
};

const sizeStyles = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-lg',
};

export function NeoButton({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled,
  ...props
}: NeoButtonProps) {
  const baseStyles = `
    font-bold uppercase tracking-wide
    border-3 border-black
    shadow-neo transition-all duration-75
    hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-neo-lg
    active:translate-x-[4px] active:translate-y-[4px] active:shadow-none
    cursor-pointer
    disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-x-0 disabled:translate-y-0 disabled:shadow-neo
  `;

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}

interface NeoTagProps {
  children: ReactNode;
  variant?: 'yellow' | 'teal' | 'red' | 'green' | 'purple';
  className?: string;
}

const tagVariantStyles = {
  yellow: 'bg-neo-yellow',
  teal: 'bg-neo-teal',
  red: 'bg-neo-red',
  green: 'bg-neo-green',
  purple: 'bg-neo-purple',
};

export function NeoTag({ children, variant = 'yellow', className = '' }: NeoTagProps) {
  return (
    <span
      className={`inline-block px-3 py-1 text-sm font-bold uppercase border-2 border-black text-black ${tagVariantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  );
}

interface NeoInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

export function NeoInput({ className = '', ...props }: NeoInputProps) {
  return (
    <input
      className={`
        bg-white text-black
        border-3 border-black px-4 py-3
        font-medium placeholder:text-neutral
        focus:outline-none focus:shadow-neo focus:translate-x-[-2px] focus:translate-y-[-2px]
        transition-all duration-75
        ${className}
      `}
      {...props}
    />
  );
}
