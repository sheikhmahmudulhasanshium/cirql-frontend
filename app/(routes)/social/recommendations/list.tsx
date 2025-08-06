import { UserRecommendationCard } from './card';
import { SocialProfile } from '@/lib/types';

interface RecommendationListProps {
  layout?: 'grid' | 'horizontal';
  recommendations: SocialProfile[];
  onDismiss: (userId: string) => void;
  onAddFriend: (userId: string) => Promise<void>;
  onFollow: (userId: string) => Promise<void>;

}

export const RecommendationList = ({
  layout = 'grid',
  recommendations,
  onDismiss,
  onAddFriend,
  onFollow
}: RecommendationListProps) => {
  if (layout === 'horizontal') {
    return (
      <div className="flex overflow-x-auto gap-4 pb-4 -mx-2 px-2">
        {recommendations.map((socialProfile) => {
          if (typeof socialProfile.owner === 'object' && socialProfile.owner !== null) {
            return (
              <div key={socialProfile.owner.id} className="flex-shrink-0 w-[280px]">
                <UserRecommendationCard
                  profile={socialProfile.owner}
                  onDismiss={onDismiss}
                  onAddFriend={onAddFriend}
                  onFollow={onFollow}
                />
              </div>
            );
          }
          return null;
        })}
      </div>
    );
  }

  // Default: Grid layout
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {recommendations.map((socialProfile) => {
        if (typeof socialProfile.owner === 'object' && socialProfile.owner !== null) {
          return (
            <UserRecommendationCard
              key={socialProfile.owner.id}
              profile={socialProfile.owner}
              onDismiss={onDismiss}
              onAddFriend={onAddFriend}
                onFollow={onFollow} 
            />
          );
        }
        return null;
      })}
    </div>
  );
};
