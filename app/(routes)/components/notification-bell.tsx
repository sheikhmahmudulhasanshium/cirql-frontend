// src/components/notifications/notification-bell.tsx
'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Bell, Mail, CheckCheck } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import useNotifications from "@/components/hooks/notifications/use-notifications";
import { useNotificationContext } from "@/components/contexts/NotificationContext";

export function NotificationBell() {
  // FIX: Get state and actions from the global context
  const { unreadCount, handleMarkAsRead, handleMarkAllAsRead } = useNotificationContext();
  const { data: recentNotifications, isLoading } = useNotifications({ page: 1, limit: 5 });

  const handleItemClick = (notificationId: string) => {
    handleMarkAsRead(notificationId);
    // Navigation will be handled by the Link component
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {/* The button aesthetics are consistent with other header buttons */}
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 -mt-1 -mr-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
              {unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="flex justify-between items-center pr-2">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            {unreadCount > 0 && (
                <Button variant="ghost" size="sm" className="text-xs h-7" onClick={handleMarkAllAsRead}>
                    <CheckCheck className="mr-1 h-3 w-3" />
                    Mark all as read
                </Button>
            )}
        </div>
        <DropdownMenuSeparator />
        {isLoading ? (
          <div className="p-2 space-y-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : recentNotifications && recentNotifications.length > 0 ? (
          recentNotifications.map(n => (
            // FIX: onClick handler added to mark as read
            <DropdownMenuItem key={n._id} asChild className="cursor-pointer p-0">
              <Link href={n.linkUrl || '/notifications'} onClick={() => handleItemClick(n._id)} className="flex items-start gap-3 p-2">
                 {!n.isRead && (
                    <div className="h-2 w-2 rounded-full bg-primary mt-1.5 flex-shrink-0" aria-hidden="true" />
                 )}
                 <div className="flex-grow min-w-0">
                    <p className="font-semibold truncate">{n.title}</p>
                    <p className="text-sm text-muted-foreground truncate">{n.message}</p>
                </div>
              </Link>
            </DropdownMenuItem>
          ))
        ) : (
          <div className="p-4 text-center text-sm text-muted-foreground">
            <Mail className="mx-auto h-8 w-8 mb-2" />
            You&apos;re all caught up!
          </div>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild className="cursor-pointer">
          {/* FIX: Link to /notifications page is correct */}
          <Link href="/notifications" className="w-full justify-center flex">
            View All Notifications
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}