'use client';

import React, { useState } from 'react';
import {
  UserCog,
  UserPlus,
  Rss,
  Share2,
  Eye,
  Settings,
  List,
  LogOut,
  LucideIcon,
  EllipsisVertical,
  MessageSquare,
} from 'lucide-react';
import Link from 'next/link';
import { ProfileMenuItem, ProfileMenuList } from '@/lib/menu';
import { ShareProfileModal } from '@/components/modals/profile/share-profile-modal';
import { MoreOptionsModal } from '@/components/modals/profile/more-option-modal';

import { EditProfileModal } from '@/components/modals/profile/edit-profile-modal';
import { AddFriendModal } from '@/components/modals/profile/add-friend-modal';
import { FollowPersonModal } from '@/components/modals/profile/follow-person-profile';

type IconKey =
  | 'user-cog'
  | 'user-plus'
  | 'rss'
  | 'message-square'
  | 'share-2'
  | 'eye'
  | 'settings'
  | 'list'
  | 'log-out';

const iconMap: Record<IconKey, LucideIcon> = {
  'user-cog': UserCog,
  'user-plus': UserPlus,
  'rss': Rss,
  'message-square': MessageSquare,
  'share-2': Share2,
  'eye': Eye,
  'settings': Settings,
  'list': List,
  'log-out': LogOut,
};

export const ProfileActions: React.FC<{
  type: 'me' | 'public';
  userId: string;
  screenWidth: number;
}> = ({ type, userId, screenWidth }) => {
  const [showShareModal, setShowShareModal] = useState(false);
  const [showMoreModal, setShowMoreModal] = useState(false);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [showFollowPersonModal, setShowFollowPersonModal] = useState(false);
  const [showAddFriendModal, setShowAddFriendModal] = useState(false);

  const items = ProfileMenuList.filter((item) => item.screen.includes(type)).slice(0, 4);

  const moreItem = ProfileMenuList.find(
    (item): item is Extract<ProfileMenuItem, { type: 'dropdown'; items: ProfileMenuItem[] }> =>
      item.key === 'more' && item.type === 'dropdown'
  );

  const getLabel = (item: ProfileMenuItem, width: number) => {
    if (width < 640) return '';
    if (width >= 640 && width < 768) return item.shortLabel;
    return item.label;
  };

  return (
    <>
      <div className="flex gap-4 flex-wrap justify-center lg:justify-start">
        {items.map((item) => {
          const IconComponent =
            item.key === 'more' ? EllipsisVertical : iconMap[item.icon as IconKey];
          const label = getLabel(item, screenWidth);

          if (item.key === 'share_profile') {
            return (
              <button
                key={item.key}
                type="button"
                className="flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium text-primary hover:bg-primary/10"
                title={item.label}
                onClick={() => setShowShareModal(true)}
              >
                <IconComponent className="w-5 h-5" />
                {label && <span>{label}</span>}
              </button>
            );
          }

          if (item.type === 'link') {
            const href = item.linkUrl.replace('[id]', userId);
            return (
              <Link
                key={item.key}
                href={href}
                className="flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium text-primary hover:bg-primary/10"
                title={item.label}
              >
                <IconComponent className="w-5 h-5" />
                {label && <span>{label}</span>}
              </Link>
            );
          }

          if (item.type === 'modal') {
            // Open correct dummy modal based on modalName
            const handleClick = () => {
              switch (item.modalName) {
                case 'EditProfileModal':
                  setShowEditProfileModal(true);
                  break;
                case 'FollowPersonModal':
                  setShowFollowPersonModal(true);
                  break;
                case 'AddFriendModal':
                  setShowAddFriendModal(true);
                  break;
                case 'ShareProfileModal':
                  setShowShareModal(true);
                  break;
                default:
                  console.log(`Open modal: ${item.modalName}`);
              }
            };

            return (
              <button
                key={item.key}
                type="button"
                className="flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium text-primary hover:bg-primary/10"
                title={item.label}
                onClick={handleClick}
              >
                <IconComponent className="w-5 h-5" />
                {label && <span>{label}</span>}
              </button>
            );
          }

          if (item.type === 'dropdown') {
            return (
              <button
                key={item.key}
                type="button"
                className="flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium text-primary hover:bg-primary/10"
                title={item.label}
                onClick={() => setShowMoreModal(true)}
              >
                {label && <span>{label}</span>}
                <EllipsisVertical className="w-5 h-5" />
              </button>
            );
          }

          return null;
        })}
      </div>

      {showShareModal && (
        <ShareProfileModal userId={userId} onClose={() => setShowShareModal(false)} />
      )}

      {showMoreModal && moreItem && (
        <MoreOptionsModal
          userId={userId}
          onClose={() => setShowMoreModal(false)}
          items={moreItem.items.filter((sub) => sub.screen.includes(type))}
        />
      )}

      {showEditProfileModal && <EditProfileModal onClose={() => setShowEditProfileModal(false)} />}
      {showFollowPersonModal && (
        <FollowPersonModal onClose={() => setShowFollowPersonModal(false)} />
      )}
      {showAddFriendModal && <AddFriendModal onClose={() => setShowAddFriendModal(false)} />}
    </>
  );
};
