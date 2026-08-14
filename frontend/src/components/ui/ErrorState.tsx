import { AlertTriangle } from 'lucide-react';

export default function ErrorState({ message }: { message: string }) {
  return (
    <div className="card p-6 border-evidence-weak/30 bg-evidence-weak/5 flex items-start gap-3">
      <AlertTriangle className="text-evidence-weak shrink-0 mt-0.5" size={18} />
      <p className="text-sm text-slate-900">{message}</p>
    </div>
  );
}
