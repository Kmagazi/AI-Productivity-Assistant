import { ButtonHTMLAttributes } from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'ghost';
}

const variantClasses: Record<string, string> = {
  primary:
    'bg-blue-600 text-white hover:bg-blue-700 shadow-sm shadow-blue-200 disabled:bg-blue-300',
  secondary:
    'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 disabled:text-slate-400',
  ghost: 'text-slate-600 hover:bg-slate-100 disabled:text-slate-300',
};

export default function Button({
  loading,
  variant = 'primary',
  className = '',
  children,
  disabled,
  ...rest
}: ButtonProps) {
  return (
    <button
      {...rest}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors duration-150 disabled:cursor-not-allowed ${variantClasses[variant]} ${className}`}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
}
