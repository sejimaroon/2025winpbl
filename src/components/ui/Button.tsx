'use client';

import { cn } from '@/lib/utils';
import { type ButtonHTMLAttributes, forwardRef } from 'react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'secondary' | 'outline' | 'ghost' | 'destructive';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center whitespace-nowrap rounded-lg font-medium transition-colors',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2',
          'disabled:pointer-events-none disabled:opacity-50',
          // variants
          variant === 'default' && 'bg-primary-500 text-white hover:bg-primary-600 active:bg-primary-700',
          variant === 'secondary' && 'bg-slate-100 text-slate-700 hover:bg-slate-200 active:bg-slate-300',
          variant === 'outline' && 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 active:bg-slate-100',
          variant === 'ghost' && 'text-slate-700 hover:bg-slate-100 active:bg-slate-200',
          variant === 'destructive' && 'bg-red-500 text-white hover:bg-red-600 active:bg-red-700',
          // sizes
          size === 'default' && 'h-10 px-4 py-2 text-sm',
          size === 'sm' && 'h-8 px-3 text-xs',
          size === 'lg' && 'h-12 px-6 text-base',
          size === 'icon' && 'h-10 w-10',
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';

export { Button };

