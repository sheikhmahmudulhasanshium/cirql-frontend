'use client';

import Link from 'next/link';
import {
  Users,
  UserPlus,
  Sparkles,
  Bell,
  Send,
  User,
  Settings,
  MessageCircle,
  ArrowRight,
  UserCog,
} from 'lucide-react';
import { Card, CardDescription } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const ActionCard = ({
  href,
  icon: Icon,
  title,
  description,
  className,
}: {
  href: string;
  icon: React.ElementType;
  title: string;
  description: string;
  className?: string;
}) => (
  <Link href={href} className="block group">
    <Card
      className={cn(
        "relative w-full h-full p-6 flex flex-col justify-between overflow-hidden border-l-4 transition-all duration-300 ease-in-out",
        "hover:shadow-xl hover:scale-105",
        className
      )}
    >
      <div>
        <div className="mb-4">
          <Icon className="h-8 w-8 text-primary" />
        </div>
        <h3 className="font-bold text-lg text-foreground">{title}</h3>
        <CardDescription className="mt-1 text-muted-foreground">
          {description}
        </CardDescription>
      </div>
      <div className="mt-4 flex items-center text-sm font-semibold text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        Go Now <ArrowRight className="ml-2 h-4 w-4" />
      </div>
    </Card>
  </Link>
);

export const SocialActionsGrid = () => {
  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold mb-6">Quick Actions</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        <ActionCard
          href="/social"
          icon={Users}
          title="Social Overview"
          description="View all your social interactions in one place."
          className="border-l-blue-500 hover:border-blue-500"
        />

        <ActionCard
          href="/social/friends"
          icon={User}
          title="Your Friends"
          description="See and manage your current friends list."
          className="border-l-green-500 hover:border-green-500"
        />

        <ActionCard
          href="/social/followers"
          icon={UserPlus}
          title="Followers"
          description="People who are following you."
          className="border-l-purple-500 hover:border-purple-500"
        />

        <ActionCard
          href="/social/friend-requests"
          icon={Bell}
          title="Incoming Friend Requests"
          description="View and accept new friend requests."
          className="border-l-yellow-500 hover:border-yellow-500"
        />

        <ActionCard
          href="/social/follow-requests"
          icon={Bell}
          title="Follow Requests"
          description="Manage people requesting to follow you."
          className="border-l-indigo-500 hover:border-indigo-500"
        />

        <ActionCard
          href="/social/sent-requests"
          icon={Send}
          title="Sent Friend Requests"
          description="Check pending requests you've sent to others."
          className="border-l-pink-500 hover:border-pink-500"
        />

        <ActionCard
          href="/social/recommendations"
          icon={Sparkles}
          title="Find New People"
          description="Discover people based on your interests."
          className="border-l-teal-500 hover:border-teal-500 bg-gradient-to-tr from-primary/10 to-transparent"
        />

        <ActionCard
          href="/profile/me"
          icon={UserCog}
          title="Edit Profile"
          description="Customize your public profile details."
          className="border-l-orange-500 hover:border-orange-500"
        />

        <ActionCard
          href="/settings"
          icon={Settings}
          title="Preferences"
          description="Update your app and notification preferences."
          className="border-l-red-500 hover:border-red-500"
        />

        <ActionCard
          href="/announcements"
          icon={MessageCircle}
          title="Latest Announcements"
          description="See the latest news from the community."
          className="border-l-cyan-500 hover:border-cyan-500"
        />

        <ActionCard
          href="/contacts/new"
          icon={MessageCircle}
          title="Contact Support"
          description="Have feedback or need help? Reach our dev team."
          className="border-l-emerald-500 hover:border-emerald-500"
        />
      </div>
    </div>
  );
};
