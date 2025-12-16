import type { FetchError } from '../types/yield';

interface ErrorDisplayProps {
  errors: FetchError[];
  className?: string;
}

export function ErrorDisplay({ errors, className = '' }: ErrorDisplayProps) {
  if (errors.length === 0) return null;

  // Separate critical errors from warnings
  const criticalErrors = errors.filter(
    (e) =>
      e.message.toLowerCase().includes('failed') ||
      e.message.toLowerCase().includes('critical')
  );
  const warnings = errors.filter(
    (e) =>
      e.message.toLowerCase().includes('unavailable') ||
      e.message.toLowerCase().includes('estimate')
  );

  return (
    <div className={`space-y-3 ${className}`}>
      {criticalErrors.length > 0 && (
        <div className="border-3 border-black bg-neo-red p-4 shadow-neo">
          <div className="flex items-center gap-2 mb-3">
            <span className="px-3 py-1 bg-black text-white text-xs font-bold uppercase">
              Error
            </span>
          </div>
          <ul className="space-y-2">
            {criticalErrors.map((error, i) => (
              <li key={i} className="text-sm text-black">
                <span className="font-bold">{error.protocol}:</span>{' '}
                {error.message}
              </li>
            ))}
          </ul>
        </div>
      )}

      {warnings.length > 0 && (
        <div className="border-3 border-black bg-neo-yellow p-4 shadow-neo">
          <div className="flex items-center gap-2 mb-3">
            <span className="px-3 py-1 bg-black text-white text-xs font-bold uppercase">
              Warning
            </span>
          </div>
          <ul className="space-y-2">
            {warnings.map((warning, i) => (
              <li key={i} className="text-sm text-black">
                <span className="font-bold">{warning.protocol}:</span>{' '}
                {warning.message}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

// Compact inline warning badge
export function WarningBadge({ count }: { count: number }) {
  if (count === 0) return null;

  return (
    <span className="inline-flex items-center gap-1 px-3 py-1 bg-neo-yellow border-2 border-black text-black font-bold text-xs uppercase">
      {count} warning{count !== 1 ? 's' : ''}
    </span>
  );
}

// Status indicator for data source
export function DataSourceStatus({
  hasError,
  isEstimated,
}: {
  hasError: boolean;
  isEstimated: boolean;
}) {
  if (hasError) {
    return (
      <span className="px-2 py-1 bg-neo-red border-2 border-black text-black font-bold text-xs uppercase" title="Failed to fetch data">
        ERR
      </span>
    );
  }

  if (isEstimated) {
    return (
      <span className="px-2 py-1 bg-neo-orange border-2 border-black text-black font-bold text-xs uppercase" title="APY is estimated">
        EST
      </span>
    );
  }

  return (
    <span className="px-2 py-1 bg-neo-green border-2 border-black text-black font-bold text-xs uppercase" title="Live data">
      LIVE
    </span>
  );
}
