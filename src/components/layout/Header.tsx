'use client';

import { Heart, Settings, AlertTriangle, ClipboardList, LogOut } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { logout } from '@/app/actions/auth';
import { cn } from '@/lib/utils';

interface HeaderProps {
  currentPoints?: number;
  userName?: string;
}

export function Header({ currentPoints = 0, userName }: HeaderProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentFilter = searchParams.get('filter');

  const toggleFilter = (filter: string) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (currentFilter === filter) {
      params.delete('filter');
    } else {
      params.set('filter', filter);
    }
    
    router.push(`/?${params.toString()}`);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        {/* ロゴ・タイトル */}
        <Link href="/" className="flex items-center space-x-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-500 text-white">
            <ClipboardList className="h-5 w-5" />
          </div>
          <span className="font-bold text-lg text-slate-800 hidden sm:inline-block">
            クリニック日報
          </span>
        </Link>

        {/* フィルターボタン */}
        <div className="flex items-center space-x-2">
          <Button
            variant={currentFilter === 'urgent' ? 'secondary' : 'ghost'}
            size="sm"
            className={cn(
              "text-red-500 hover:text-red-600 hover:bg-red-50",
              currentFilter === 'urgent' && "bg-red-50"
            )}
            title="至急のみ表示"
            onClick={() => toggleFilter('urgent')}
          >
            <AlertTriangle className="h-4 w-4 mr-1" />
            <span className="hidden sm:inline">至急</span>
          </Button>

          <Button
            variant={currentFilter === 'todo' ? 'secondary' : 'ghost'}
            size="sm"
            className={cn(
              "text-blue-500 hover:text-blue-600 hover:bg-blue-50",
              currentFilter === 'todo' && "bg-blue-50"
            )}
            title="未解決のみ表示"
            onClick={() => toggleFilter('todo')}
          >
            <ClipboardList className="h-4 w-4 mr-1" />
            <span className="hidden sm:inline">TODO</span>
          </Button>
        </div>

        {/* 右側: ポイント・設定 */}
        <div className="flex items-center space-x-3">
          {/* ポイント表示 */}
          <div className="flex items-center space-x-1 rounded-full bg-pink-50 px-3 py-1.5 text-pink-600">
            <Heart className="h-4 w-4 fill-current" />
            <span className="font-semibold text-sm">{currentPoints}</span>
          </div>

          {/* ログアウトボタン */}
          <form action={logout}>
            <Button variant="ghost" size="icon" className="text-slate-500" title="ログアウト" type="submit">
              <LogOut className="h-5 w-5" />
            </Button>
          </form>
        </div>
      </div>
    </header>
  );
}

