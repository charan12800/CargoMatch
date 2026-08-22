import React from 'react';
import { cn } from '../../lib/utils';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'emerald' | 'amber';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const sizeClasses = {
      sm: 'px-3 py-1.5 text-xs rounded-lg font-medium gap-1.5',
      md: 'px-4 py-2.5 text-sm rounded-xl font-semibold gap-2',
      lg: 'px-6 py-3.5 text-base rounded-xl font-semibold gap-2.5 shadow-sm',
    };

    const variantClasses = {
      primary:
        'bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow-blue-500/25 active:bg-blue-800 focus-visible:ring-2 focus-visible:ring-blue-500',
      secondary:
        'bg-slate-900 hover:bg-slate-800 text-white shadow-sm active:bg-black focus-visible:ring-2 focus-visible:ring-slate-900',
      outline:
        'border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 focus-visible:ring-2 focus-visible:ring-slate-400',
      ghost:
        'bg-transparent hover:bg-slate-100 text-slate-700 hover:text-slate-900 focus-visible:ring-2 focus-visible:ring-slate-400',
      danger:
        'bg-red-600 hover:bg-red-700 text-white shadow-sm active:bg-red-800 focus-visible:ring-2 focus-visible:ring-red-500',
      emerald:
        'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm hover:shadow-emerald-500/25 active:bg-emerald-800 focus-visible:ring-2 focus-visible:ring-emerald-500',
      amber:
        'bg-amber-500 hover:bg-amber-600 text-white shadow-sm hover:shadow-amber-500/25 active:bg-amber-700 focus-visible:ring-2 focus-visible:ring-amber-500',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          'inline-flex items-center justify-center transition-all duration-150 select-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed outline-none focus-visible:ring-offset-2',
          sizeClasses[size],
          variantClasses[variant],
          className
        )}
        {...props}
      >
        {isLoading && <Loader2 className="w-4 h-4 animate-spin shrink-0" />}
        {!isLoading && leftIcon && <span className="shrink-0">{leftIcon}</span>}
        {children}
        {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';
