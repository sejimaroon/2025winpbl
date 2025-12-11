'use client';

import { DiaryList } from './DiaryList';
import { updateUserDiaryStatus } from '@/app/actions/diary';
import type { DiaryWithRelations, UserStatus } from '@/types/database.types';
import { useTransition } from 'react';

interface DiaryListClientProps {
  diaries: DiaryWithRelations[];
  currentUserId?: number;
}

export function DiaryListClient({ diaries, currentUserId }: DiaryListClientProps) {
  const [isPending, startTransition] = useTransition();

  const handleStatusChange = (diaryId: number, status: UserStatus) => {
    if (!currentUserId) {
      alert('ログインが必要です');
      return;
    }

    startTransition(async () => {
      const result = await updateUserDiaryStatus(diaryId, currentUserId, status);
      if (!result.success) {
        alert(`エラー: ${result.error}`);
      }
    });
  };

  return (
    <div className={isPending ? 'opacity-50 pointer-events-none' : ''}>
      <DiaryList
        diaries={diaries}
        currentUserId={currentUserId}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
}

