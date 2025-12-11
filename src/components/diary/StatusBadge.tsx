import { cn } from '@/lib/utils';
import { UserStatus, USER_STATUS } from '@/types/database.types';

interface StatusBadgeProps {
  status: UserStatus;
  className?: string;
}

const statusConfig: Record<UserStatus, { label: string; className: string }> = {
  [USER_STATUS.UNREAD]: {
    label: '未読',
    className: 'status-unread',
  },
  [USER_STATUS.CONFIRMED]: {
    label: '確認済',
    className: 'status-confirmed',
  },
  [USER_STATUS.WORKING]: {
    label: '作業中',
    className: 'status-working',
  },
  [USER_STATUS.SOLVED]: {
    label: '解決',
    className: 'status-solved',
  },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  );
}

