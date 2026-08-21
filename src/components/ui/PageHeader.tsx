interface PageHeaderProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}

export default function PageHeader({ icon: Icon, title, description }: PageHeaderProps) {
  return (
    <div className="mb-6 flex items-start gap-4">
      <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm shadow-blue-200">
        <Icon className="h-6 w-6" />
      </div>
      <div>
        <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
        <p className="mt-0.5 text-sm leading-relaxed text-slate-500">{description}</p>
      </div>
    </div>
  );
}
