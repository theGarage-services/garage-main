import { useState } from 'react';
import { Building2, Plus, Edit, Trash2, Users } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '../ui/dialog';
import { MOCK_ORGANIZATION } from '@/utils/testMockData';
import type { Department } from '../../types/team';

const PRESET_COLORS = [
  '#3b82f6', // blue
  '#ec4899', // pink
  '#14b8a6', // teal
  '#f59e0b', // amber
  '#8b5cf6', // purple
  '#10b981', // green
  '#ef4444', // red
  '#6366f1', // indigo
];

export function TestDepartmentManagement() {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingDept, setEditingDept] = useState<Department | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    color: PRESET_COLORS[0],
  });

  const handleCreate = () => {
    console.log('Creating department:', formData);
    alert(`Department "${formData.name}" created!`);
    setShowCreateDialog(false);
    setFormData({ name: '', description: '', color: PRESET_COLORS[0] });
  };

  const handleEdit = (dept: Department) => {
    setEditingDept(dept);
    setFormData({
      name: dept.name,
      description: dept.description || '',
      color: dept.color,
    });
  };

  const handleUpdate = () => {
    console.log('Updating department:', editingDept?.id, formData);
    alert(`Department "${formData.name}" updated!`);
    setEditingDept(null);
    setFormData({ name: '', description: '', color: PRESET_COLORS[0] });
  };

  const handleDelete = (dept: Department) => {
    if (confirm(`Delete department "${dept.name}"? Members will be unassigned.`)) {
      console.log('Deleting department:', dept.id);
      alert(`Department "${dept.name}" deleted!`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Building2 className="w-6 h-6" style={{ color: '#ff6b35' }} />
            </div>
            <div>
              <h1 className="text-3xl">Department Management</h1>
              <p className="text-sm text-gray-600">
                Organize your team into departments
              </p>
            </div>
          </div>
          
          <Button onClick={() => setShowCreateDialog(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Create Department
          </Button>
        </div>
      </div>

      {/* Departments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MOCK_ORGANIZATION.departments.map((dept) => (
          <Card key={dept.id} className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: dept.color + '20' }}
                >
                  <Building2
                    className="w-5 h-5"
                    style={{ color: dept.color }}
                  />
                </div>
                <div>
                  <h3 className="font-medium">{dept.name}</h3>
                  <Badge
                    variant="outline"
                    className="mt-1"
                    style={{ borderColor: dept.color, color: dept.color }}
                  >
                    {dept.memberIds.length} member{dept.memberIds.length === 1 ? '' : 's'}
                  </Badge>
                </div>
              </div>

              <div className="flex gap-1">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleEdit(dept)}
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleDelete(dept)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {dept.description && (
              <p className="text-sm text-gray-600 mb-4">{dept.description}</p>
            )}

            {/* Member Avatars */}
            {dept.memberIds.length > 0 && (
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-gray-400" />
                <div className="flex -space-x-2">
                  {dept.memberIds.slice(0, 5).map((memberId: string) => {
                    const member = MOCK_ORGANIZATION.members.find(m => m.id === memberId);
                    return member ? (
                      <img
                        key={memberId}
                        src={member.avatar}
                        alt={member.name}
                        className="w-8 h-8 rounded-full border-2 border-white"
                        title={member.name}
                      />
                    ) : null;
                  })}
                  {dept.memberIds.length > 5 && (
                    <div className="w-8 h-8 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center text-xs">
                      +{dept.memberIds.length - 5}
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="mt-4 pt-4 border-t text-xs text-gray-500">
              Created {new Date(dept.createdAt).toLocaleDateString()}
            </div>
          </Card>
        ))}

        {/* Empty State */}
        {MOCK_ORGANIZATION.departments.length === 0 && (
          <Card className="p-12 text-center col-span-full">
            <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-2">No departments yet</p>
            <p className="text-sm text-gray-500 mb-4">
              Create departments to organize your team
            </p>
            <Button onClick={() => setShowCreateDialog(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create First Department
            </Button>
          </Card>
        )}
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={showCreateDialog || !!editingDept} onOpenChange={(open: any) => {
        if (!open) {
          setShowCreateDialog(false);
          setEditingDept(null);
          setFormData({ name: '', description: '', color: PRESET_COLORS[0] });
        }
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingDept ? 'Edit Department' : 'Create Department'}
            </DialogTitle>
            <DialogDescription>
              {editingDept 
                ? 'Update the department details below.' 
                : 'Create a new department to organize your team members.'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="dept-name">Department Name *</Label>
              <Input
                id="dept-name"
                placeholder="e.g. Engineering, Sales, Marketing"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="dept-desc">Description (Optional)</Label>
              <Textarea
                id="dept-desc"
                placeholder="Brief description of this department..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>

            <div>
              <Label>Department Color</Label>
              <div className="flex gap-2 mt-2">
                {PRESET_COLORS.map((color) => (
                  <button
                    key={color}
                    className={`w-10 h-10 rounded-lg transition-all ${
                      formData.color === color
                        ? 'ring-2 ring-offset-2 ring-blue-500 scale-110'
                        : 'hover:scale-105'
                    }`}
                    style={{ backgroundColor: color }}
                    onClick={() => setFormData({ ...formData, color })}
                  />
                ))}
              </div>
            </div>

            {/* Preview */}
            <Card className="p-4 bg-gray-50">
              <p className="text-xs text-gray-600 mb-2">Preview:</p>
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: formData.color + '20' }}
                >
                  <Building2
                    className="w-5 h-5"
                    style={{ color: formData.color }}
                  />
                </div>
                <div>
                  <p className="font-medium">{formData.name || 'Department Name'}</p>
                  {formData.description && (
                    <p className="text-sm text-gray-600">{formData.description}</p>
                  )}
                </div>
              </div>
            </Card>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowCreateDialog(false);
                setEditingDept(null);
                setFormData({ name: '', description: '', color: PRESET_COLORS[0] });
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={editingDept ? handleUpdate : handleCreate}
              disabled={!formData.name}
            >
              {editingDept ? 'Update' : 'Create'} Department
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
