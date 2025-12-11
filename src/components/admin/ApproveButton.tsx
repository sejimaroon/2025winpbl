'use client';

import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/Button';
import { CheckCircle, Loader2 } from 'lucide-react';
import { approveStaff } from '@/app/actions/admin';
import { useRouter } from 'next/navigation';

interface ApproveButtonProps {
  staffId: number;
}

export function ApproveButton({ staffId }: ApproveButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [approved, setApproved] = useState(false);

  const handleApprove = () => {
    if (approved) return;

    startTransition(async () => {
      const result = await approveStaff(staffId);
      if (result.success) {
        setApproved(true);
        router.refresh();
      } else {
        alert(`承認に失敗しました: ${result.error}`);
      }
    });
  };

  if (approved) {
    return (
      <div className="flex items-center gap-2 text-green-600">
        <CheckCircle className="h-5 w-5" />
        <span className="text-sm font-medium">承認済み</span>
      </div>
    );
  }

  return (
    <Button
      onClick={handleApprove}
      disabled={isPending}
      className="bg-green-500 hover:bg-green-600 text-white"
    >
      {isPending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          承認中...
        </>
      ) : (
        <>
          <CheckCircle className="mr-2 h-4 w-4" />
          承認する
        </>
      )}
    </Button>
  );
}

