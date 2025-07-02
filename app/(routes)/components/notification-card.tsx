'use client';

import { useNotificationContext } from "@/components/contexts/NotificationContext";
import { Notification, NotificationType } from "@/lib/types";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { 
  PartyPopper, 
  Megaphone, 
  MessageSquareHeart, 
  UserPlus, 
  HeartHandshake, 
  Users, 
  ShieldAlert,
  BellRing,
} from 'lucide-react';
import { RelativeTime } from "@/lib/RelativeTime";
// --- ADDED: Import the RelativeTime component ---

interface NotificationCardProps {
  notification: Notification;
}

/**
 * Renders a specific icon based on the notification type.
 * The icons and styling are enhanced for better visual clarity in the card layout.
 */
const getIconForType = (type: NotificationType): React.ReactElement => {
  const iconProps = { className: "h-7 w-7 sm:h-8 sm:w-8 text-muted-foreground" };
  const iconMap: Record<NotificationType, React.ElementType> = {
    [NotificationType.WELCOME]: PartyPopper,
    [NotificationType.WELCOME_BACK]: PartyPopper,
    [NotificationType.ANNOUNCEMENT]: Megaphone,
    [NotificationType.SUPPORT_REPLY]: MessageSquareHeart,
    [NotificationType.TICKET_ADMIN_ALERT]: ShieldAlert,
    [NotificationType.ACCOUNT_STATUS_UPDATE]: ShieldAlert,
    [NotificationType.SOCIAL_FRIEND_REQUEST]: UserPlus,
    [NotificationType.SOCIAL_FRIEND_ACCEPT]: HeartHandshake,
    [NotificationType.SOCIAL_FOLLOW]: Users,
    [NotificationType.SOCIAL]: Users,
  };
  const IconComponent = iconMap[type] || BellRing;
  return <IconComponent {...iconProps} />;
};

/**
 * A card component to display a single notification, styled to match the AnnouncementCard aesthetic.
 * It features a prominent icon, clear unread indicators, and is fully interactive.
 */
export function NotificationCard({ notification }: NotificationCardProps) {
  const { handleMarkAsRead } = useNotificationContext();

  const handleClick = () => {
    if (!notification.isRead) {
        handleMarkAsRead(notification._id);
    }
  };

  // The card's visual content, which will be wrapped by either a Link or a div.
  const cardContent = (
    <div className={cn(
        'rounded-lg border bg-card text-card-foreground shadow-sm transition-colors duration-200 p-3',
        // Apply a distinct style for unread notifications for better visibility
        !notification.isRead 
            ? "bg-primary/5 border-primary/20 hover:bg-primary/10"
            : "hover:bg-accent/50"
    )}>
        <div className="flex items-start justify-between gap-4">
            <div className='flex items-center w-full gap-4'>
                {/* Icon Container: Styled to mimic the Avatar from AnnouncementCard */}
                <div className="h-16 w-16 sm:h-20 sm:w-20 flex-shrink-0 flex items-center justify-center rounded-lg bg-muted">
                    {getIconForType(notification.type)}
                </div>
                
                {/* Text Content */}
                <div className='flex-grow flex flex-col gap-1 text-wrap'>
                    <div className="flex items-center gap-2">
                        <p className='font-semibold'>{notification.title}</p>
                        {/* Unread indicator dot, clean and minimalist */}
                        {!notification.isRead && (
                            <div className="h-2 w-2 rounded-full bg-primary flex-shrink-0" aria-label="Unread" />
                        )}
                    </div>
                    <p className='text-sm text-muted-foreground'>{notification.message}</p>
                    
                    {/* --- THIS IS THE FIX --- */}
                    <p className="text-xs text-muted-foreground mt-1">
                      <RelativeTime date={notification.createdAt} />
                    </p>
                    {/* --- END OF FIX --- */}

                </div>
            </div>
        </div>
    </div>
  );

  // The entire card is clickable, either as a link or a regular div.
  return notification.linkUrl ? (
    <Link href={notification.linkUrl} onClick={handleClick} className="block">
      {cardContent}
    </Link>
  ) : (
    <div onClick={handleClick} className="cursor-pointer">
        {cardContent}
    </div>
  );
}