'use client';

import { cn } from '@/lib/utils';
import { type InputHTMLAttributes, forwardRef } from 'react';

export interface SwitchProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
}

const Switch = forwardRef<HTMLInputElement, SwitchProps>(
  ({ className, label, id, ...props }, ref) => {
    return (
      <label
        htmlFor={id}
        className={cn('inline-flex items-center cursor-pointer', className)}
      >
        <div className="relative">
          <input
            type="checkbox"
            id={id}
            ref={ref}
            className="sr-only peer"
            {...props}
          />
          <div
            className={cn(
              'w-11 h-6 bg-slate-200 rounded-full',
              'peer-focus:ring-2 peer-focus:ring-primary-500 peer-focus:ring-offset-2',
              'peer-checked:bg-primary-500',
              'after:content-[\'\'] after:absolute after:top-0.5 after:left-[2px]',
              'after:bg-white after:rounded-full after:h-5 after:w-5',
              'after:transition-all after:shadow-sm',
              'peer-checked:after:translate-x-full'
            )}
          />
        </div>
        {label && <span className="ml-3 text-sm text-slate-700">{label}</span>}
      </label>
    );
  }
);

Switch.displayName = 'Switch';

export { Switch };

