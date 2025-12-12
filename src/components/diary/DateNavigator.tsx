'use client';

import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { formatDate, toISODateString, addDays, getToday } from '@/lib/utils';
import { useRouter } from 'next/navigation';

interface DateNavigatorProps {
  currentDate: Date;
}

export function DateNavigator({ currentDate }: DateNavigatorProps) {
  const router = useRouter();
  const today = getToday();
  const isToday = toISODateString(currentDate) === toISODateString(today);

  const navigateToDate = (date: Date) => {
    const dateString = toISODateString(date);
    router.push(`/?date=${dateString}`);
  };

  const goToPreviousDay = () => {
    navigateToDate(addDays(currentDate, -1));
  };

  const goToNextDay = () => {
    navigateToDate(addDays(currentDate, 1));
  };

  const goToToday = () => {
    navigateToDate(today);
  };

  return (
    <div className="sticky top-14 z-40 bg-slate-50 border-b border-slate-200">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* 前日ボタン */}
          <Button
            variant="ghost"
            size="icon"
            onClick={goToPreviousDay}
            className="text-slate-600"
            aria-label="前日"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>

          {/* 日付表示 */}
          <div className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-primary-500" />
            <span className="font-semibold text-lg text-slate-800">
              {formatDate(currentDate)}
            </span>
            {!isToday && (
              <Button
                variant="outline"
                size="sm"
                onClick={goToToday}
                className="ml-2 text-xs"
              >
                今日
              </Button>
            )}
          </div>

          {/* 翌日ボタン */}
          <Button
            variant="ghost"
            size="icon"
            onClick={goToNextDay}
            className="text-slate-600"
            aria-label="翌日"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}

