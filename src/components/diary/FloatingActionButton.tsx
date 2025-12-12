'use client';

import { Plus } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface FloatingActionButtonProps {
  href?: string;
  onClick?: () => void;
  className?: string;
}

export function FloatingActionButton({
  href = '/post',
  onClick,
  className,
}: FloatingActionButtonProps) {
  const buttonClass = cn(
    'fixed bottom-6 right-6 z-50',
    'flex h-14 w-14 items-center justify-center',
    'rounded-full bg-primary-500 text-white shadow-lg',
    'hover:bg-primary-600 active:bg-primary-700',
    'transition-all hover:scale-105 active:scale-95',
    'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
    className
  );

  if (onClick) {
    return (
      <button onClick={onClick} className={buttonClass} aria-label="新規投稿">
        <Plus className="h-6 w-6" />
      </button>
    );
  }

  return (
    <Link href={href} className={buttonClass} aria-label="新規投稿">
      <Plus className="h-6 w-6" />
    </Link>
  );
}

