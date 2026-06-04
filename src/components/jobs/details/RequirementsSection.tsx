import { Card, CardContent } from '../../ui/card';

interface RequirementsSectionProps {
  requirements?: string[];
}

export function RequirementsSection({ requirements }: Readonly<RequirementsSectionProps>) {
  if (!requirements?.length) return null;

  return (
    <Card className="bg-white border border-gray-200 shadow-sm">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Requirements</h3>
        <div className="space-y-2">
          {requirements.map((req, index) => (
            <div key={index} className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-[#ff6b35] rounded-full mt-2 flex-shrink-0" />
              <span className="text-gray-700">{req}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
