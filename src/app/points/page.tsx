import { Header } from '@/components/layout/Header';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { getCurrentStaff } from '@/app/actions/diary';
import { getPointHistory, getMonthlyPoints } from '@/app/actions/points';
import { redirect } from 'next/navigation';
import { formatDate, formatTime } from '@/lib/utils';
import { ArrowUp, ArrowDown, Heart, Calendar, Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';

export default async function PointsPage() {
  const currentStaff = await getCurrentStaff();

  if (!currentStaff) {
    redirect('/login');
  }

  const [pointHistory, monthlyPoints] = await Promise.all([
    getPointHistory(currentStaff.staff_id),
    getMonthlyPoints(currentStaff.staff_id),
  ]);

  return (
    <div className="min-h-screen bg-slate-50">
      <Header 
        currentPoints={monthlyPoints}
        systemRoleId={currentStaff.system_role_id}
      />
      
      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* ポイント表示（今月と累計） */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* 今月のポイント */}
          <Card className="bg-gradient-to-r from-pink-500 to-rose-500 text-white">
            <CardContent className="py-6">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Calendar className="h-5 w-5 opacity-90" />
                  <p className="text-sm opacity-90">今月のポイント</p>
                </div>
                <div className="flex items-center justify-center gap-3">
                  <Heart className="h-10 w-10 fill-white" />
                  <span className="text-5xl font-bold">{monthlyPoints}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 累計ポイント */}
          <Card className="bg-gradient-to-r from-amber-500 to-orange-500 text-white">
            <CardContent className="py-6">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Trophy className="h-5 w-5 opacity-90" />
                  <p className="text-sm opacity-90">累計ポイント</p>
                </div>
                <div className="flex items-center justify-center gap-3">
                  <Heart className="h-10 w-10 fill-white" />
                  <span className="text-5xl font-bold">{currentStaff.current_points || 0}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <p className="text-center text-sm text-slate-500">{currentStaff.name}さん</p>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">ポイント履歴</CardTitle>
            <p className="text-sm text-slate-500 mt-1">
              あなたのポイント獲得履歴
            </p>
          </CardHeader>
          
          <CardContent>
            {pointHistory.length === 0 ? (
              <div className="text-center py-12 text-slate-500">
                <p>ポイント履歴がありません</p>
              </div>
            ) : (
              <div className="space-y-3">
                {pointHistory.map((log) => (
                  <div
                    key={log.point_log_id}
                    className="flex items-center justify-between p-4 bg-slate-50 rounded-lg"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      {log.amount > 0 ? (
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-green-600">
                          <ArrowUp className="h-5 w-5" />
                        </div>
                      ) : (
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 text-red-600">
                          <ArrowDown className="h-5 w-5" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-slate-800">{log.reason}</p>
                        <p className="text-xs text-slate-500">
                          {formatDate(log.created_at)} {formatTime(log.created_at)}
                        </p>
                      </div>
                    </div>
                    <div
                      className={cn(
                        'font-semibold text-lg',
                        log.amount > 0 ? 'text-green-600' : 'text-red-600'
                      )}
                    >
                      {log.amount > 0 ? '+' : ''}{log.amount}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

