'use client';

import { DiaryCard } from './DiaryCard';
import type { DiaryWithRelations, UserStatus } from '@/types/database.types';
import { FileText } from 'lucide-react';

interface DiaryListProps {
  diaries: DiaryWithRelations[];
  currentUserId?: number;
  onStatusChange?: (diaryId: number, status: UserStatus) => void;
}

export function DiaryList({ diaries, currentUserId, onStatusChange }: DiaryListProps) {
  if (diaries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-slate-400">
        <FileText className="h-16 w-16 mb-4" />
        <p className="text-lg font-medium">この日の日報はありません</p>
        <p className="text-sm mt-1">右下の＋ボタンから新規投稿できます</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {diaries.map((diary) => (
        <DiaryCard
          key={diary.diary_id}
          diary={diary}
          currentUserId={currentUserId}
          onStatusChange={onStatusChange}
        />
      ))}
    </div>
  );
}

