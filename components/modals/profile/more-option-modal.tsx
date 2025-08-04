'use client';

import { Button } from '@/components/ui/button';
import { ProfileMenuItem } from '@/lib/menu';
import Link from 'next/link';
import { X, LucideIcon } from 'lucide-react';

// Reuse iconMap from above or define here:
import {
  UserCog,
  UserPlus,
  Rss,
  MessageCircle,
  Share2,
  Eye,
  Settings,
  List,
  LogOut,
} from 'lucide-react';

const iconMap: Record<string, LucideIcon> = {
  'user-cog': UserCog,
  'user-plus': UserPlus,
  rss: Rss,
  'message-circle': MessageCircle,
  'share-2': Share2,
  eye: Eye,
  settings: Settings,
  list: List,
  'log-out': LogOut,
};

interface MoreOptionsModalProps {
  items: ProfileMenuItem[];
  userId: string;
  onClose: () => void;
}

export const MoreOptionsModal = ({ items, userId, onClose }: MoreOptionsModalProps) => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="relative z-50 w-full max-w-md m-4 p-6 rounded-xl border bg-popover shadow-2xl animate-in fade-in-90 slide-in-from-top-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <p className="text-lg font-semibold text-popover-foreground">More Options</p>
          <Button
            size="icon"
            variant="ghost"
            className="rounded-full"
            onClick={onClose}
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="flex flex-col gap-2">
          {items.map((subItem) => {
            const label = subItem.label;
            const href =
              subItem.type === 'link' ? subItem.linkUrl.replace('[id]', userId) : '#';
            const IconComponent = iconMap[subItem.icon ?? ''] || null;

            return (
              <Link
                key={subItem.key}
                href={href}
                className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium text-primary hover:bg-primary/10"
              >
                {IconComponent && <IconComponent className="w-5 h-5" />}
                {label}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};
