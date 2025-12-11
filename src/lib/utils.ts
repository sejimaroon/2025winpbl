import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Tailwindクラスを結合するユーティリティ
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * 日付をフォーマットする
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const year = d.getFullYear();
  const month = d.getMonth() + 1;
  const day = d.getDate();
  return `${year}年${month}月${day}日`;
}

/**
 * 日付をISO形式（YYYY-MM-DD）で取得
 */
export function toISODateString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * 時刻をフォーマットする（HH:MM形式）
 */
export function formatTime(dateString: string): string {
  const d = new Date(dateString);
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}

/**
 * 名前からイニシャルを取得する
 */
export function getInitial(name: string): string {
  if (!name) return '?';
  // 姓名がスペースで区切られている場合は名の最初の文字
  const parts = name.split(/[\s　]+/);
  if (parts.length >= 2) {
    return parts[1].charAt(0);
  }
  // 区切りがない場合は最後の文字
  return name.charAt(name.length - 1);
}

/**
 * 日付を1日進める
 */
export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

/**
 * 今日の日付を取得
 */
export function getToday(): Date {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return now;
}

