import { ArrowLeft } from 'lucide-react';
import { Button } from '../../ui/button';
import { ProfileDropdown } from '../../profile/ProfileDropdown';

interface JobHeaderProps {
  onBack: () => void;
  onNavigate?: (view: string) => void;
  onLogout?: () => void;
  fromTracker: boolean;
  isPremium: boolean;
  user?: any;
}

export function JobHeader({
  onBack,
  onNavigate,
  onLogout,
  fromTracker,
  isPremium,
  user
}: Readonly<JobHeaderProps>) {
  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50 shadow-lg shadow-gray-900/5">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="rounded-full hover:bg-gray-100 flex items-center gap-2 px-3 h-10"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm font-medium">
                {fromTracker ? 'Back to Tracker' : 'Back'}
              </span>
            </Button>
            <button
              onClick={() => onNavigate?.('homepage')}
              className="flex items-center gap-3 hover:opacity-80 transition-opacity"
            >
              <span className="text-xl font-medium">
                <span className="text-gray-900">the</span>
                <span className="text-[#ff6b35]">Garage</span>
              </span>
            </button>
          </div>

          <div className="flex items-center gap-4">
            <ProfileDropdown
              onNavigate={onNavigate || (() => {})}
              onLogout={onLogout}
              isPremium={isPremium}
              userName={user ? `${user.firstName} ${user.lastName}` : 'User'}
              userEmail={user?.email || 'user@example.com'}
              userAvatar={user?.avatar}
            />
          </div>
        </div>
      </div>
    </header>
  );
}
