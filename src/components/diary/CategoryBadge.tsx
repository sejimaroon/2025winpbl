import { cn } from '@/lib/utils';

interface CategoryBadgeProps {
  categoryName: string;
  className?: string;
}

// カテゴリ名に基づいてスタイルを決定
function getCategoryStyle(categoryName: string): string {
  switch (categoryName) {
    case '診察':
      return 'badge-medical';
    case '看護':
      return 'badge-nursing';
    case '事務':
      return 'badge-office';
    default:
      return 'bg-slate-100 text-slate-700 border-slate-200';
  }
}

export function CategoryBadge({ categoryName, className }: CategoryBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium',
        getCategoryStyle(categoryName),
        className
      )}
    >
      {categoryName}
    </span>
  );
}

