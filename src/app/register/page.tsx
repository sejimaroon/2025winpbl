'use client';

import { useState, useEffect } from 'react';
import { useFormStatus } from 'react-dom';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ClipboardList, Mail, Lock, User, Loader2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/Card';
import { registerStaff } from '@/app/actions/auth';

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          登録中...
        </>
      ) : (
        '登録申請を送信'
      )}
    </Button>
  );
}

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(formData: FormData) {
    setError(null);
    const result = await registerStaff(formData);
    
    if (result?.error) {
      setError(result.error);
    } else if (result?.success) {
      setSuccess(true);
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-primary-100 p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600">
              <ClipboardList className="h-8 w-8" />
            </div>
            <h2 className="text-xl font-bold text-slate-800 mb-2">登録申請を受け付けました</h2>
            <p className="text-sm text-slate-600 mb-4">
              管理者の承認をお待ちください。承認後、ログインできるようになります。
            </p>
            <Link href="/login">
              <Button variant="outline">ログインページに戻る</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-primary-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <Link href="/login" className="inline-flex items-center text-slate-500 hover:text-slate-700 mb-4 -ml-2">
            <ArrowLeft className="h-4 w-4 mr-1" />
            ログインに戻る
          </Link>
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-500 text-white shadow-lg">
            <ClipboardList className="h-8 w-8" />
          </div>
          <CardTitle className="text-2xl font-bold text-slate-800">
            新規登録
          </CardTitle>
          <p className="text-sm text-slate-500 mt-1">
            スタッフ登録申請を行います
          </p>
        </CardHeader>

        <form action={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-600">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium text-slate-700">
                お名前 <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="山田 太郎"
                  required
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-slate-700">
                メールアドレス <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="example@clinic.com"
                  required
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-slate-700">
                パスワード <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  required
                  minLength={6}
                  className="pl-10"
                />
              </div>
              <p className="text-xs text-slate-500">6文字以上で入力してください</p>
            </div>

            <div className="space-y-2">
              <label htmlFor="job_type_id" className="text-sm font-medium text-slate-700">
                職種 <span className="text-red-500">*</span>
              </label>
              <Select id="job_type_id" name="job_type_id" required>
                <option value="">選択してください</option>
                <option value="1">医師</option>
                <option value="2">看護師</option>
                <option value="3">医療事務</option>
              </Select>
            </div>
          </CardContent>

          <CardFooter className="flex-col space-y-4">
            <SubmitButton />
            <p className="text-xs text-center text-slate-500">
              登録後、管理者の承認が必要です。承認までお待ちください。
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

