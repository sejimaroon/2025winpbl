'use client';

import { useState } from 'react';
import { useFormStatus } from 'react-dom';
import { ClipboardList, Mail, Lock, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/Card';
import { login } from '@/app/actions/auth';

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ログイン中...
        </>
      ) : (
        'ログイン'
      )}
    </Button>
  );
}

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(formData: FormData) {
    setError(null);
    const result = await login(formData);
    if (result?.error) {
      setError(result.error);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-primary-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-500 text-white shadow-lg">
            <ClipboardList className="h-8 w-8" />
          </div>
          <CardTitle className="text-2xl font-bold text-slate-800">
            クリニック日報
          </CardTitle>
          <p className="text-sm text-slate-500 mt-1">
            業務引き継ぎ・日報共有アプリ
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
              <label htmlFor="email" className="text-sm font-medium text-slate-700">
                メールアドレス
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
                パスワード
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  required
                  className="pl-10"
                />
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex-col space-y-4">
            <SubmitButton />
            <p className="text-xs text-center text-slate-500">
              ログイン情報がわからない場合は管理者にお問い合わせください
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

