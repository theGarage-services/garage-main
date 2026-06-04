import { MessageCircle, Crown } from 'lucide-react';
import { Card, CardContent } from '../../ui/card';
import { Button } from '../../ui/button';

export function PremiumChatTeaser() {
  return (
    <Card className="bg-gradient-to-br from-purple-50 to-blue-50 border-2 border-purple-200 shadow-lg">
      <CardContent className="p-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <MessageCircle className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Connect with Recruiters</h3>
          <p className="text-sm text-gray-600 mb-4">
            Apply for this position to unlock direct chat with the hiring team
          </p>
          <div className="space-y-2 text-sm text-gray-600 mb-4">
            <div className="flex items-center justify-center gap-2">
              <Crown className="w-4 h-4 text-purple-500" />
              <span>Premium feature available after application</span>
            </div>
          </div>
          <Button className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white">
            Apply Now to Unlock Chat
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
