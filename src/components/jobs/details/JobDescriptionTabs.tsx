import { useState } from 'react';
import { Card, CardContent } from '../../ui/card';

interface JobDescriptionTabsProps {
  description: string;
  company: string;
  companyIndustry?: string;
}

export function JobDescriptionTabs({
  description,
  company,
  companyIndustry
}: Readonly<JobDescriptionTabsProps>) {
  const [selectedTab, setSelectedTab] = useState<'description' | 'company'>('description');

  const companyContent = `Learn more about ${company} and what makes them a great place to work. Join a team that values innovation, growth, and making a meaningful impact in ${companyIndustry || 'the industry'}.`;

  return (
    <Card className="bg-white border border-gray-200 shadow-sm">
      <CardContent className="p-6">
        <div className="mb-6">
          <div className="flex gap-2 border-b border-gray-200">
            <button
              onClick={() => setSelectedTab('description')}
              className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
                selectedTab === 'description'
                  ? 'border-[#ff6b35] text-[#ff6b35]'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Job Description
            </button>
            <button
              onClick={() => setSelectedTab('company')}
              className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
                selectedTab === 'company'
                  ? 'border-[#ff6b35] text-[#ff6b35]'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              About Company
            </button>
          </div>
        </div>

        <div className="prose prose-gray max-w-none">
          <div className="text-gray-700 leading-relaxed whitespace-pre-line">
            {selectedTab === 'description' ? description : companyContent}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
