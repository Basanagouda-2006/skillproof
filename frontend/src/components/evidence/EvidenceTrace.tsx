import type { EvidenceItem } from '../../types';

/**
 * The "Evidence Trace" motif: a connected vertical line of nodes that
 * visually communicates Claim -> Evidence -> Repository -> Verification.
 * Used on skill detail pages, reports, and interview packs.
 */
export default function EvidenceTrace({ items }: { items: EvidenceItem[] }) {
  if (items.length === 0) {
    return <p className="text-sm text-slate-500">No trace items to display.</p>;
  }

  return (
    <ol className="space-y-4">
      {items.map((item, i) => (
        <li key={i} className="trace-line">
          <span className="trace-node trace-node--filled" />
          <p className="text-sm text-slate-900">{item.description}</p>
          <p className="text-xs uppercase tracking-wide text-slate-500 mt-0.5 font-mono">
            {item.type.replace('_', ' ')}
          </p>
        </li>
      ))}
    </ol>
  );
}
