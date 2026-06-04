import { useState, useEffect, MouseEvent, useCallback } from 'react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Switch } from '../ui/switch';
import { Search, Sparkles, TrendingUp, Zap, X, Check, Star, Filter, ArrowLeft, Crown, Bot, Lock, Award, Sliders, Pause } from 'lucide-react';
import { QueuePreferencesModal } from './QueuePreferencesModal';
import type { IndividualJobPreferences } from '../auth/signup-steps/PreferencesStep';
import { queueService, type Queue } from '../../api/queueService';

interface QueueSelectorProps {
  onClose: () => void;
  currentQueues: string[];
  onUpdateQueues: (selectedQueues: string[]) => void;
  queueStatuses?: Record<string, boolean>;
  onUpdateQueueStatuses?: (statuses: Record<string, boolean>) => void;
  user?: any;
}

// AI Queue IDs - constant outside component
const AI_QUEUE_IDS = ['data-engineer', 'product-analyst', 'business-intelligence'];

// Helper functions extracted outside component to reduce cognitive complexity
function getRankColor(rank: number, total: number): string {
  const percentage = (rank / total) * 100;
  if (percentage <= 25) return 'text-emerald-600';
  if (percentage <= 50) return 'text-[#ff6b35]';
  if (percentage <= 75) return 'text-amber-600';
  return 'text-rose-600';
}

function getMatchColor(match: number): string {
  if (match >= 85) return 'bg-emerald-50 text-emerald-700 border-emerald-200';
  if (match >= 75) return 'bg-orange-50 text-[#ff6b35] border-orange-200';
  return 'bg-amber-50 text-amber-700 border-amber-200';
}

function filterQueues(queues: Queue[], searchQuery: string, selectedCategory: string): Queue[] {
  const lowerQuery = searchQuery.toLowerCase();
  return queues.filter(queue => {
    const matchesSearch = queue.title.toLowerCase().includes(lowerQuery) ||
                         queue.description.toLowerCase().includes(lowerQuery) ||
                         queue.requiredSkills?.some(skill => skill.toLowerCase().includes(lowerQuery));
    const matchesCategory = selectedCategory === 'All' || queue.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });
}

interface ManualQueueCardProps {
  queue: Queue;
  selectedQueues: string[];
  onToggle: (queueId: string) => void;
}

function ManualQueueCard({ queue, selectedQueues, onToggle }: Readonly<ManualQueueCardProps>) {
  const IconComponent = queue.icon;
  const isSelected = selectedQueues.includes(queue.id);
  const canSelect = selectedQueues.length < 2 || isSelected;
  const isFull = selectedQueues.length >= 2;

  return (
    <Card
      className={`group p-5 border-2 transition-all duration-300 ${
        isSelected
          ? 'border-[#ff6b35] bg-orange-50/50 shadow-lg shadow-orange-100/50'
          : 'border-gray-200 bg-white hover:border-gray-300'
      }`}
    >
      <div className="flex items-start gap-4">
        <div className={`w-12 h-12 ${queue.color} rounded-xl flex items-center justify-center shadow-md transition-transform group-hover:scale-110`}>
          <IconComponent className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-1">
            <h3 className="font-semibold text-gray-900 text-sm">{queue.title}</h3>
            {isSelected && (
              <Badge className="bg-[#ff6b35] text-white border-0 ml-2 shrink-0">
                <Check className="w-3 h-3 mr-1" />
                Selected
              </Badge>
            )}
          </div>
          <p className="text-xs text-gray-600 mb-2 line-clamp-2">{queue.description}</p>
          <div className="flex items-center gap-3 text-xs">
            <span className="text-gray-500">{queue.category}</span>
            <span className="text-gray-300">|</span>
            <span className={`font-medium ${getMatchColor(queue.match)}`}>
              {queue.match}% match
            </span>
          </div>
        </div>
      </div>

      <Button
        size="sm"
        className={`w-full mt-4 transition-all ${
          isSelected
            ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            : canSelect
            ? 'bg-[#ff6b35] text-white hover:bg-[#e55a2b] shadow-md shadow-orange-200'
            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
        }`}
        onClick={() => onToggle(queue.id)}
        disabled={!canSelect && !isSelected}
      >
        {isSelected ? (
          <>
            <X className="w-4 h-4 mr-2" />
            Remove
          </>
        ) : isFull ? (
          <>
            <Lock className="w-4 h-4 mr-2" />
            Limit Reached
          </>
        ) : (
          <>
            <Star className="w-4 h-4 mr-2" />
            Select Queue
          </>
        )}
      </Button>
    </Card>
  );
}

interface LockedQueuePreviewProps {
  queues: Queue[];
  onUpgrade: () => void;
}

function LockedQueuePreview({ queues, onUpgrade }: Readonly<LockedQueuePreviewProps>) {
  return (
    <div className="relative">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 opacity-30 pointer-events-none blur-sm">
        {queues.filter(q => !AI_QUEUE_IDS.includes(q.id)).slice(0, 8).map((queue) => {
          const IconComponent = queue.icon;
          return (
            <Card key={queue.id} className="p-5 border border-gray-200 bg-white">
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 ${queue.color} rounded-xl flex items-center justify-center`}>
                  <IconComponent className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm">{queue.title}</h3>
                  <p className="text-xs text-gray-600">{queue.category}</p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-orange-200 p-8 text-center shadow-xl">
          <Lock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Manual Queue Selection</h3>
          <p className="text-sm text-gray-600 mb-4 max-w-xs">Upgrade to Premium to unlock manual queue selection and customize your job matching experience.</p>
          <Button
            onClick={onUpgrade}
            className="bg-gradient-to-r from-[#ff6b35] to-[#ff8c42] hover:from-[#e55a2b] hover:to-[#ff6b35] text-white"
          >
            <Crown className="w-4 h-4 mr-2" />
            Upgrade to Premium
          </Button>
        </div>
      </div>
    </div>
  );
}

interface SearchFilterSectionProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  categories: string[];
}

function SearchFilterSection({ searchQuery, onSearchChange, selectedCategory, onCategoryChange, categories }: Readonly<SearchFilterSectionProps>) {
  return (
    <div className="bg-white rounded-xl border border-orange-100 p-4 mb-6 shadow-sm">
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search by title, skills, or company..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 border-orange-100 focus:border-[#ff6b35] focus:ring-[#ff6b35]"
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0">
          <Filter className="w-4 h-4 text-gray-500 flex-shrink-0" />
          <div className="flex gap-2">
            {categories.map(category => (
              <Button
                key={category}
                size="sm"
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => onCategoryChange(category)}
                className={selectedCategory === category
                  ? "bg-[#ff6b35] hover:bg-[#e55a2b] text-white"
                  : "border-orange-200 text-gray-700 hover:bg-orange-50 hover:border-[#ff6b35]"}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

interface AIQueuesSectionProps {
  queues: Queue[];
  localQueueStatuses: Record<string, boolean>;
  onStatusToggle: (queueId: string, isActive: boolean) => void;
  onOpenPreferences: (queue: Queue, e: React.MouseEvent) => void;
}

function AIQueuesSection({ queues, localQueueStatuses, onStatusToggle, onOpenPreferences }: Readonly<AIQueuesSectionProps>) {
  return (
    <div className="mb-10">
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl text-gray-900 mb-1">AI-Recommended Queues</h2>
            <p className="text-sm text-gray-600 leading-relaxed max-w-2xl">
              These queues are automatically selected and optimized based on your profile, skills, and career preferences.
            </p>
          </div>
        </div>
        <Badge variant="outline" className="border-blue-200 text-blue-700 bg-blue-50/80 px-3 py-1.5">
          <Sparkles className="w-3 h-3 mr-1.5" />
          Always Active
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {queues.filter(q => AI_QUEUE_IDS.includes(q.id)).map((queue) => (
          <AIQueueCard
            key={queue.id}
            queue={queue}
            queueStatus={localQueueStatuses[queue.id] ?? true}
            onStatusToggle={onStatusToggle}
            onOpenPreferences={onOpenPreferences}
          />
        ))}
      </div>
    </div>
  );
}

interface AIQueueCardProps {
  queue: Queue;
  queueStatus: boolean;
  onStatusToggle: (queueId: string, isActive: boolean) => void;
  onOpenPreferences: (queue: Queue, e: React.MouseEvent) => void;
}

function AIQueueCard({ queue, queueStatus, onStatusToggle, onOpenPreferences }: Readonly<AIQueueCardProps>) {
  const IconComponent = queue.icon;

  return (
    <Card key={queue.id} className="group p-6 border-2 border-orange-100 bg-white hover:shadow-xl hover:shadow-orange-100/50 transition-all duration-300 hover:-translate-y-1 hover:border-[#ff6b35]">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-14 h-14 ${queue.color} rounded-xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-110`}>
          <IconComponent className="w-7 h-7 text-white" />
        </div>
        <div className="flex flex-col items-end gap-2">
          <Badge className="bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border border-blue-200">
            <Bot className="w-3 h-3 mr-1" />
            AI
          </Badge>
          <Badge variant="outline" className={getMatchColor(queue.match)}>
            {queue.match}% match
          </Badge>
        </div>
      </div>

      <h3 className="font-semibold text-gray-900 mb-2">{queue.title}</h3>
      <p className="text-sm text-gray-600 mb-4 leading-relaxed">{queue.description}</p>

      <div className="space-y-3 mb-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Your Rank</span>
          <span className={`font-semibold ${getRankColor(queue.estimatedRank ?? 0, queue.totalInQueue ?? 100)}`}>
            #{queue.estimatedRank ?? 0} of {queue.totalInQueue ?? 100}
          </span>
        </div>
        <div className="w-full bg-orange-50 rounded-full h-2">
          <div
            className="h-2 rounded-full bg-gradient-to-r from-[#ff6b35] to-[#ff8c42] shadow-sm"
            style={{ width: `${100 - ((queue.estimatedRank ?? 0) / (queue.totalInQueue ?? 100)) * 100}%` }}
          ></div>
        </div>
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>{queue.avgSalary}</span>
          <span className="flex items-center gap-1 text-emerald-600 font-medium">
            <TrendingUp className="w-3 h-3" />
            {queue.growthRate}
          </span>
        </div>
      </div>

      {/* Status Toggle */}
      <div className="pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {queueStatus ? (
              <div className="flex items-center gap-2 text-emerald-600">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="text-sm font-medium">Active</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-gray-500">
                <Pause className="w-4 h-4" />
                <span className="text-sm">Paused</span>
              </div>
            )}
          </div>
          <Switch
            checked={queueStatus}
            onCheckedChange={(checked: boolean) => onStatusToggle(queue.id, checked)}
            className="data-[state=checked]:bg-[#ff6b35]"
          />
        </div>
      </div>

      {/* Preferences Button */}
      <div className="mt-3">
        <Button
          size="sm"
          variant="outline"
          onClick={(e: MouseEvent) => onOpenPreferences(queue, e)}
          className="w-full border-[#ff6b35] text-[#ff6b35] hover:bg-[#ff6b35] hover:text-white transition-all"
        >
          <Sliders className="w-4 h-4 mr-2" />
          Preferences
        </Button>
      </div>
    </Card>
  );
}

interface ManualQueueSectionProps {
  isPremium: boolean;
  selectedQueues: string[];
  availableQueues: Queue[];
  filteredQueues: Queue[];
  searchQuery: string;
  selectedCategory: string;
  categories: string[];
  onSearchChange: (value: string) => void;
  onCategoryChange: (category: string) => void;
  onQueueToggle: (queueId: string) => void;
  onShowPremiumPrompt: () => void;
}

function ManualQueueSection({
  isPremium,
  selectedQueues,
  availableQueues,
  filteredQueues,
  searchQuery,
  selectedCategory,
  categories,
  onSearchChange,
  onCategoryChange,
  onQueueToggle,
  onShowPremiumPrompt
}: Readonly<ManualQueueSectionProps>) {
  return (
    <div className="mb-8">
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-start gap-4">
          <div className={`w-12 h-12 ${isPremium ? 'bg-gradient-to-br from-[#ff6b35] to-[#ff8c42]' : 'bg-gray-200'} rounded-xl flex items-center justify-center shadow-lg ${isPremium ? 'shadow-orange-500/30' : ''}`}>
            {isPremium ? (
              <Award className="w-6 h-6 text-white" />
            ) : (
              <Lock className="w-6 h-6 text-gray-400" />
            )}
          </div>
          <div>
            <h2 className="text-xl text-gray-900 mb-1">Manual Queue Selection</h2>
            <p className="text-sm text-gray-600 leading-relaxed max-w-2xl">
              {isPremium
                ? 'Select up to 2 additional queues that align perfectly with your career goals.'
                : 'Upgrade to Premium to manually select 2 additional queues beyond your AI recommendations.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {isPremium ? (
            <Badge variant="outline" className={`${selectedQueues.length === 2 ? 'border-[#ff6b35] text-[#ff6b35] bg-orange-50' : 'border-gray-300 text-gray-700 bg-white'} px-3 py-1.5`}>
              {selectedQueues.length}/2 Selected
              {selectedQueues.length === 2 && <Check className="w-3 h-3 ml-1.5" />}
            </Badge>
          ) : (
            <Button
              size="sm"
              onClick={onShowPremiumPrompt}
              className="bg-gradient-to-r from-[#ff6b35] to-[#ff8c42] hover:from-[#e55a2b] hover:to-[#ff6b35] text-white shadow-md hover:shadow-lg transition-all"
            >
              <Crown className="w-4 h-4 mr-2" />
              Upgrade to Premium
            </Button>
          )}
        </div>
      </div>

      {/* Search and Filter Controls - Premium Only */}
      {isPremium && <SearchFilterSection searchQuery={searchQuery} onSearchChange={onSearchChange} selectedCategory={selectedCategory} onCategoryChange={onCategoryChange} categories={categories} />}

      {/* Queue Grid */}
      {isPremium ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredQueues.filter(q => !AI_QUEUE_IDS.includes(q.id)).map((queue) => (
            <ManualQueueCard key={queue.id} queue={queue} selectedQueues={selectedQueues} onToggle={onQueueToggle} />
          ))}
        </div>
      ) : (
        <LockedQueuePreview queues={availableQueues} onUpgrade={onShowPremiumPrompt} />
      )}
    </div>
  );
}

interface PremiumModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function PremiumModal({ isOpen, onClose }: Readonly<PremiumModalProps>) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="max-w-lg w-full p-8 relative shadow-2xl border-2 border-orange-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-orange-50 rounded-lg transition-colors"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>

        <div className="text-center mb-6">
          <div className="w-20 h-20 bg-gradient-to-br from-[#ff6b35] to-[#ff8c42] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-orange-500/30">
            <Crown className="w-10 h-10 text-white" />
          </div>
          <h3 className="text-2xl font-semibold text-gray-900 mb-2">Upgrade to Premium</h3>
          <p className="text-gray-600">
            Take full control of your job search with manual queue selection
          </p>
        </div>

        <div className="space-y-3 mb-6">
          <div className="flex items-start gap-3 p-4 bg-emerald-50 rounded-xl border border-emerald-200">
            <div className="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <Check className="w-3 h-3 text-white" />
            </div>
            <div>
              <p className="font-medium text-gray-900">3 AI-Recommended Queues</p>
              <p className="text-sm text-gray-600">Automatically optimized for your profile</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl border-2 border-[#ff6b35]">
            <Star className="w-5 h-5 text-[#ff6b35] mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium text-gray-900">+ 2 Manual Queues</p>
              <p className="text-sm text-gray-600">Choose any roles that match your goals</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-4 bg-purple-50 rounded-xl border border-purple-200">
            <Zap className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium text-gray-900">Advanced Features</p>
              <p className="text-sm text-gray-600">Analytics, priority support, and more</p>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1 border-orange-200 hover:bg-orange-50"
          >
            Maybe Later
          </Button>
          <Button
            onClick={() => {
              onClose();
              alert('Upgrade flow would open here');
            }}
            className="flex-1 bg-gradient-to-r from-[#ff6b35] to-[#ff8c42] hover:from-[#e55a2b] hover:to-[#ff6b35] text-white shadow-lg"
          >
            <Crown className="w-4 h-4 mr-2" />
            Upgrade Now
          </Button>
        </div>
      </Card>
    </div>
  );
}

interface QueueSelectorHeaderProps {
  isPremium: boolean;
  onClose: () => void;
}

function QueueSelectorHeader({ isPremium, onClose }: Readonly<QueueSelectorHeaderProps>) {
  return (
    <div className="bg-white/60 backdrop-blur-md border-b border-orange-100 sticky top-0 z-10 shadow-sm">
      <div className="container mx-auto px-6 py-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-gray-700 hover:text-gray-900 hover:bg-orange-50 rounded-lg"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl text-gray-900">Queue Management</h1>
                {isPremium && (
                  <Badge className="bg-gradient-to-r from-[#ff6b35] to-[#ff8c42] text-white border-0 shadow-sm px-3 py-1">
                    <Crown className="w-3 h-3 mr-1.5" />
                    Premium
                  </Badge>
                )}
              </div>
              <p className="text-sm text-gray-600 mt-1">
                {isPremium
                  ? 'Manage your AI-recommended queues and custom selections'
                  : 'View your AI-optimized job queues'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm border border-orange-100">
              <div className="w-2 h-2 rounded-full bg-[#ff6b35] animate-pulse"></div>
              <span className="text-gray-700 font-medium">{isPremium ? '5' : '3'} Active Queues</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface FooterActionsProps {
  isPremium: boolean;
  selectedQueues: string[];
  onSave: () => void;
  onCancel: () => void;
}

function FooterActions({ isPremium, selectedQueues, onSave, onCancel }: Readonly<FooterActionsProps>) {
  return (
    <div className="flex items-center justify-between pt-6 border-t border-orange-100 bg-white/80 backdrop-blur-sm sticky bottom-0 -mx-6 px-6 py-4 rounded-t-xl shadow-lg">
      <div className="text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-[#ff6b35]"></div>
            <span className="font-medium text-gray-900">
              {isPremium
                ? `${AI_QUEUE_IDS.length} AI + ${selectedQueues.length} Manual = ${AI_QUEUE_IDS.length + selectedQueues.length} Total`
                : `${AI_QUEUE_IDS.length} AI Queues Active`}
            </span>
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <Button
          variant="outline"
          onClick={onCancel}
          className="border-orange-200 text-gray-700 hover:bg-orange-50 hover:border-[#ff6b35]"
        >
          Cancel
        </Button>
        <Button
          onClick={onSave}
          disabled={isPremium && selectedQueues.length !== 2}
          className="bg-gradient-to-r from-[#ff6b35] to-[#ff8c42] hover:from-[#e55a2b] hover:to-[#ff6b35] text-white shadow-md hover:shadow-lg transition-all"
        >
          <Check className="w-4 h-4 mr-2" />
          Save Changes
        </Button>
      </div>
    </div>
  );
}

export function QueueSelector({ onClose, currentQueues, onUpdateQueues, queueStatuses = {}, onUpdateQueueStatuses, user }: Readonly<QueueSelectorProps>) {
  const isPremium = user?.isPremium || false;
  
  // For premium users, filter out the AI queues to get manual selections
  // For basic users, no manual selections allowed
  const getInitialManualSelections = useCallback(() => {
    if (!isPremium) return [];
    return currentQueues.filter(id => !AI_QUEUE_IDS.includes(id));
  }, [isPremium, currentQueues]);
  
  const [selectedQueues, setSelectedQueues] = useState<string[]>(getInitialManualSelections());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [localQueueStatuses, setLocalQueueStatuses] = useState<Record<string, boolean>>(queueStatuses);
  const [showPremiumPrompt, setShowPremiumPrompt] = useState(false);
  const [showPreferencesModal, setShowPreferencesModal] = useState(false);
  const [selectedQueueForPreferences, setSelectedQueueForPreferences] = useState<any>(null);
  const [queuePreferences, setQueuePreferences] = useState<Record<string, IndividualJobPreferences>>({});
  const [availableQueues, setAvailableQueues] = useState<Queue[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch available queues from backend
  useEffect(() => {
    const fetchQueues = async () => {
      setIsLoading(true);
      try {
        const data = await queueService.getAvailableQueues();
        // Transform API data to Queue format
        const transformedQueues: Queue[] = data.map((item: any) => ({
          id: `${item.industry}-${item.level}`,
          title: `${item.industry} - ${item.level}`,
          description: `Queue for ${item.industry} at ${item.level} level`,
          industry: item.industry,
          level: item.level,
          current: 0,
          total: item.candidate_count || 0,
          trend: 'stable',
          match: 0,
          change: 0,
          isAuto: true,
          userSelected: false,
          category: item.industry,
        }));
        setAvailableQueues(transformedQueues);
      } catch (error) {
        console.error('Failed to fetch available queues:', error);
        setAvailableQueues([]);
      } finally {
        setIsLoading(false);
      }
    };

    void fetchQueues();
  }, []);

  // Use API data only
  const queues = availableQueues;

  const filteredQueues = filterQueues(queues, searchQuery, selectedCategory);

  const handleQueueToggle = (queueId: string) => {
    // Basic users cannot manually select queues - premium only feature
    if (!isPremium) {
      setShowPremiumPrompt(true);
      return;
    }

    if (selectedQueues.includes(queueId)) {
      setSelectedQueues(selectedQueues.filter(id => id !== queueId));
    } else if (selectedQueues.length < 2) {  // Premium users get 2 manual queues
      setSelectedQueues([...selectedQueues, queueId]);
    }
  };

  const handleSave = () => {
    // NEW STRUCTURE:
    // Basic users: 3 AI queues (data-engineer, product-analyst, business-intelligence)
    // Premium users: 3 AI queues + 2 manual queues
    const allQueues = isPremium ? [...AI_QUEUE_IDS, ...selectedQueues] : AI_QUEUE_IDS;
    
    onUpdateQueues(allQueues);
    
    // Update queue statuses if callback provided
    if (onUpdateQueueStatuses) {
      onUpdateQueueStatuses(localQueueStatuses);
    }
    
    onClose();
  };

  const handleStatusToggle = (queueId: string, isActive: boolean) => {
    setLocalQueueStatuses(prev => ({
      ...prev,
      [queueId]: isActive
    }));
  };

  const handleOpenPreferences = (queue: Queue, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click
    setSelectedQueueForPreferences(queue);
    setShowPreferencesModal(true);
  };

  const handleSavePreferences = (queueId: string, preferences: IndividualJobPreferences, applyToAll: boolean) => {
    if (applyToAll) {
      // Apply to all queues
      const allQueueIds = isPremium
        ? [...AI_QUEUE_IDS, ...selectedQueues]
        : AI_QUEUE_IDS;
      const updatedPreferences: Record<string, IndividualJobPreferences> = {};
      allQueueIds.forEach(id => {
        updatedPreferences[id] = preferences;
      });
      setQueuePreferences(updatedPreferences);
    } else {
      setQueuePreferences(prev => ({ ...prev, [queueId]: preferences }));
    }
    setShowPreferencesModal(false);
  };

  const categories = ['All', 'Engineering', 'Analytics', 'AI/ML', 'Science', 'Cloud', 'Operations', 'Product', 'Security', 'Development', 'Architecture', 'Business'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-orange-50">
      {isLoading ? (
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ff6b35]"></div>
          <span className="ml-3 text-gray-600">Loading queues...</span>
        </div>
      ) : (
      <>
      <QueueSelectorHeader isPremium={isPremium} onClose={onClose} />

      <div className="container mx-auto px-6 py-8 max-w-7xl">
        <AIQueuesSection
          queues={availableQueues}
          localQueueStatuses={localQueueStatuses}
          onStatusToggle={handleStatusToggle}
          onOpenPreferences={handleOpenPreferences}
        />

        <ManualQueueSection
          isPremium={isPremium}
          selectedQueues={selectedQueues}
          availableQueues={availableQueues}
          filteredQueues={filteredQueues}
          searchQuery={searchQuery}
          selectedCategory={selectedCategory}
          categories={categories}
          onSearchChange={setSearchQuery}
          onCategoryChange={setSelectedCategory}
          onQueueToggle={handleQueueToggle}
          onShowPremiumPrompt={() => setShowPremiumPrompt(true)}
        />

        <FooterActions isPremium={isPremium} selectedQueues={selectedQueues} onSave={handleSave} onCancel={onClose} />
      </div>

      <PremiumModal isOpen={showPremiumPrompt} onClose={() => setShowPremiumPrompt(false)} />

      {/* Queue Preferences Modal */}
      {selectedQueueForPreferences && (
        <QueuePreferencesModal
          isOpen={showPreferencesModal}
          onClose={() => {
            setShowPreferencesModal(false);
            setSelectedQueueForPreferences(null);
          }}
          queueId={selectedQueueForPreferences.id}
          queueTitle={selectedQueueForPreferences.title}
          currentPreferences={queuePreferences[selectedQueueForPreferences.id]}
          onSave={handleSavePreferences}
        />
      )}
      </>
      )}
    </div>
  );
}
