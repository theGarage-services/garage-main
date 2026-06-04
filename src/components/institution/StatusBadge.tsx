import { Badge } from '../ui/badge';

interface StatusBadgeProps {
  status: string;
}

export function StatusBadge({ status }: Readonly<StatusBadgeProps>) {
  const variants: Record<string, { className: string; label: string }> = {
    active: { className: 'bg-green-100 text-green-800 hover:bg-green-100', label: 'Active' },
    pending: { className: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100', label: 'Pending' },
    draft: { className: 'bg-gray-100 text-gray-800 hover:bg-gray-100', label: 'Draft' }
  };

  const variant = variants[status];
  if (!variant) {
    return <Badge variant="secondary">Unknown</Badge>;
  }

  return <Badge className={variant.className}>{variant.label}</Badge>;
}
