import { CheckCircle2, CircleDot, CircleAlert, Circle } from 'lucide-react';
import type { EvidenceLevel } from '../../types';

const CONFIG: Record<EvidenceLevel, { label: string; className: string; Icon: typeof Circle }> = {
  STRONG: { label: 'Strong evidence', className: 'badge-strong', Icon: CheckCircle2 },
  MODERATE: { label: 'Moderate evidence', className: 'badge-moderate', Icon: CircleDot },
  WEAK: { label: 'Weak evidence', className: 'badge-weak', Icon: CircleAlert },
  NO_EVIDENCE: { label: 'No evidence', className: 'badge-none', Icon: Circle },
};

export default function EvidenceBadge({ level }: { level: EvidenceLevel }) {
  const { label, className, Icon } = CONFIG[level];
  return (
    <span className={className}>
      <Icon size={13} />
      {label}
    </span>
  );
}
