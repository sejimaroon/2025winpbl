'use client';

import { useState, useEffect } from 'react';
import { useFormStatus } from 'react-dom';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Loader2, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { Switch } from '@/components/ui/Switch';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/Card';
import { createDiary, getCategories, getCurrentStaff } from '@/app/actions/diary';
import { toISODateString, getToday } from '@/lib/utils';
import type { Category, StaffWithRelations } from '@/types/database.types';

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          投稿中...
        </>
      ) : (
        '投稿する'
      )}
    </Button>
  );
}

export default function PostPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [currentStaff, setCurrentStaff] = useState<StaffWithRelations | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [cats, staff] = await Promise.all([
          getCategories(),
          getCurrentStaff(),
        ]);
        setCategories(cats);
        setCurrentStaff(staff);
      } catch (e) {
        console.error('Error loading data:', e);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  async function handleSubmit(formData: FormData) {
    if (!currentStaff) {
      setError('ログインが必要です');
      return;
    }

    setError(null);

    const input = {
      category_id: parseInt(formData.get('category_id') as string),
      title: formData.get('title') as string,
      content: formData.get('content') as string,
      target_date: formData.get('target_date') as string,
      is_urgent: formData.get('is_urgent') === 'on',
      staff_id: currentStaff.staff_id,
    };

    const result = await createDiary(input);

    if (!result.success) {
      setError(result.error || '投稿に失敗しました');
      return;
    }

    router.push('/');
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* ヘッダー */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white">
        <div className="container mx-auto flex h-14 items-center px-4">
          <Link
            href="/"
            className="flex items-center text-slate-600 hover:text-slate-800 -ml-2 p-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="ml-2 font-semibold text-lg text-slate-800">
            新規投稿
          </h1>
        </div>
      </header>

      {/* フォーム */}
      <main className="container mx-auto px-4 py-6">
        <Card>
          <form action={handleSubmit}>
            <CardContent className="space-y-4 pt-6">
              {error && (
                <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-600">
                  {error}
                </div>
              )}

              {/* カテゴリ選択 */}
              <div className="space-y-2">
                <label htmlFor="category_id" className="text-sm font-medium text-slate-700">
                  カテゴリ <span className="text-red-500">*</span>
                </label>
                <Select id="category_id" name="category_id" required>
                  <option value="">選択してください</option>
                  {categories.map((cat) => (
                    <option key={cat.category_id} value={cat.category_id}>
                      {cat.category_name}
                    </option>
                  ))}
                </Select>
              </div>

              {/* 日付 */}
              <div className="space-y-2">
                <label htmlFor="target_date" className="text-sm font-medium text-slate-700">
                  日付 <span className="text-red-500">*</span>
                </label>
                <Input
                  id="target_date"
                  name="target_date"
                  type="date"
                  defaultValue={toISODateString(getToday())}
                  required
                />
              </div>

              {/* タイトル */}
              <div className="space-y-2">
                <label htmlFor="title" className="text-sm font-medium text-slate-700">
                  タイトル <span className="text-red-500">*</span>
                </label>
                <Input
                  id="title"
                  name="title"
                  type="text"
                  placeholder="日報のタイトルを入力"
                  required
                  maxLength={100}
                />
              </div>

              {/* 内容 */}
              <div className="space-y-2">
                <label htmlFor="content" className="text-sm font-medium text-slate-700">
                  内容 <span className="text-red-500">*</span>
                </label>
                <Textarea
                  id="content"
                  name="content"
                  placeholder="日報の内容を入力"
                  required
                  rows={6}
                />
              </div>

              {/* 至急フラグ */}
              <div className="flex items-center justify-between rounded-lg border border-slate-200 p-4">
                <div className="flex items-center space-x-3">
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                  <div>
                    <p className="text-sm font-medium text-slate-700">至急</p>
                    <p className="text-xs text-slate-500">
                      緊急の対応が必要な場合はONにしてください
                    </p>
                  </div>
                </div>
                <Switch id="is_urgent" name="is_urgent" />
              </div>
            </CardContent>

            <CardFooter className="flex-col space-y-3">
              <SubmitButton />
              <Link href="/" className="w-full">
                <Button type="button" variant="ghost" className="w-full">
                  キャンセル
                </Button>
              </Link>
            </CardFooter>
          </form>
        </Card>
      </main>
    </div>
  );
}

