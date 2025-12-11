'use client';

import { Heart, Settings, AlertTriangle, ClipboardList, LogOut } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { logout } from '@/app/actions/auth';

interface HeaderProps {
  currentPoints?: number;
  userName?: string;
}

export function Header({ currentPoints = 0, userName }: HeaderProps) {
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

        {/* フィルターボタン（Phase 2用に配置のみ） */}
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            className="text-red-500 hover:text-red-600 hover:bg-red-50"
            title="至急のみ表示"
          >
            <AlertTriangle className="h-4 w-4 mr-1" />
            <span className="hidden sm:inline">至急</span>
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

