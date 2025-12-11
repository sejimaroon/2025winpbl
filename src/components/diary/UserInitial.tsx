import { cn, getInitial } from '@/lib/utils';
import { UserStatus, USER_STATUS } from '@/types/database.types';

interface UserInitialProps {
  name: string;
  status: UserStatus;
  className?: string;
}

// ステータスに基づく色
const statusColors: Record<UserStatus, string> = {
  [USER_STATUS.UNREAD]: 'bg-gray-400',
  [USER_STATUS.CONFIRMED]: 'bg-green-500',
  [USER_STATUS.WORKING]: 'bg-blue-500',
  [USER_STATUS.SOLVED]: 'bg-purple-500',
};

export function UserInitial({ name, status, className }: UserInitialProps) {
  const initial = getInitial(name);

  return (
    <div
      className={cn(
        'flex h-7 w-7 items-center justify-center rounded-full text-white text-xs font-medium',
        statusColors[status],
        className
      )}
      title={`${name} - ${status}`}
    >
      {initial}
    </div>
  );
}

