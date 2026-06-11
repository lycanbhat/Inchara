'use client';

interface KPICardProps {
  title: string;
  value: string;
  badge?: string;
  badgePositive?: boolean;
  subtitle?: string;
  description?: string;
}

export function KPICard({
  title,
  value,
  badge,
  badgePositive = true,
  subtitle,
  description,
}: KPICardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-5">
      <div className="flex items-start justify-between mb-2">
        <span className="text-sm text-gray-500">{title}</span>
        {badge && (
          <span
            className={`text-xs px-2 py-0.5 rounded-full font-medium ${
              badgePositive
                ? 'bg-green-50 text-green-700'
                : 'bg-red-50 text-red-600'
            }`}
          >
            {badgePositive ? '↗' : '↘'} {badge}
          </span>
        )}
      </div>

      <p className="text-2xl font-bold text-gray-900 tracking-tight">{value}</p>

      {(subtitle || description) && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          {subtitle && (
            <p className="text-xs font-medium text-gray-700 flex items-center gap-1">
              {subtitle}
            </p>
          )}
          {description && (
            <p className="text-xs text-gray-400 mt-0.5">{description}</p>
          )}
        </div>
      )}
    </div>
  );
}
