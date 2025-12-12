import { Header } from '@/components/layout/Header';
import { DateNavigator } from '@/components/diary/DateNavigator';
import { FloatingActionButton } from '@/components/diary/FloatingActionButton';
import { getDiariesByDate, getCurrentStaff, getCategories } from '@/app/actions/diary';
import { getMonthlyPoints } from '@/app/actions/points';
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
    // 先にスタッフ情報を取得
    const currentStaff = await getCurrentStaff();
    
    // TODOフィルターの場合はスタッフ情報を使用
    const jobTypeName = currentStaff?.job_type?.job_name;
    const staffName = currentStaff?.name;
    
    // 今月のポイントを取得
    const monthlyPoints = currentStaff?.staff_id 
      ? await getMonthlyPoints(currentStaff.staff_id) 
      : 0;

    const [diaries, categories] = await Promise.all([
      getDiariesByDate(dateString, filter, currentStaff?.staff_id, jobTypeName, staffName),
      getCategories(),
    ]);
    
    console.log('Data fetched successfully', { 
      diariesCount: diaries?.length, 
      staffFound: !!currentStaff,
      monthlyPoints
    });

    return (
      <div className="min-h-screen bg-slate-50">
        <Header 
          currentPoints={monthlyPoints}
          systemRoleId={currentStaff?.system_role_id}
        />
        <DateNavigator currentDate={currentDate} />

        <main className="container mx-auto px-4 py-6 pb-24">
          <DiaryListClient
            diaries={diaries || []}
            currentUserId={currentStaff?.staff_id}
            currentUserName={currentStaff?.name}
            isAdmin={currentStaff?.system_role_id === 1}
            categories={categories || []}
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

