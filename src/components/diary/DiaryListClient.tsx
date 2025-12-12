'use client';

import { useState } from 'react';
import { DiaryList } from './DiaryList';
import { DiaryDetailModal } from './DiaryDetailModal';
import { updateUserDiaryStatus, getCategories, getJobTypes } from '@/app/actions/diary';
import { getActiveStaff } from '@/app/actions/staff';
import type { DiaryWithRelations, UserStatus, Category, StaffWithRelations, JobType } from '@/types/database.types';
import { useTransition, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface DiaryListClientProps {
  diaries: DiaryWithRelations[];
  currentUserId?: number;
  currentUserName?: string;
  isAdmin?: boolean;
  categories: Category[];
}

export function DiaryListClient({ diaries, currentUserId, currentUserName, isAdmin, categories }: DiaryListClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [selectedDiary, setSelectedDiary] = useState<DiaryWithRelations | null>(null);
  const [staffList, setStaffList] = useState<StaffWithRelations[]>([]);
  const [jobTypes, setJobTypes] = useState<JobType[]>([]);

  useEffect(() => {
    getActiveStaff().then(setStaffList).catch(console.error);
    getJobTypes().then(setJobTypes).catch(console.error);
  }, []);

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

  const handleDiaryClick = (diary: DiaryWithRelations) => {
    setSelectedDiary(diary);
  };

  const handleModalClose = () => {
    setSelectedDiary(null);
  };

  const handleUpdate = () => {
    router.refresh();
  };

  return (
    <>
      <div className={isPending ? 'opacity-50 pointer-events-none' : ''}>
        <DiaryList
          diaries={diaries}
          currentUserId={currentUserId}
          currentUserName={currentUserName}
          isAdmin={isAdmin}
          allStaff={staffList}
          jobTypes={jobTypes}
          onStatusChange={handleStatusChange}
          onDiaryClick={handleDiaryClick}
          onUpdate={handleUpdate}
        />
      </div>

      {selectedDiary && (
        <DiaryDetailModal
          diary={selectedDiary}
          currentUserId={currentUserId}
          isAdmin={isAdmin}
          categories={categories}
          staffList={staffList}
          jobTypes={jobTypes}
          onClose={handleModalClose}
          onUpdate={handleUpdate}
        />
      )}
    </>
  );
}

