/**
 * データベース型定義
 * Supabaseスキーマに基づくTypeScript型
 */

// ==========================================
// マスタテーブル型
// ==========================================

export interface JobType {
  job_type_id: number;
  job_name: string;
}

export interface SystemRole {
  role_id: number;
  role_name: string;
}

export interface Category {
  category_id: number;
  category_name: string;
  is_active: boolean;
}

export interface Tag {
  tag_id: number;
  tag_name: string;
  css_class: string;
  is_active: boolean;
}

// ==========================================
// ユーザー管理型
// ==========================================

export interface Staff {
  staff_id: number;
  name: string;
  login_id: string;
  password_hash: string;
  email: string;
  job_type_id: number;
  system_role_id: number;
  is_active: boolean;
  current_points: number;
  created_at: string;
  updated_at: string;
}

// リレーション込みのスタッフ型
export interface StaffWithRelations extends Staff {
  job_type?: JobType;
  system_role?: SystemRole;
}

// ==========================================
// 日報データ型
// ==========================================

// ステータス定数
export const DIARY_STATUS = {
  UNREAD: 'UNREAD',
  CONFIRMED: 'CONFIRMED',
  WORKING: 'WORKING',
  SOLVED: 'SOLVED',
} as const;

export type DiaryStatus = typeof DIARY_STATUS[keyof typeof DIARY_STATUS];

// ユーザーステータス定数
export const USER_STATUS = {
  UNREAD: 'UNREAD',
  CONFIRMED: 'CONFIRMED',
  WORKING: 'WORKING',
  SOLVED: 'SOLVED',
} as const;

export type UserStatus = typeof USER_STATUS[keyof typeof USER_STATUS];

export interface Diary {
  diary_id: number;
  parent_id: number | null;
  category_id: number;
  staff_id: number;
  title: string;
  content: string;
  target_date: string;
  is_urgent: boolean;
  bounty_points: number | null;
  is_hidden: boolean;
  is_deleted: boolean;
  current_status: DiaryStatus;
  created_at: string;
  updated_at: string;
}

// リレーション込みの日報型
export interface DiaryWithRelations extends Diary {
  category?: Category;
  staff?: Staff;
  tags?: Tag[];
  user_statuses?: UserDiaryStatusWithStaff[];
  replies?: DiaryWithRelations[];
}

// ==========================================
// 日報タグ中間テーブル型
// ==========================================

export interface DiaryTag {
  id: number;
  diary_id: number;
  tag_id: number;
}

// ==========================================
// ユーザー既読・作業状態型
// ==========================================

export interface UserDiaryStatus {
  id: number;
  diary_id: number;
  staff_id: number;
  status: UserStatus;
  updated_at: string;
}

export interface UserDiaryStatusWithStaff extends UserDiaryStatus {
  staff?: Staff;
}

// ==========================================
// 行動ログ型
// ==========================================

export const ACTION_TYPE = {
  CONFIRM: 'CONFIRM',
  WORKING: 'WORKING',
  SOLVED: 'SOLVED',
  REPLY: 'REPLY',
} as const;

export type ActionType = typeof ACTION_TYPE[keyof typeof ACTION_TYPE];

export interface ActionLog {
  log_id: number;
  diary_id: number | null;
  staff_id: number;
  action_type: ActionType;
  points_awarded: number;
  created_at: string;
}

// ==========================================
// ポイント履歴型
// ==========================================

export interface PointLog {
  point_log_id: number;
  staff_id: number;
  amount: number;
  reason: string;
  created_at: string;
}

// ==========================================
// フォーム・リクエスト用型
// ==========================================

export interface CreateDiaryInput {
  category_id: number;
  title: string;
  content: string;
  target_date: string;
  is_urgent?: boolean;
  bounty_points?: number | null;
  tag_ids?: number[];
  parent_id?: number;
}

export interface UpdateStatusInput {
  diary_id: number;
  status: UserStatus;
}

// ==========================================
// API レスポンス型
// ==========================================

export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
}

// ==========================================
// ポイント設定
// ==========================================

export const POINT_CONFIG = {
  CONFIRM: 1,
  WORKING: 2,
  SOLVED: 5,
  REPLY: 3,
  POST_DIARY: 2,
} as const;

