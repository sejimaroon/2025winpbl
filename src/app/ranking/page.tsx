'use client';

import { useState, useEffect, Suspense } from 'react';
import { Header } from '@/components/layout/Header';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Select } from '@/components/ui/Select';
import { Trophy, Medal, Heart } from 'lucide-react';
import { getRanking, getCategoriesForRanking, type RankingFilter, type RankingEntry } from '@/app/actions/ranking';
import { getCurrentStaff } from '@/app/actions/diary';
import { getMonthlyPoints } from '@/app/actions/points';
import { cn } from '@/lib/utils';
import { getJobTypeColor } from '@/components/diary/DiaryCard';

export default function RankingPage() {
  const [ranking, setRanking] = useState<RankingEntry[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [monthlyPoints, setMonthlyPoints] = useState(0);
  const [systemRoleId, setSystemRoleId] = useState<number | undefined>();

  // フィルタ状態（デフォルトは今月）
  const [filter, setFilter] = useState<RankingFilter>({
    category: 'all',
    period: 'this_month',
    dayOfWeek: 'all',
    timeSlot: 'all',
  });

  useEffect(() => {
    async function loadInitialData() {
      try {
        const [staff, cats] = await Promise.all([
          getCurrentStaff(),
          getCategoriesForRanking(),
        ]);
        if (staff) {
          const monthly = await getMonthlyPoints(staff.staff_id);
          setMonthlyPoints(monthly);
          setSystemRoleId(staff.system_role_id);
        }
        setCategories(cats);
      } catch (error) {
        console.error('Error loading initial data:', error);
      }
    }
    loadInitialData();
  }, []);

  useEffect(() => {
    async function loadRanking() {
      setLoading(true);
      try {
        const data = await getRanking(filter);
        setRanking(data);
      } catch (error) {
        console.error('Error loading ranking:', error);
      } finally {
        setLoading(false);
      }
    }
    loadRanking();
  }, [filter]);

  const handleFilterChange = (key: keyof RankingFilter, value: string) => {
    setFilter(prev => ({ ...prev, [key]: value }));
  };

  // ランクに応じたスタイル
  const getRankStyle = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-yellow-100 border-yellow-400 text-yellow-700';
      case 2:
        return 'bg-slate-100 border-slate-400 text-slate-700';
      case 3:
        return 'bg-orange-100 border-orange-400 text-orange-700';
      default:
        return 'bg-white border-slate-200 text-slate-600';
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-6 w-6 text-yellow-500" />;
      case 2:
        return <Medal className="h-6 w-6 text-slate-400" />;
      case 3:
        return <Medal className="h-6 w-6 text-orange-400" />;
      default:
        return <span className="text-lg font-bold">{rank}</span>;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header currentPoints={monthlyPoints} systemRoleId={systemRoleId} />
      
      <main className="container mx-auto px-4 py-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Trophy className="h-7 w-7 text-yellow-500" />
            ポイントランキング
          </h1>
        </div>

        {/* フィルタセクション */}
        <Card>
          <CardHeader className="border-b border-slate-200 py-3">
            <h2 className="text-sm font-semibold text-slate-700">フィルタ</h2>
          </CardHeader>
          <CardContent className="py-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* 分野別 */}
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-600">分野</label>
                <Select
                  value={filter.category || 'all'}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  className="text-sm"
                >
                  <option value="all">すべて</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </Select>
              </div>

              {/* 期間 */}
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-600">期間</label>
                <Select
                  value={filter.period || 'all'}
                  onChange={(e) => handleFilterChange('period', e.target.value)}
                  className="text-sm"
                >
                  <option value="all">全期間</option>
                  <option value="this_week">今週</option>
                  <option value="this_month">今月</option>
                  <option value="last_month">先月</option>
                </Select>
              </div>

              {/* 曜日 */}
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-600">曜日</label>
                <Select
                  value={filter.dayOfWeek || 'all'}
                  onChange={(e) => handleFilterChange('dayOfWeek', e.target.value)}
                  className="text-sm"
                >
                  <option value="all">すべて</option>
                  <option value="0">日曜日</option>
                  <option value="1">月曜日</option>
                  <option value="2">火曜日</option>
                  <option value="3">水曜日</option>
                  <option value="4">木曜日</option>
                  <option value="5">金曜日</option>
                  <option value="6">土曜日</option>
                </Select>
              </div>

              {/* 時間帯 */}
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-600">時間帯</label>
                <Select
                  value={filter.timeSlot || 'all'}
                  onChange={(e) => handleFilterChange('timeSlot', e.target.value)}
                  className="text-sm"
                >
                  <option value="all">すべて</option>
                  <option value="morning">午前の部（0〜12時）</option>
                  <option value="afternoon">午後の部（12〜24時）</option>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ランキング表示 */}
        <Card>
          <CardHeader className="border-b border-slate-200">
            <h2 className="text-lg font-semibold text-slate-800">Top 5</h2>
          </CardHeader>
          <CardContent className="py-4">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
              </div>
            ) : ranking.length === 0 ? (
              <div className="text-center py-12 text-slate-400">
                <Trophy className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>該当するランキングデータがありません</p>
              </div>
            ) : (
              <div className="space-y-3">
                {ranking.map((entry) => (
                  <div
                    key={entry.staff_id}
                    className={cn(
                      "flex items-center justify-between p-4 rounded-lg border-2 transition-all",
                      getRankStyle(entry.rank)
                    )}
                  >
                    <div className="flex items-center gap-4">
                      {/* ランク */}
                      <div className="flex items-center justify-center w-10 h-10">
                        {getRankIcon(entry.rank)}
                      </div>

                      {/* ユーザー情報 */}
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "h-10 w-10 rounded-full flex items-center justify-center text-white font-bold",
                          getJobTypeColor(entry.job_type_name)
                        )}>
                          {entry.name?.charAt(0) || '?'}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800">{entry.name}</p>
                          <p className="text-xs text-slate-500">{entry.job_type_name}</p>
                        </div>
                      </div>
                    </div>

                    {/* ポイント */}
                    <div className="flex items-center gap-2 text-lg font-bold">
                      <Heart className="h-5 w-5 text-pink-500 fill-pink-500" />
                      <span className="text-pink-600">{entry.total_points}</span>
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

