'use server';

import { createClient } from '@/lib/supabase/server';
import type { PointLog } from '@/types/database.types';

/**
 * 現在のユーザーのポイント履歴を取得
 */
export async function getPointHistory(staffId: number): Promise<PointLog[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('POINT_LOG')
    .select('*')
    .eq('staff_id', staffId)
    .order('created_at', { ascending: false })
    .limit(100);

  if (error) {
    console.error('Error fetching point history:', error);
    return [];
  }

  return data as PointLog[];
}

/**
 * 今月のポイントを計算
 */
export async function getMonthlyPoints(staffId: number): Promise<number> {
  const supabase = await createClient();

  // 今月の開始日
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const { data, error } = await supabase
    .from('POINT_LOG')
    .select('amount')
    .eq('staff_id', staffId)
    .gte('created_at', startOfMonth.toISOString());

  if (error) {
    console.error('Error fetching monthly points:', error);
    return 0;
  }

  // 合計を計算
  const total = data?.reduce((sum, log) => sum + log.amount, 0) || 0;
  return total;
}

