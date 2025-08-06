

// @/lib/menu.tsx
import {
  Cpu, Plane, Briefcase, Medal, Newspaper,
  BookOpen, Mic, Palette, Music, Tv, Gamepad, CookingPot,
  HeartPulse, Shirt, Camera, Code, Rocket, FlaskConical, 
  Landmark, Lightbulb, TrendingUp, Handshake, Dumbbell, Mountain,
  Bitcoin, Users, Atom, PenTool, Drama, Film, Gem, Target,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import {HomeIcon, MessageSquareIcon, PhoneIcon,  } from "lucide-react";
import { NavMenu } from "./types";


export const navbarMenu: NavMenu[] = [
    { href: '/home', label: 'Home', icon: <HomeIcon /> },
    { href: '/chats', label: 'Chats', icon: <MessageSquareIcon /> },
    { href: '/calls', label: 'Calls', icon: <PhoneIcon /> },

    //{ href: '/notifications', label: 'Notifications', icon: <BellIcon /> },

   // { href: '/settings', label: 'Settings', icon: <SettingsIcon /> },
];


export const footerLinks = [
        { href: "/about", label: "About" },
        { href: "/announcements", label: "Announcements" },

        { href: "/terms-and-conditions", label: "Terms & Conditions" },
        { href: "/privacy-policy", label: "Privacy Policy" },
        { href: "/sitemap.xml", label: "Sitemap" },
        { href:"/contacts", label: "Contacts"}
    ];







export type ProfileMenuType = "link" | "modal" | "dropdown";
export type ProfileScreenContext = "me" | "public";

export interface BaseMenuItem {
  key: string;
  label: string;
  shortLabel: string;
  icon: string; // Lucide icon name as string
  type: ProfileMenuType;
  screen: ProfileScreenContext[];
}

export interface LinkMenuItem extends BaseMenuItem {
  type: "link";
  linkUrl: string;
}

export interface ModalMenuItem extends BaseMenuItem {
  type: "modal";
  modalName: string;
}

export interface DropdownMenuItem extends BaseMenuItem {
  type: "dropdown";
  modalName: string; // e.g. "MoreOptionModal"
  items: (LinkMenuItem | ModalMenuItem)[];
}

export type ProfileMenuItem = LinkMenuItem | ModalMenuItem | DropdownMenuItem;

export const ProfileMenuList: ProfileMenuItem[] = [
  {
    key: "edit_profile",
    label: "Edit Profile",
    shortLabel: "Edit",
    icon: "user-cog",
    type: "modal",
    modalName: "EditProfileModal",
    screen: ["me"],
  },
  {
    key: "add_friend",
    label: "Add Friend",
    shortLabel: "Add",
    icon: "user-plus",
    type: "modal",
    modalName: "AddFriendModal",
    screen: ["public"],
  },
  {
    key: "follow",
    label: "Follow",
    shortLabel: "Follow",
    icon: "rss",
    type: "modal",
    modalName: "FollowPersonModal",
    screen: ["public"],
  },
  {
    key: "chats",
    label: "Message",
    shortLabel: "Message",
    icon: "message-square",
    type: "link",
    linkUrl: "/chats/[id]",
    screen: ["me", "public"],
  },
  {
    key: "share_profile",
    label: "Share Profile",
    shortLabel: "Share",
    icon: "share-2",
    type: "modal",
    modalName: "ShareProfileModal",
    screen: ["me", "public"],
  },
  {
    key: "more",
    label: "More",
    shortLabel: "More",
    icon: "EllipsisVertical",
    type: "dropdown",
    modalName: "MoreOptionModal",
    screen: ["me"],
    items: [
      {
        key: "view_as_public",
        label: "View as Public",
        shortLabel: "View",
        icon: "eye",
        type: "link",
        linkUrl: "/profile/[id]",
        screen: ["me"],
      },
      {
        key: "settings",
        label: "Settings",
        shortLabel: "Settings",
        icon: "settings",
        type: "link",
        linkUrl: "/settings",
        screen: ["me"],
      },
      {
        key: "my_activity",
        label: "My Activity",
        shortLabel: "Activity",
        icon: "list",
        type: "link",
        linkUrl: "/activity",
        screen: ["me"],
      },
      {
        key: "sign_out",
        label: "Sign Out",
        shortLabel: "Logout",
        icon: "log-out",
        type: "link",
        linkUrl: "/sign-out",
        screen: ["me"],
      },
    ],
  },
];

// --- Comprehensive Interests List with Icons ---
export const InterestsList: { name: string; icon: LucideIcon }[] = [
  { name: 'Art & Design', icon: Palette },
  { name: 'Books & Literature', icon: BookOpen },
  { name: 'History', icon: Landmark },
  { name: 'Movies & TV Shows', icon: Film },
  { name: 'Music', icon: Music },
  { name: 'Photography', icon: Camera },
  { name: 'Philosophy & Psychology', icon: Lightbulb },
  { name: 'Theatre & Performing Arts', icon: Drama },
  { name: 'AI & Machine Learning', icon: Cpu },
  { name: 'Coding & Programming', icon: Code },
  { name: 'Gadgets & Devices', icon: Tv },
  { name: 'Gaming & Esports', icon: Gamepad },
  { name: 'Research & Discoveries', icon: FlaskConical },
  { name: 'Science & Technology', icon: Atom },
  { name: 'Space & Astronomy', icon: Rocket },
  { name: 'Comedy & Memes', icon: Mic },
  { name: 'Fashion & Style', icon: Shirt },
  { name: 'Pop Culture', icon: Gem },
  { name: 'Cars & Auto', icon: Target },
  { name: 'Food & Cuisine', icon: CookingPot },
  { name: 'Health & Wellness', icon: HeartPulse },
  { name: 'DIY & Crafts', icon: PenTool },
  { name: 'Travel & Adventure', icon: Plane },
  { name: 'Business & Economy', icon: Briefcase },
  { name: 'Finance & Investing', icon: Bitcoin },
  { name: 'Startups & Entrepreneurship', icon: TrendingUp },
  { name: 'Politics & Governance', icon: Users },
  { name: 'Current Affairs', icon: Newspaper },
  { name: 'Social Issues & Activism', icon: Handshake },
  { name: 'Sports', icon: Medal },
  { name: 'Fitness & Gym', icon: Dumbbell },
  { name: 'Outdoor Activities', icon: Mountain },
];
