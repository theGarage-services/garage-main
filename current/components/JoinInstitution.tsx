import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { 
  Building2, 
  Search, 
  MapPin, 
  Users, 
  Globe, 
  ArrowLeft,
  CheckCircle,
  Clock,
  AlertCircle,
  Send,
  Eye
} from 'lucide-react';
import { Alert, AlertDescription } from './ui/alert';

interface JoinInstitutionProps {
  onBack: () => void;
  onJoinRequest: (institutionData: any) => void;
  recruiterData: any;
}

export function JoinInstitution({ onBack, onJoinRequest, recruiterData }: Readonly<JoinInstitutionProps>) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedInstitution, setSelectedInstitution] = useState<any>(null);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [requestMessage, setRequestMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Sample institutions - in real app this would come from API search
  const sampleInstitutions = [
    {
      id: '1',
      institutionName: 'TechCorp Solutions',
      institutionType: 'corporation',
      industry: 'technology',
      size: '501-1000',
      location: 'San Francisco, CA',
      website: 'https://techcorp.com',
      description: 'Leading technology solutions provider specializing in enterprise software and cloud computing.',
      teamCount: 45,
      openPositions: 12,
      verificationStatus: 'verified',
      requiresApproval: true
    },
    {
      id: '2',
      institutionName: 'Global Healthcare Systems',
      institutionType: 'corporation',
      industry: 'healthcare',
      size: '1001-5000',
      location: 'Boston, MA',
      website: 'https://globalhealthcare.com',
      description: 'Comprehensive healthcare solutions and medical device manufacturing.',
      teamCount: 78,
      openPositions: 8,
      verificationStatus: 'verified',
      requiresApproval: true
    },
    {
      id: '3',
      institutionName: 'InnovateLab Startup',
      institutionType: 'startup',
      industry: 'technology',
      size: '11-50',
      location: 'Austin, TX',
      website: 'https://innovatelab.io',
      description: 'AI-powered solutions for modern businesses. Fast-growing startup environment.',
      teamCount: 8,
      openPositions: 15,
      verificationStatus: 'pending',
      requiresApproval: false
    },
    {
      id: '4',
      institutionName: 'Metropolitan University',
      institutionType: 'university',
      industry: 'education',
      size: '1001-5000',
      location: 'New York, NY',
      website: 'https://metrou.edu',
      description: 'Premier research university with focus on technology and innovation.',
      teamCount: 156,
      openPositions: 25,
      verificationStatus: 'verified',
      requiresApproval: true
    }
  ];

  const filteredInstitutions = searchTerm 
    ? sampleInstitutions.filter(inst => 
        inst.institutionName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inst.industry.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inst.location.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : sampleInstitutions;

  const handleJoinRequest = async () => {
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const requestData = {
        institution: selectedInstitution,
        recruiter: recruiterData,
        message: requestMessage,
        requestDate: new Date().toISOString(),
        status: selectedInstitution.requiresApproval ? 'pending' : 'approved'
      };
      
      onJoinRequest(requestData);
    } catch (error) {
      console.error('Error sending join request:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getVerificationBadge = (status: string) => {
    switch (status) {
      case 'verified':
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100 flex items-center gap-1">
            <CheckCircle className="w-3 h-3" />
            Verified
          </Badge>
        );
      case 'pending':
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            Pending
          </Badge>
        );
      default:
        return (
          <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            Unverified
          </Badge>
        );
    }
  };

  const getInstitutionTypeLabel = (type: string) => {
    const typeMap: { [key: string]: string } = {
      'corporation': 'Corporation',
      'startup': 'Startup',
      'nonprofit': 'Non-profit',
      'government': 'Government',
      'university': 'University',
      'healthcare': 'Healthcare',
      'consulting': 'Consulting',
      'agency': 'Agency',
      'other': 'Other'
    };
    return typeMap[type] || type;
  };

  const getIndustryLabel = (industry: string) => {
    const industryMap: { [key: string]: string } = {
      'technology': 'Technology',
      'finance': 'Finance & Banking',
      'healthcare': 'Healthcare',
      'education': 'Education',
      'manufacturing': 'Manufacturing',
      'retail': 'Retail & E-commerce',
      'consulting': 'Consulting',
      'media': 'Media & Entertainment',
      'energy': 'Energy & Utilities',
      'government': 'Government',
      'nonprofit': 'Non-profit',
      'other': 'Other'
    };
    return industryMap[industry] || industry;
  };

  if (showRequestForm && selectedInstitution) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-orange-50 to-gray-100 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-[#ff6b35] to-[#ff8c42] rounded-xl flex items-center justify-center">
                <Building2 className="w-7 h-7 text-white" />
              </div>
              <h1 className="text-3xl font-medium">
                <span className="text-gray-900">the</span>
                <span className="text-[#ff6b35]">Garage</span>
              </h1>
            </div>
            <h2 className="text-xl text-gray-700 mb-2">
              Request to Join Institution
            </h2>
            <p className="text-gray-500">
              Send a request to join {selectedInstitution.institutionName}
            </p>
          </div>

          <Card className="p-8 shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            {/* Institution Summary */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-medium">
                  {selectedInstitution.institutionName[0]}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium text-gray-900">{selectedInstitution.institutionName}</h3>
                    {getVerificationBadge(selectedInstitution.verificationStatus)}
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{selectedInstitution.description}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>{getInstitutionTypeLabel(selectedInstitution.institutionType)}</span>
                    <span>•</span>
                    <span>{getIndustryLabel(selectedInstitution.industry)}</span>
                    <span>•</span>
                    <span>{selectedInstitution.location}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Request Form */}
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="message">Message to Institution Admin</Label>
                <textarea
                  id="message"
                  placeholder="Introduce yourself and explain why you'd like to join this institution..."
                  value={requestMessage}
                  onChange={(e) => setRequestMessage(e.target.value)}
                  className="w-full min-h-[120px] p-3 border border-gray-300 rounded-md resize-none"
                  maxLength={500}
                />
                <div className="text-right text-sm text-gray-500">
                  {requestMessage.length}/500 characters
                </div>
              </div>

              {/* Your Information Summary */}
              <div className="space-y-2">
                <Label>Your Information</Label>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Name:</span>
                      <p className="font-medium">{recruiterData.firstName} {recruiterData.lastName}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Email:</span>
                      <p className="font-medium">{recruiterData.email}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Job Title:</span>
                      <p className="font-medium">{recruiterData.jobTitle}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Company:</span>
                      <p className="font-medium">{recruiterData.company || 'Not specified'}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Approval Notice */}
              {selectedInstitution.requiresApproval && (
                <Alert className="border-blue-200 bg-blue-50">
                  <Clock className="h-4 w-4 text-blue-600" />
                  <AlertDescription className="text-blue-700">
                    This institution requires admin approval for new members. You'll receive an email notification once your request is reviewed.
                  </AlertDescription>
                </Alert>
              )}
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6">
              <Button
                variant="outline"
                onClick={() => setShowRequestForm(false)}
                className="px-6"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Search
              </Button>

              <Button
                onClick={handleJoinRequest}
                disabled={isLoading || !requestMessage.trim()}
                className="px-8 bg-gradient-to-r from-[#ff6b35] to-[#ff8c42] hover:from-[#e55a2b] hover:to-[#d4461f]"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                    Sending Request...
                  </div>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Send Request
                  </>
                )}
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-orange-50 to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-[#ff6b35] to-[#ff8c42] rounded-xl flex items-center justify-center">
              <Building2 className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-3xl font-medium">
              <span className="text-gray-900">the</span>
              <span className="text-[#ff6b35]">Garage</span>
            </h1>
          </div>
          <h2 className="text-xl text-gray-700 mb-2">
            Join an Existing Institution
          </h2>
          <p className="text-gray-500">
            Search and request to join institutions already registered on theGarage
          </p>
        </div>

        <Card className="p-8 shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          {/* Search */}
          <div className="mb-6">
            <Label htmlFor="search" className="mb-2 block">Search Institutions</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                id="search"
                placeholder="Search by company name, industry, or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12"
              />
            </div>
          </div>

          {/* Results */}
          <div className="space-y-4">
            {filteredInstitutions.length === 0 ? (
              <div className="text-center py-8">
                <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No institutions found matching your search.</p>
              </div>
            ) : (
              filteredInstitutions.map((institution) => (
                <div key={institution.id} className="p-6 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-medium text-xl">
                        {institution.institutionName[0]}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-medium text-gray-900">{institution.institutionName}</h3>
                          {getVerificationBadge(institution.verificationStatus)}
                        </div>
                        
                        <p className="text-gray-600 mb-3">{institution.description}</p>
                        
                        <div className="flex items-center gap-6 text-sm text-gray-500 mb-3">
                          <span>{getInstitutionTypeLabel(institution.institutionType)}</span>
                          <span>•</span>
                          <span>{getIndustryLabel(institution.industry)}</span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {institution.location}
                          </span>
                        </div>

                        <div className="flex items-center gap-6 text-sm">
                          <div className="flex items-center gap-1 text-blue-600">
                            <Users className="w-4 h-4" />
                            <span>{institution.teamCount} team members</span>
                          </div>
                          <div className="flex items-center gap-1 text-green-600">
                            <Building2 className="w-4 h-4" />
                            <span>{institution.openPositions} open positions</span>
                          </div>
                          {institution.website && (
                            <a 
                              href={institution.website} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 text-[#ff6b35] hover:underline"
                            >
                              <Globe className="w-4 h-4" />
                              Website
                            </a>
                          )}
                        </div>

                        {institution.requiresApproval && (
                          <div className="mt-3">
                            <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100 flex items-center gap-1 w-fit">
                              <Clock className="w-3 h-3" />
                              Requires approval
                            </Badge>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-2"
                      >
                        <Eye className="w-4 h-4" />
                        View Details
                      </Button>
                      <Button
                        onClick={() => {
                          setSelectedInstitution(institution);
                          setShowRequestForm(true);
                        }}
                        size="sm"
                        className="bg-[#ff6b35] hover:bg-[#e55a2b] flex items-center gap-2"
                      >
                        <Send className="w-4 h-4" />
                        Request to Join
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Back Button */}
          <div className="flex justify-start pt-6 border-t border-gray-200">
            <Button
              variant="ghost"
              onClick={onBack}
              className="px-6"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Setup
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}