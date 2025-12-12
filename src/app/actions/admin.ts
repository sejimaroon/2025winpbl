'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

/**
 * 承認待ちスタッフ一覧を取得
 */
export async function getPendingStaff() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('STAFF')
    .select(`
      *,
      job_type:JOB_TYPE(*)
    `)
    .eq('is_active', false)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching pending staff:', error);
    return [];
  }

  return data;
}

/**
 * スタッフを承認
 */
export async function approveStaff(staffId: number) {
  const supabase = await createClient();

  // 管理者権限チェック
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: 'ログインが必要です' };
  }

  const { data: currentStaff } = await supabase
    .from('STAFF')
    .select('system_role_id')
    .eq('email', user.email)
    .single();

  if (!currentStaff || currentStaff.system_role_id !== 1) {
    return { success: false, error: '管理者権限が必要です' };
  }

  // スタッフを承認（is_active = true）
  const { error } = await supabase
    .from('STAFF')
    .update({ is_active: true })
    .eq('staff_id', staffId);

  if (error) {
    console.error('Error approving staff:', error);
    return { success: false, error: error.message };
  }

  revalidatePath('/admin');
  return { success: true };
}

