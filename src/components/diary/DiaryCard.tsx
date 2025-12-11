'use client';

import { useState, useTransition } from 'react';
import { AlertTriangle, CheckCircle, Clock, MessageSquare, CheckCheck, Send, X } from 'lucide-react';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Textarea';
import { CategoryBadge } from './CategoryBadge';
import { UserInitial } from './UserInitial';
import { cn, formatTime } from '@/lib/utils';
import type { DiaryWithRelations, UserStatus } from '@/types/database.types';
import { createDiary } from '@/app/actions/diary';

interface DiaryCardProps {
  diary: DiaryWithRelations;
  currentUserId?: number;
  onStatusChange?: (diaryId: number, status: UserStatus) => void;
}

export function DiaryCard({ diary, currentUserId, onStatusChange }: DiaryCardProps) {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleStatusChange = (status: UserStatus) => {
    if (onStatusChange) {
      onStatusChange(diary.diary_id, status);
    }
  };

  const handleReplySubmit = async (formData: FormData) => {
    if (!currentUserId) {
      alert('ログインが必要です');
      return;
    }

    const content = formData.get('content') as string;
    if (!content.trim()) return;

    startTransition(async () => {
      const result = await createDiary({
        category_id: diary.category_id,
        staff_id: currentUserId,
        title: `Re: ${diary.title}`, // タイトルは自動生成
        content: content,
        target_date: diary.target_date, // 親記事と同じ日付
        is_urgent: false,
        parent_id: diary.diary_id,
      });

      if (result.success) {
        setShowReplyForm(false);
      } else {
        alert('返信の投稿に失敗しました');
      }
    });
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

      <CardContent className="py-3 space-y-4">
        <p className="text-sm text-slate-600 whitespace-pre-wrap">
          {diary.content}
        </p>

        {/* 返信一覧 */}
        {diary.replies && diary.replies.length > 0 && (
          <div className="mt-4 space-y-2 pl-4 border-l-2 border-slate-100">
            {diary.replies.map((reply) => (
              <div key={reply.diary_id} className="bg-slate-50 p-3 rounded-lg text-sm">
                <div className="flex items-center gap-2 mb-1">
                  <UserInitial 
                    name={reply.staff?.name || '?'} 
                    status={reply.current_status} 
                    className="h-5 w-5 text-[10px]" 
                  />
                  <span className="font-medium text-slate-700">{reply.staff?.name}</span>
                  <span className="text-xs text-slate-400">{formatTime(reply.created_at)}</span>
                </div>
                <p className="text-slate-600 whitespace-pre-wrap pl-7">{reply.content}</p>
              </div>
            ))}
          </div>
        )}

        {/* 返信フォーム */}
        {showReplyForm && (
          <form action={handleReplySubmit} className="mt-4 pl-4 border-l-2 border-slate-100">
            <div className="space-y-2">
              <Textarea
                name="content"
                placeholder="返信内容を入力..."
                className="min-h-[80px] text-sm"
                autoFocus
                required
              />
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowReplyForm(false)}
                  disabled={isPending}
                >
                  キャンセル
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  disabled={isPending}
                  className="bg-primary-500 hover:bg-primary-600"
                >
                  {isPending ? '送信中...' : (
                    <>
                      <Send className="h-3 w-3 mr-1" />
                      送信
                    </>
                  )}
                </Button>
              </div>
            </div>
          </form>
        )}
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
            variant={showReplyForm ? "secondary" : "outline"}
            size="sm"
            className="flex-1 min-w-[70px] text-slate-600 border-slate-200 hover:bg-slate-50"
            onClick={() => setShowReplyForm(!showReplyForm)}
          >
            {showReplyForm ? <X className="h-4 w-4 mr-1" /> : <MessageSquare className="h-4 w-4 mr-1" />}
            {showReplyForm ? '閉じる' : '返信'}
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
