import { useState } from 'react';
import { Shield, CheckCircle, Info } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import {
  PERMISSION_CATEGORIES,
  PERMISSION_LABELS,
  ROLE_TEMPLATES,
  type PermissionModule,
  type RoleTemplate,
} from '../types/team';

interface TestPermissionEditorProps {
  selectedPermissions: string[];
  onChange: (permissions: string[]) => void;
  roleTemplate?: RoleTemplate;
}

export function TestPermissionEditor({
  selectedPermissions,
  onChange,
  roleTemplate,
}: Readonly<TestPermissionEditorProps>) {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(Object.keys(PERMISSION_CATEGORIES))
  );

  const toggleCategory = (category: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(category)) {
      newExpanded.delete(category);
    } else {
      newExpanded.add(category);
    }
    setExpandedCategories(newExpanded);
  };

  const togglePermission = (permission: PermissionModule) => {
    if (selectedPermissions.includes(permission)) {
      onChange(selectedPermissions.filter(p => p !== permission));
    } else {
      onChange([...selectedPermissions, permission]);
    }
  };

  const toggleAllInCategory = (permissions: PermissionModule[]) => {
    const allSelected = permissions.every(p => selectedPermissions.includes(p));
    
    if (allSelected) {
      // Remove all from this category
      onChange(selectedPermissions.filter(p => !(permissions as string[]).includes(p)));
    } else {
      // Add all from this category
      const newPermissions = [...selectedPermissions];
      permissions.forEach(p => {
        if (!newPermissions.includes(p)) {
          newPermissions.push(p);
        }
      });
      onChange(newPermissions);
    }
  };

  const applyRoleTemplate = (template: RoleTemplate) => {
    if (template === 'custom') {
      onChange([]);
    } else {
      onChange(ROLE_TEMPLATES[template].permissions);
    }
  };

  const getCategoryStats = (permissions: PermissionModule[]) => {
    const selected = permissions.filter(p => selectedPermissions.includes(p)).length;
    const total = permissions.length;
    return { selected, total };
  };

  return (
    <div className="space-y-6">
      {/* Quick Apply Templates */}
      <Card className="p-4 bg-blue-50 border-blue-200">
        <div className="flex items-start gap-2 mb-3">
          <Info className="w-4 h-4 text-blue-600 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm text-blue-900 mb-2">
              Quick Apply: Select a role template to auto-populate permissions
            </p>
            <div className="flex flex-wrap gap-2">
              {Object.entries(ROLE_TEMPLATES).map(([key, template]) => (
                key !== 'custom' && (
                  <Button
                    key={key}
                    size="sm"
                    variant="outline"
                    onClick={() => applyRoleTemplate(key as RoleTemplate)}
                    className={roleTemplate === key ? 'bg-white' : ''}
                  >
                    <div
                      className="w-2 h-2 rounded-full mr-2"
                      style={{ backgroundColor: template.color }}
                    />
                    {template.name}
                  </Button>
                )
              ))}
              <Button
                size="sm"
                variant="outline"
                onClick={() => onChange([])}
              >
                Clear All
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Permission Summary */}
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-gray-600" />
            <span className="text-sm">
              {selectedPermissions.length} permission{selectedPermissions.length === 1 ? '' : 's'} selected
            </span>
          </div>
          {selectedPermissions.length > 0 && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onChange([])}
            >
              Clear All
            </Button>
          )}
        </div>
      </Card>

      {/* Permission Categories */}
      <div className="space-y-4">
        {Object.entries(PERMISSION_CATEGORIES).map(([category, permissions]) => {
          const stats = getCategoryStats(permissions);
          const allSelected = stats.selected === stats.total;
          const someSelected = stats.selected > 0 && stats.selected < stats.total;
          const isExpanded = expandedCategories.has(category);

          return (
            <Card key={category} className="overflow-hidden">
              {/* Category Header */}
              <div
                className="p-4 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => toggleCategory(category)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-5 h-5 rounded flex items-center justify-center border-2 transition-colors ${
                        allSelected
                          ? 'bg-blue-500 border-blue-500'
                          : someSelected
                          ? 'bg-blue-200 border-blue-500'
                          : 'border-gray-300'
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleAllInCategory(permissions);
                      }}
                    >
                      {(allSelected || someSelected) && (
                        <CheckCircle className="w-4 h-4 text-white" />
                      )}
                    </div>
                    
                    <div>
                      <h3 className="font-medium">{category}</h3>
                      <p className="text-xs text-gray-600">
                        {stats.selected} of {stats.total} selected
                      </p>
                    </div>
                  </div>

                  <Badge variant={allSelected ? 'default' : 'outline'}>
                    {stats.selected}/{stats.total}
                  </Badge>
                </div>
              </div>

              {/* Category Permissions */}
              {isExpanded && (
                <div className="p-4 space-y-3">
                  {permissions.map((permission) => {
                    const isSelected = selectedPermissions.includes(permission);
                    
                    return (
                      <div
                        key={permission}
                        className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center gap-3 flex-1">
                          <div
                            className={`w-4 h-4 rounded border-2 transition-colors cursor-pointer ${
                              isSelected
                                ? 'bg-blue-500 border-blue-500'
                                : 'border-gray-300'
                            }`}
                            onClick={() => togglePermission(permission)}
                          >
                            {isSelected && (
                              <CheckCircle className="w-3.5 h-3.5 text-white" />
                            )}
                          </div>
                          
                          <Label className="cursor-pointer flex-1" onClick={() => togglePermission(permission)}>
                            <span className="text-sm">{PERMISSION_LABELS[permission]}</span>
                            <p className="text-xs text-gray-500 mt-0.5">
                              {permission}
                            </p>
                          </Label>
                        </div>

                        <Switch
                          checked={isSelected}
                          onCheckedChange={() => togglePermission(permission)}
                        />
                      </div>
                    );
                  })}
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {/* Selected Permissions Summary */}
      {selectedPermissions.length > 0 && (
        <Card className="p-4 bg-green-50 border-green-200">
          <div className="flex items-start gap-2">
            <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-sm font-medium text-green-900 mb-2">
                Selected Permissions ({selectedPermissions.length})
              </h3>
              <div className="flex flex-wrap gap-1">
                {selectedPermissions.map((permission) => (
                  <Badge
                    key={permission}
                    variant="outline"
                    className="text-xs bg-white cursor-pointer hover:bg-red-50"
                    onClick={() => togglePermission(permission as PermissionModule)}
                  >
                    {PERMISSION_LABELS[permission as PermissionModule]} ✕
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
