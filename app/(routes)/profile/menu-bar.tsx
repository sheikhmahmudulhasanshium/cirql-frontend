// app/(routes)/profile/menu-bar.tsx
'use client';

import React, { useState } from 'react';
import {
  UserCog, UserPlus, Rss, Share2, Eye, Settings, List, LogOut,
  LucideIcon, EllipsisVertical, MessageSquare, UserCheck, UserX,
} from 'lucide-react';
import Link from 'next/link';
import { ShareProfileModal } from '@/components/modals/profile/share-profile-modal';
import { MoreOptionsModal } from '@/components/modals/profile/more-option-modal';
import { EditProfileModal } from '@/components/modals/profile/edit-profile-modal';
// --- START: UPDATED IMPORTS ---
import { Profile, FriendshipStatus, FollowStatus } from '@/lib/types';
import { Button } from '@/components/ui/button';
import {
  followUser,
  unfollowUser,
  sendFriendRequest,
} from '@/components/hooks/profile/use-profile-actions';
import {
  acceptFriendRequest,
  cancelFriendRequest,
  rejectFriendRequest,
  unfriendUser,
} from '@/components/hooks/social/friend-actions';
import { cancelFollowRequest } from '@/components/hooks/social/follow-action';
import { ProfileMenuItem, ProfileMenuList } from '@/lib/menu';
// --- END: UPDATED IMPORTS ---

const iconMap: Record<string, LucideIcon> = {
  'user-cog': UserCog, 'user-plus': UserPlus, 'rss': Rss,
  'message-square': MessageSquare, 'share-2': Share2, 'eye': Eye,
  'settings': Settings, 'list': List, 'log-out': LogOut,
};

export const ProfileActions: React.FC<{
  type: 'me' | 'public';
  profile: Profile;
  screenWidth: number;
  onProfileUpdate: () => void;
}> = ({ type, profile, screenWidth, onProfileUpdate }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // --- REMOVED: All use...Requests hooks are no longer needed ---

  const [showShareModal, setShowShareModal] = useState(false);
  const [showMoreModal, setShowMoreModal] = useState(false);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);

  const items = ProfileMenuList.filter(item =>
    item.screen.includes(type) && item.key !== 'follow' && item.key !== 'add_friend'
  );

  const moreItem = ProfileMenuList.find(
    (item): item is Extract<ProfileMenuItem, { type: 'dropdown' }> =>
      item.key === 'more' && item.type === 'dropdown'
  );

  const getLabel = (width: number, long: string, short: string) => {
    if (width < 640) return '';
    if (width >= 640 && width < 768) return short;
    return long;
  };
  
  const handleAction = async (action: () => Promise<void>) => {
    setIsSubmitting(true);
    await action();
    // After action, the profile will be refetched by the parent component,
    // causing a re-render with the new state.
    setIsSubmitting(false);
  };

  // --- START: REWRITTEN FRIENDSHIP BUTTON LOGIC ---
  const renderFriendshipButton = () => {
    if (type !== 'public') return null;

    switch (profile.friendshipStatus) {
      case FriendshipStatus.FRIENDS:
        return (
          <Button variant="secondary" onClick={() => handleAction(() => unfriendUser(profile.id, onProfileUpdate))} disabled={isSubmitting}>
            <UserX className="w-5 h-5 mr-2" />Unfriend
          </Button>
        );
      
      case FriendshipStatus.REQUEST_SENT:
        return (
          <Button variant="secondary" onClick={() => handleAction(() => cancelFriendRequest(profile.friendRequestId!, onProfileUpdate))} disabled={isSubmitting}>
            <UserX className="w-5 h-5 mr-2" />Cancel Request
          </Button>
        );

      case FriendshipStatus.REQUEST_RECEIVED:
        return (
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => handleAction(() => rejectFriendRequest(profile.friendRequestId!, onProfileUpdate))} disabled={isSubmitting}>
              Decline
            </Button>
            <Button onClick={() => handleAction(() => acceptFriendRequest(profile.friendRequestId!, onProfileUpdate))} disabled={isSubmitting}>
              Accept
            </Button>
          </div>
        );

      case FriendshipStatus.NONE:
      default:
        return (
          <Button onClick={() => handleAction(() => sendFriendRequest(profile.id, onProfileUpdate))} disabled={isSubmitting}>
            <UserPlus className="w-5 h-5 mr-2" />Add Friend
          </Button>
        );
    }
  };
  // --- END: REWRITTEN FRIENDSHIP BUTTON LOGIC ---

  // --- START: REWRITTEN FOLLOW BUTTON LOGIC ---
  const renderFollowButton = () => {
    if (type !== 'public') return null;

    switch (profile.followStatus) {
      case FollowStatus.FOLLOWING:
        return (
          <Button variant="secondary" onClick={() => handleAction(() => unfollowUser(profile.id, onProfileUpdate))} disabled={isSubmitting}>
            <UserCheck className="w-5 h-5 mr-2" />Following
          </Button>
        );

      case FollowStatus.REQUEST_SENT:
        return (
          <Button variant="secondary" onClick={() => handleAction(() => cancelFollowRequest(profile.followRequestId!, onProfileUpdate))} disabled={isSubmitting}>
            <UserX className="w-5 h-5 mr-2" />Requested
          </Button>
        );

      case FollowStatus.NONE:
      default:
        if (profile.isPrivate) {
          return (
            <Button onClick={() => handleAction(() => followUser(profile.id, onProfileUpdate))} disabled={isSubmitting}>
              <Rss className="w-5 h-5 mr-2" />Request to Follow
            </Button>
          );
        }
        return (
          <Button onClick={() => handleAction(() => followUser(profile.id, onProfileUpdate))} disabled={isSubmitting}>
            <Rss className="w-5 h-5 mr-2" />Follow
          </Button>
        );
    }
  };
  // --- END: REWRITTEN FOLLOW BUTTON LOGIC ---

  return (
    <>
      <div className="flex gap-4 flex-wrap justify-center lg:justify-start">
        {renderFriendshipButton()}
        {renderFollowButton()}
        {items.map((item) => {
          const IconComponent = item.key === 'more' ? EllipsisVertical : (iconMap[item.icon] || null);
          const label = getLabel(screenWidth, item.label, item.shortLabel);

          if (item.type === 'link') {
            const href = item.linkUrl.replace('[id]', profile.id);
            return (
              <Link key={item.key} href={href} className="flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium text-primary hover:bg-primary/10" title={item.label}>
                {IconComponent && <IconComponent className="w-5 h-5" />}
                {label && <span>{label}</span>}
              </Link>
            );
          }
          if (item.type === 'modal') {
             const handleClick = () => {
              switch (item.modalName) {
                case 'EditProfileModal': setShowEditProfileModal(true); break;
                case 'ShareProfileModal': setShowShareModal(true); break;
              }
            };
            return (
              <button key={item.key} type="button" className="flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium text-primary hover:bg-primary/10" title={item.label} onClick={handleClick}>
                {IconComponent && <IconComponent className="w-5 h-5" />}
                {label && <span>{label}</span>}
              </button>
            );
          }
          if (item.type === 'dropdown') {
            return (
              <button key={item.key} type="button" className="flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium text-primary hover:bg-primary/10" title={item.label} onClick={() => setShowMoreModal(true)}>
                {label && <span>{label}</span>}
                <EllipsisVertical className="w-5 h-5" />
              </button>
            );
          }
          return null;
        })}
      </div>
      <>{/* Modals */}</>
      {showShareModal && <ShareProfileModal userId={profile.id} onClose={() => setShowShareModal(false)} />}
      {showMoreModal && moreItem && <MoreOptionsModal userId={profile.id} onClose={() => setShowMoreModal(false)} items={moreItem.items.filter(sub => sub.screen.includes(type))} />}
      {showEditProfileModal && <EditProfileModal profile={profile} onClose={() => setShowEditProfileModal(false)} onProfileUpdate={onProfileUpdate} />}
    </>
  );
};