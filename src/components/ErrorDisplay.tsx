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
    <div className={`space-y-2 ${className}`}>
      {criticalErrors.length > 0 && (
        <div className="border-3 border-terminal-red bg-terminal-red/10 p-3">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-terminal-red font-mono text-xs uppercase tracking-wider">
              [ERROR]
            </span>
          </div>
          <ul className="space-y-1">
            {criticalErrors.map((error, i) => (
              <li key={i} className="font-mono text-xs text-terminal-red">
                <span className="text-terminal-green-dim">{error.protocol}:</span>{' '}
                {error.message}
              </li>
            ))}
          </ul>
        </div>
      )}

      {warnings.length > 0 && (
        <div className="border-3 border-terminal-amber bg-terminal-amber/10 p-3">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-terminal-amber font-mono text-xs uppercase tracking-wider">
              [WARNING]
            </span>
          </div>
          <ul className="space-y-1">
            {warnings.map((warning, i) => (
              <li key={i} className="font-mono text-xs text-terminal-amber">
                <span className="text-terminal-green-dim">{warning.protocol}:</span>{' '}
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
    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-terminal-amber/20 border border-terminal-amber text-terminal-amber font-mono text-xs">
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
      <span className="text-terminal-red font-mono text-xs" title="Failed to fetch data">
        [ERR]
      </span>
    );
  }

  if (isEstimated) {
    return (
      <span className="text-terminal-amber font-mono text-xs" title="APY is estimated">
        [EST]
      </span>
    );
  }

  return (
    <span className="text-terminal-green font-mono text-xs" title="Live data">
      [LIVE]
    </span>
  );
}
