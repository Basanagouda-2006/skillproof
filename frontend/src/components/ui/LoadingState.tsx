export default function LoadingState({ label = 'Loading...' }: { label?: string }) {
  return (
    <div className="flex items-center justify-center py-16">
      <div className="flex items-center gap-3 text-slate-500">
        <span className="w-4 h-4 rounded-full border-2 border-brand-blue border-t-transparent animate-spin" />
        <span className="text-sm">{label}</span>
      </div>
    </div>
  );
}
