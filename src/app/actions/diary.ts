'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import type {
  DiaryWithRelations,
  CreateDiaryInput,
  UserStatus,
  Category,
  POINT_CONFIG,
} from '@/types/database.types';

// ポイント設定
const POINTS = {
  CONFIRM: 1,
  WORKING: 2,
  SOLVED: 5,
  REPLY: 3,
  POST_DIARY: 2,
} as const;

/**
 * 指定日の日報一覧を取得
 */
export async function getDiariesByDate(targetDate: string): Promise<DiaryWithRelations[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('DIARY')
    .select(`
      *,
      category:CATEGORY(*),
      staff:STAFF(*),
      user_statuses:USER_DIARY_STATUS(
        *,
        staff:STAFF(*)
      )
    `)
    .eq('target_date', targetDate)
    .eq('is_deleted', false)
    .eq('is_hidden', false)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching diaries:', error);
    return [];
  }

  return data as DiaryWithRelations[];
}

/**
 * カテゴリ一覧を取得
 */
export async function getCategories(): Promise<Category[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('CATEGORY')
    .select('*')
    .eq('is_active', true)
    .order('category_id');

  if (error) {
    console.error('Error fetching categories:', error);
    return [];
  }

  return data as Category[];
}

/**
 * 日報を投稿
 */
export async function createDiary(input: CreateDiaryInput & { staff_id: number }) {
  const supabase = await createClient();

  // 日報を作成
  const { data: diary, error: diaryError } = await supabase
    .from('DIARY')
    .insert({
      category_id: input.category_id,
      staff_id: input.staff_id,
      title: input.title,
      content: input.content,
      target_date: input.target_date,
      is_urgent: input.is_urgent || false,
      bounty_points: input.bounty_points || null,
      current_status: 'UNREAD',
    })
    .select()
    .single();

  if (diaryError) {
    console.error('Error creating diary:', diaryError);
    return { success: false, error: diaryError.message };
  }

  // タグがあれば紐付け
  if (input.tag_ids && input.tag_ids.length > 0) {
    const tagInserts = input.tag_ids.map((tag_id) => ({
      diary_id: diary.diary_id,
      tag_id,
    }));

    await supabase.from('DIARY_TAG').insert(tagInserts);
  }

  // 投稿ポイントを付与
  await addPoints(input.staff_id, POINTS.POST_DIARY, '日報投稿', diary.diary_id);

  revalidatePath('/');
  return { success: true, data: diary };
}

/**
 * ユーザーステータスを更新
 */
export async function updateUserDiaryStatus(
  diaryId: number,
  staffId: number,
  status: UserStatus
) {
  const supabase = await createClient();

  // USER_DIARY_STATUSをupsert
  const { error: statusError } = await supabase
    .from('USER_DIARY_STATUS')
    .upsert(
      {
        diary_id: diaryId,
        staff_id: staffId,
        status: status,
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: 'diary_id,staff_id',
      }
    );

  if (statusError) {
    console.error('Error updating status:', statusError);
    return { success: false, error: statusError.message };
  }

  // アクションログを記録
  const pointsToAward = getPointsForAction(status);
  
  const { error: logError } = await supabase.from('ACTION_LOG').insert({
    diary_id: diaryId,
    staff_id: staffId,
    action_type: status,
    points_awarded: pointsToAward,
  });

  if (logError) {
    console.error('Error creating action log:', logError);
  }

  // ポイントを付与
  await addPoints(staffId, pointsToAward, `日報アクション: ${status}`, diaryId);

  revalidatePath('/');
  return { success: true };
}

/**
 * ポイントを付与する内部関数
 */
async function addPoints(
  staffId: number,
  amount: number,
  reason: string,
  diaryId?: number
) {
  const supabase = await createClient();

  // POINT_LOGに履歴を追加
  await supabase.from('POINT_LOG').insert({
    staff_id: staffId,
    amount: amount,
    reason: reason,
  });

  // STAFFのcurrent_pointsを更新
  const { data: staff } = await supabase
    .from('STAFF')
    .select('current_points')
    .eq('staff_id', staffId)
    .single();

  if (staff) {
    await supabase
      .from('STAFF')
      .update({ current_points: staff.current_points + amount })
      .eq('staff_id', staffId);
  }
}

/**
 * アクションタイプに応じたポイントを取得
 */
function getPointsForAction(status: UserStatus): number {
  switch (status) {
    case 'CONFIRMED':
      return POINTS.CONFIRM;
    case 'WORKING':
      return POINTS.WORKING;
    case 'SOLVED':
      return POINTS.SOLVED;
    default:
      return 0;
  }
}

/**
 * 現在のユーザー情報を取得
 */
export async function getCurrentStaff() {
  const supabase = await createClient();
  
  // Supabase Authからユーザーを取得
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return null;
  }

  // メールアドレスでSTAFFを検索
  const { data: staff } = await supabase
    .from('STAFF')
    .select('*, job_type:JOB_TYPE(*), system_role:SYSTEM_ROLE(*)')
    .eq('email', user.email)
    .single();

  return staff;
}

