'use client';

import { AlertTriangle, CheckCircle, Clock, MessageSquare, CheckCheck } from 'lucide-react';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { CategoryBadge } from './CategoryBadge';
import { UserInitial } from './UserInitial';
import { cn, formatTime } from '@/lib/utils';
import type { DiaryWithRelations, UserStatus, USER_STATUS } from '@/types/database.types';

interface DiaryCardProps {
  diary: DiaryWithRelations;
  currentUserId?: number;
  onStatusChange?: (diaryId: number, status: UserStatus) => void;
}

export function DiaryCard({ diary, currentUserId, onStatusChange }: DiaryCardProps) {
  const handleStatusChange = (status: UserStatus) => {
    if (onStatusChange) {
      onStatusChange(diary.diary_id, status);
    }
  };

  // ユーザーステータスをグループ化
  const statusGroups = diary.user_statuses?.reduce((acc, us) => {
    if (!acc[us.status]) {
      acc[us.status] = [];
    }
    acc[us.status].push(us);
    return acc;
  }, {} as Record<string, typeof diary.user_statuses>) || {};

  return (
    <Card className={cn(
      'transition-all hover:shadow-md',
      diary.is_urgent && 'border-l-4 border-l-red-500'
    )}>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            {/* タイトル行 */}
            <div className="flex items-center gap-2 flex-wrap">
              {diary.is_urgent && (
                <AlertTriangle className="h-4 w-4 text-red-500 flex-shrink-0" />
              )}
              <h3 className="font-semibold text-slate-800 truncate">
                {diary.title}
              </h3>
            </div>

            {/* メタ情報 */}
            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
              <CategoryBadge categoryName={diary.category?.category_name || ''} />
              <span className="text-xs text-slate-500">
                {diary.staff?.name || '不明'}
              </span>
              <span className="text-xs text-slate-400">
                {formatTime(diary.created_at)}
              </span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="py-3">
        <p className="text-sm text-slate-600 whitespace-pre-wrap line-clamp-3">
          {diary.content}
        </p>
      </CardContent>

      {/* アクションボタン */}
      <CardFooter className="flex-col items-stretch gap-3">
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 min-w-[70px] text-green-600 border-green-200 hover:bg-green-50"
            onClick={() => handleStatusChange('CONFIRMED' as UserStatus)}
          >
            <CheckCircle className="h-4 w-4 mr-1" />
            確認
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1 min-w-[70px] text-blue-600 border-blue-200 hover:bg-blue-50"
            onClick={() => handleStatusChange('WORKING' as UserStatus)}
          >
            <Clock className="h-4 w-4 mr-1" />
            作業中
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1 min-w-[70px] text-slate-600 border-slate-200 hover:bg-slate-50"
            onClick={() => {}}
          >
            <MessageSquare className="h-4 w-4 mr-1" />
            返信
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1 min-w-[70px] text-purple-600 border-purple-200 hover:bg-purple-50"
            onClick={() => handleStatusChange('SOLVED' as UserStatus)}
          >
            <CheckCheck className="h-4 w-4 mr-1" />
            解決
          </Button>
        </div>

        {/* ユーザーステータス表示 */}
        {diary.user_statuses && diary.user_statuses.length > 0 && (
          <div className="flex items-center gap-4 pt-2 border-t border-slate-100">
            {Object.entries(statusGroups).map(([status, users]) => (
              <div key={status} className="flex items-center gap-1">
                {users?.map((us) => (
                  <UserInitial
                    key={us.id}
                    name={us.staff?.name || '?'}
                    status={us.status}
                  />
                ))}
              </div>
            ))}
          </div>
        )}
      </CardFooter>
    </Card>
  );
}

