'use client';

import { AtSign } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface MentionButtonProps {
  onMentionClick: () => void;
}

export function MentionButton({ onMentionClick }: MentionButtonProps) {
  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={onMentionClick}
      className="text-primary-600 border-primary-300 hover:bg-primary-50"
    >
      <AtSign className="h-4 w-4 mr-1" />
      <span>宛先を指定</span>
    </Button>
  );
}

