import { useState } from 'react';
import { AlertTriangle, AlertCircle, Info, ChevronDown, ChevronUp, Shield } from 'lucide-react';
import useLinter from '../../hooks/useLinter';
import useDiagramStore from '../../hooks/useDiagramStore';

const SEVERITY_ICONS = {
  critical: <AlertCircle size={14} />,
  warning: <AlertTriangle size={14} />,
  info: <Info size={14} />,
};

const SEVERITY_ORDER = { critical: 0, warning: 1, info: 2 };

export default function LinterPanel() {
  const { warnings, criticalCount, warningCount, infoCount } = useLinter();
  const setSelectedNode = useDiagramStore((s) => s.setSelectedNode);
  const [isExpanded, setIsExpanded] = useState(false);
  const nodes = useDiagramStore((s) => s.nodes);

  if (nodes.length === 0) return null;

  const sorted = [...warnings].sort(
    (a, b) => (SEVERITY_ORDER[a.severity] || 2) - (SEVERITY_ORDER[b.severity] || 2)
  );

  const total = warnings.length;
  const hasIssues = total > 0;

  return (
    <div className={`linter-panel ${isExpanded ? 'linter-panel--expanded' : ''}`}>
      <button
        className="linter-panel__header"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="linter-panel__summary">
          <Shield size={16} />
          <span className="linter-panel__title">Architecture Linter</span>
          {hasIssues ? (
            <div className="linter-panel__badges">
              {criticalCount > 0 && (
                <span className="linter-badge linter-badge--critical">{criticalCount}</span>
              )}
              {warningCount > 0 && (
                <span className="linter-badge linter-badge--warning">{warningCount}</span>
              )}
              {infoCount > 0 && (
                <span className="linter-badge linter-badge--info">{infoCount}</span>
              )}
            </div>
          ) : (
            <span className="linter-panel__ok">✓ All good</span>
          )}
        </div>
        {isExpanded ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
      </button>

      {isExpanded && hasIssues && (
        <div className="linter-panel__list">
          {sorted.map((w, i) => (
            <button
              key={i}
              className={`linter-item linter-item--${w.severity}`}
              onClick={() => w.nodeId && setSelectedNode(w.nodeId)}
            >
              <div className={`linter-item__icon linter-item__icon--${w.severity}`}>
                {SEVERITY_ICONS[w.severity]}
              </div>
              <span className="linter-item__message">{w.message}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
