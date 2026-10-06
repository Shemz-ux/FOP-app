import { CheckCircle, XCircle } from 'lucide-react';

export default function StatusBadge({ isActive, labels, compact = false }) {
  const Icon = isActive ? CheckCircle : XCircle;

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-lg text-xs font-medium ${
      compact ? 'px-2.5 py-1 whitespace-nowrap' : 'px-3 py-1'
    } ${
      isActive
        ? 'bg-green-500/10 text-green-500 border border-green-500/20'
        : 'bg-red-500/10 text-red-500 border border-red-500/20'
    }`}>
      <Icon className={compact ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
      {isActive ? labels.active : labels.inactive}
    </span>
  );
}
