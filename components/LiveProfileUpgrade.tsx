import { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Plus, Trash2, Zap, GraduationCap, Award, Briefcase, Code, FileText, Users } from 'lucide-react';

interface LiveProfileUpgradeProps {
  onSimulationComplete: (results: any) => void;
  userQueues?: string[];
  allJobQueues?: any[];
}

interface ProfileAddition {
  id: string;
  type: 'education' | 'certification' | 'skill' | 'experience' | 'project' | 'publication' | 'volunteer';
  data: any;
}

export function LiveProfileUpgrade({ onSimulationComplete, userQueues = [], allJobQueues = [] }: Readonly<LiveProfileUpgradeProps>) {
  const [additions, setAdditions] = useState<ProfileAddition[]>([]);
  const [isSimulating, setIsSimulating] = useState(false);

  const addItem = (type: ProfileAddition['type']) => {
    const newItem: ProfileAddition = {
      id: Date.now().toString(),
      type,
      data: getDefaultData(type)
    };
    setAdditions([...additions, newItem]);
  };

  const getDefaultData = (type: ProfileAddition['type']) => {
    switch (type) {
      case 'education':
        return { institution: '', degree: '', field: '', startDate: '', endDate: '', gpa: '', location: '' };
      case 'certification':
        return { name: '', issuer: '', date: '', expiryDate: '', credentialId: '' };
      case 'skill':
        return { name: '', category: '', level: 3 };
      case 'experience':
        return { company: '', position: '', location: '', startDate: '', endDate: '', current: false, description: '' };
      case 'project':
        return { name: '', description: '', technologies: '', startDate: '', endDate: '', url: '' };
      case 'publication':
        return { title: '', journal: '', date: '', authors: '', doi: '' };
      case 'volunteer':
        return { organization: '', role: '', startDate: '', endDate: '', description: '', location: '' };
      default:
        return {};
    }
  };

  const updateItem = (id: string, field: string, value: any) => {
    setAdditions(additions.map(item => 
      item.id === id ? { ...item, data: { ...item.data, [field]: value } } : item
    ));
  };

  const removeItem = (id: string) => {
    setAdditions(additions.filter(item => item.id !== id));
  };

  const simulateProfileImprovements = async () => {
    setIsSimulating(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Calculate improvements based on additions
    const educationCount = additions.filter(a => a.type === 'education').length;
    const certificationCount = additions.filter(a => a.type === 'certification').length;
    const skillCount = additions.filter(a => a.type === 'skill').length;
    const experienceCount = additions.filter(a => a.type === 'experience').length;
    const projectCount = additions.filter(a => a.type === 'project').length;
    const publicationCount = additions.filter(a => a.type === 'publication').length;
    const volunteerCount = additions.filter(a => a.type === 'volunteer').length;

    // Calculate total impact score
    const impactScore = 
      (educationCount * 15) + 
      (certificationCount * 20) + 
      (skillCount * 8) + 
      (experienceCount * 25) +
      (projectCount * 12) +
      (publicationCount * 30) +
      (volunteerCount * 10);

    // Determine if new queue or position change
    const shouldReplaceQueue = impactScore > 80;

    const simulatedResults: any = {
      queues: {}
    };

    // Apply improvements to each queue
    userQueues.forEach((queueId, index) => {
      const queue = allJobQueues.find(q => q.id === queueId);
      if (!queue) return;

      const positionImprovement = Math.floor(impactScore / 2);
      const matchImprovement = Math.min(10, Math.floor(impactScore / 10));

      if (shouldReplaceQueue && index === 0) {
        // Replace first queue with a better one
        const newQueueOptions = allJobQueues.filter(q => !userQueues.includes(q.id));
        if (newQueueOptions.length > 0) {
          simulatedResults.queues[queueId] = {
            isNewQueue: true,
            oldQueueTitle: queue.title,
            newPosition: Math.max(1, 3),
            newMatch: Math.min(100, 98),
            improvement: 75
          };
        }
      } else {
        simulatedResults.queues[queueId] = {
          isNewQueue: false,
          newPosition: Math.max(1, queue.current - positionImprovement),
          newMatch: Math.min(100, queue.match + matchImprovement),
          improvement: Math.round((positionImprovement / queue.current) * 100)
        };
      }
    });

    setIsSimulating(false);
    onSimulationComplete(simulatedResults);
  };

  const getTypeIcon = (type: ProfileAddition['type']) => {
    switch (type) {
      case 'education': return GraduationCap;
      case 'certification': return Award;
      case 'experience': return Briefcase;
      case 'skill': return Code;
      case 'project': return FileText;
      case 'publication': return FileText;
      case 'volunteer': return Users;
      default: return Plus;
    }
  };

  const getTypeColor = (type: ProfileAddition['type']) => {
    switch (type) {
      case 'education': return 'from-blue-500 to-blue-600';
      case 'certification': return 'from-orange-500 to-orange-600';
      case 'experience': return 'from-green-500 to-green-600';
      case 'skill': return 'from-purple-500 to-purple-600';
      case 'project': return 'from-pink-500 to-pink-600';
      case 'publication': return 'from-indigo-500 to-indigo-600';
      case 'volunteer': return 'from-teal-500 to-teal-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const renderItemFields = (item: ProfileAddition) => {
    const Icon = getTypeIcon(item.type);
    const colorClass = getTypeColor(item.type);

    return (
      <Card key={item.id} className="p-6 border-2 border-blue-100 bg-gradient-to-br from-white to-blue-50/30">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 bg-gradient-to-r ${colorClass} rounded-lg flex items-center justify-center`}>
              <Icon className="w-5 h-5 text-white" />
            </div>
            <div>
              <h4 className="font-medium text-gray-900 capitalize">{item.type}</h4>
              <p className="text-xs text-gray-500">Add new {item.type} to your profile</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => removeItem(item.id)}
            className="text-red-500 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {item.type === 'education' && (
            <>
              <div className="col-span-2">
                <label className="text-sm font-medium text-gray-700 mb-1 block">Institution</label>
                <Input
                  placeholder="e.g. Stanford University"
                  value={item.data.institution}
                  onChange={(e) => updateItem(item.id, 'institution', e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Degree</label>
                <Select value={item.data.degree} onValueChange={(v: any) => updateItem(item.id, 'degree', v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select degree" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Associate">Associate</SelectItem>
                    <SelectItem value="Bachelor">Bachelor's</SelectItem>
                    <SelectItem value="Master">Master's</SelectItem>
                    <SelectItem value="PhD">PhD</SelectItem>
                    <SelectItem value="Certificate">Certificate</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Field of Study</label>
                <Input
                  placeholder="e.g. Computer Science"
                  value={item.data.field}
                  onChange={(e) => updateItem(item.id, 'field', e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Start Date</label>
                <Input
                  type="month"
                  value={item.data.startDate}
                  onChange={(e) => updateItem(item.id, 'startDate', e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">End Date</label>
                <Input
                  type="month"
                  value={item.data.endDate}
                  onChange={(e) => updateItem(item.id, 'endDate', e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">GPA (Optional)</label>
                <Input
                  placeholder="e.g. 3.8"
                  value={item.data.gpa}
                  onChange={(e) => updateItem(item.id, 'gpa', e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Location</label>
                <Input
                  placeholder="e.g. Stanford, CA"
                  value={item.data.location}
                  onChange={(e) => updateItem(item.id, 'location', e.target.value)}
                />
              </div>
            </>
          )}

          {item.type === 'certification' && (
            <>
              <div className="col-span-2">
                <label className="text-sm font-medium text-gray-700 mb-1 block">Certification Name</label>
                <Input
                  placeholder="e.g. AWS Certified Solutions Architect"
                  value={item.data.name}
                  onChange={(e) => updateItem(item.id, 'name', e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Issuing Organization</label>
                <Input
                  placeholder="e.g. Amazon Web Services"
                  value={item.data.issuer}
                  onChange={(e) => updateItem(item.id, 'issuer', e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Issue Date</label>
                <Input
                  type="month"
                  value={item.data.date}
                  onChange={(e) => updateItem(item.id, 'date', e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Expiry Date (Optional)</label>
                <Input
                  type="month"
                  value={item.data.expiryDate}
                  onChange={(e) => updateItem(item.id, 'expiryDate', e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Credential ID (Optional)</label>
                <Input
                  placeholder="e.g. ABC123XYZ"
                  value={item.data.credentialId}
                  onChange={(e) => updateItem(item.id, 'credentialId', e.target.value)}
                />
              </div>
            </>
          )}

          {item.type === 'skill' && (
            <>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Skill Name</label>
                <Input
                  placeholder="e.g. Python"
                  value={item.data.name}
                  onChange={(e) => updateItem(item.id, 'name', e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Category</label>
                <Select value={item.data.category} onValueChange={(v: any) => updateItem(item.id, 'category', v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Programming">Programming</SelectItem>
                    <SelectItem value="Data Analysis">Data Analysis</SelectItem>
                    <SelectItem value="Cloud">Cloud</SelectItem>
                    <SelectItem value="Database">Database</SelectItem>
                    <SelectItem value="Tools">Tools</SelectItem>
                    <SelectItem value="Soft Skills">Soft Skills</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-2">
                <label className="text-sm font-medium text-gray-700 mb-1 block">Proficiency Level: {item.data.level}/5</label>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={item.data.level}
                  onChange={(e) => updateItem(item.id, 'level', parseInt(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Beginner</span>
                  <span>Intermediate</span>
                  <span>Expert</span>
                </div>
              </div>
            </>
          )}

          {item.type === 'experience' && (
            <>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Company</label>
                <Input
                  placeholder="e.g. Google"
                  value={item.data.company}
                  onChange={(e) => updateItem(item.id, 'company', e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Position</label>
                <Input
                  placeholder="e.g. Senior Data Analyst"
                  value={item.data.position}
                  onChange={(e) => updateItem(item.id, 'position', e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Location</label>
                <Input
                  placeholder="e.g. San Francisco, CA"
                  value={item.data.location}
                  onChange={(e) => updateItem(item.id, 'location', e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Start Date</label>
                <Input
                  type="month"
                  value={item.data.startDate}
                  onChange={(e) => updateItem(item.id, 'startDate', e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">End Date</label>
                <Input
                  type="month"
                  value={item.data.endDate}
                  onChange={(e) => updateItem(item.id, 'endDate', e.target.value)}
                  disabled={item.data.current}
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id={`current-${item.id}`}
                  checked={item.data.current}
                  onChange={(e) => updateItem(item.id, 'current', e.target.checked)}
                  className="rounded"
                />
                <label htmlFor={`current-${item.id}`} className="text-sm text-gray-700">Currently working here</label>
              </div>
              <div className="col-span-2">
                <label className="text-sm font-medium text-gray-700 mb-1 block">Description</label>
                <Textarea
                  placeholder="Describe your responsibilities and achievements..."
                  value={item.data.description}
                  onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                  rows={3}
                />
              </div>
            </>
          )}

          {item.type === 'project' && (
            <>
              <div className="col-span-2">
                <label className="text-sm font-medium text-gray-700 mb-1 block">Project Name</label>
                <Input
                  placeholder="e.g. E-commerce Analytics Dashboard"
                  value={item.data.name}
                  onChange={(e) => updateItem(item.id, 'name', e.target.value)}
                />
              </div>
              <div className="col-span-2">
                <label className="text-sm font-medium text-gray-700 mb-1 block">Description</label>
                <Textarea
                  placeholder="Describe the project and your contributions..."
                  value={item.data.description}
                  onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                  rows={3}
                />
              </div>
              <div className="col-span-2">
                <label className="text-sm font-medium text-gray-700 mb-1 block">Technologies Used</label>
                <Input
                  placeholder="e.g. Python, React, PostgreSQL"
                  value={item.data.technologies}
                  onChange={(e) => updateItem(item.id, 'technologies', e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Start Date</label>
                <Input
                  type="month"
                  value={item.data.startDate}
                  onChange={(e) => updateItem(item.id, 'startDate', e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">End Date (Optional)</label>
                <Input
                  type="month"
                  value={item.data.endDate}
                  onChange={(e) => updateItem(item.id, 'endDate', e.target.value)}
                />
              </div>
              <div className="col-span-2">
                <label className="text-sm font-medium text-gray-700 mb-1 block">Project URL (Optional)</label>
                <Input
                  placeholder="https://github.com/username/project"
                  value={item.data.url}
                  onChange={(e) => updateItem(item.id, 'url', e.target.value)}
                />
              </div>
            </>
          )}

          {item.type === 'publication' && (
            <>
              <div className="col-span-2">
                <label className="text-sm font-medium text-gray-700 mb-1 block">Publication Title</label>
                <Input
                  placeholder="e.g. Machine Learning for Predictive Analytics"
                  value={item.data.title}
                  onChange={(e) => updateItem(item.id, 'title', e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Journal/Conference</label>
                <Input
                  placeholder="e.g. IEEE Transactions"
                  value={item.data.journal}
                  onChange={(e) => updateItem(item.id, 'journal', e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Publication Date</label>
                <Input
                  type="month"
                  value={item.data.date}
                  onChange={(e) => updateItem(item.id, 'date', e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Authors</label>
                <Input
                  placeholder="e.g. John Doe, Jane Smith"
                  value={item.data.authors}
                  onChange={(e) => updateItem(item.id, 'authors', e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">DOI (Optional)</label>
                <Input
                  placeholder="e.g. 10.1234/example.doi"
                  value={item.data.doi}
                  onChange={(e) => updateItem(item.id, 'doi', e.target.value)}
                />
              </div>
            </>
          )}

          {item.type === 'volunteer' && (
            <>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Organization</label>
                <Input
                  placeholder="e.g. Red Cross"
                  value={item.data.organization}
                  onChange={(e) => updateItem(item.id, 'organization', e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Role</label>
                <Input
                  placeholder="e.g. Data Analyst Volunteer"
                  value={item.data.role}
                  onChange={(e) => updateItem(item.id, 'role', e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Location</label>
                <Input
                  placeholder="e.g. Boston, MA"
                  value={item.data.location}
                  onChange={(e) => updateItem(item.id, 'location', e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Start Date</label>
                <Input
                  type="month"
                  value={item.data.startDate}
                  onChange={(e) => updateItem(item.id, 'startDate', e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">End Date (Optional)</label>
                <Input
                  type="month"
                  value={item.data.endDate}
                  onChange={(e) => updateItem(item.id, 'endDate', e.target.value)}
                />
              </div>
              <div className="col-span-2">
                <label className="text-sm font-medium text-gray-700 mb-1 block">Description</label>
                <Textarea
                  placeholder="Describe your volunteer work..."
                  value={item.data.description}
                  onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                  rows={3}
                />
              </div>
            </>
          )}
        </div>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 bg-gradient-to-r from-blue-50 via-orange-50 to-blue-50 rounded-xl border-2 border-blue-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-medium text-blue-900 mb-1 flex items-center gap-2">
              <Zap className="w-5 h-5 text-blue-600" />
              Profile Improvement Simulator
            </h3>
            <p className="text-sm text-gray-700">
              Add education, certifications, skills, or experience to see how they improve your queue positions
            </p>
          </div>
        </div>

        {/* Add Buttons */}
        <div className="flex flex-wrap gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => addItem('education')}
            className="border-blue-200 hover:bg-blue-50"
          >
            <GraduationCap className="w-4 h-4 mr-2" />
            Add Education
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => addItem('certification')}
            className="border-orange-200 hover:bg-orange-50"
          >
            <Award className="w-4 h-4 mr-2" />
            Add Certification
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => addItem('skill')}
            className="border-purple-200 hover:bg-purple-50"
          >
            <Code className="w-4 h-4 mr-2" />
            Add Skill
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => addItem('experience')}
            className="border-green-200 hover:bg-green-50"
          >
            <Briefcase className="w-4 h-4 mr-2" />
            Add Experience
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => addItem('project')}
            className="border-pink-200 hover:bg-pink-50"
          >
            <FileText className="w-4 h-4 mr-2" />
            Add Project
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => addItem('publication')}
            className="border-indigo-200 hover:bg-indigo-50"
          >
            <FileText className="w-4 h-4 mr-2" />
            Add Publication
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => addItem('volunteer')}
            className="border-teal-200 hover:bg-teal-50"
          >
            <Users className="w-4 h-4 mr-2" />
            Add Volunteer Work
          </Button>
        </div>
      </div>

      {/* Added Items */}
      {additions.length > 0 && (
        <div className="space-y-4">
          {additions.map(item => renderItemFields(item))}
        </div>
      )}

      {/* Simulate Button */}
      {additions.length > 0 && (
        <div className="flex justify-center">
          <Button
            size="lg"
            onClick={simulateProfileImprovements}
            disabled={isSimulating}
            className="bg-gradient-to-r from-[#ff6b35] to-[#ff8c42] hover:from-[#e55a2b] hover:to-[#ff6b35] text-white shadow-lg"
          >
            {isSimulating ? (
              <>
                <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2" />
                Simulating...
              </>
            ) : (
              <>
                <Zap className="w-5 h-5 mr-2" />
                Simulate Profile Improvements
              </>
            )}
          </Button>
        </div>
      )}

      {/* Empty State */}
      {additions.length === 0 && (
        <div className="text-center py-8 px-4 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Plus className="w-8 h-8 text-blue-600" />
          </div>
          <h4 className="font-medium text-gray-900 mb-2">No items added yet</h4>
          <p className="text-sm text-gray-600 mb-4">
            Click the buttons above to add items to your simulated profile
          </p>
        </div>
      )}
    </div>
  );
}
