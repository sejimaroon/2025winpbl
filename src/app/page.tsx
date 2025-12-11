import { Header } from '@/components/layout/Header';
import { DateNavigator } from '@/components/diary/DateNavigator';
import { DiaryList } from '@/components/diary/DiaryList';
import { FloatingActionButton } from '@/components/diary/FloatingActionButton';
import { getDiariesByDate, getCurrentStaff } from '@/app/actions/diary';
import { toISODateString, getToday } from '@/lib/utils';
import { DiaryListClient } from '@/components/diary/DiaryListClient';

interface PageProps {
  searchParams: Promise<{ date?: string; filter?: 'urgent' | 'todo' }>;
}

export default async function HomePage({ searchParams }: PageProps) {
  const params = await searchParams;
  
  // 日付パラメータがない場合は今日の日付を使用
  const dateString = params.date || toISODateString(getToday());
  const currentDate = new Date(dateString + 'T00:00:00');
  const filter = params.filter;

  // データ取得
  console.log('Fetching data for date:', dateString, 'filter:', filter);
  
  try {
    const [diaries, currentStaff] = await Promise.all([
      getDiariesByDate(dateString, filter),
      getCurrentStaff(),
    ]);
    
    console.log('Data fetched successfully', { 
      diariesCount: diaries?.length, 
      staffFound: !!currentStaff 
    });

    return (
      <div className="min-h-screen bg-slate-50">
        <Header currentPoints={currentStaff?.current_points || 0} />
        <DateNavigator currentDate={currentDate} />

        <main className="container mx-auto px-4 py-6 pb-24">
          <DiaryListClient
            diaries={diaries || []}
            currentUserId={currentStaff?.staff_id}
          />
        </main>

        <FloatingActionButton href="/post" />
      </div>
    );
  } catch (error) {
    console.error('Error fetching data:', error);
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-2">データの読み込み中にエラーが発生しました</p>
          <p className="text-sm text-slate-500">{String(error)}</p>
        </div>
      </div>
    );
  }
}

