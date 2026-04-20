import { useMemo } from 'react';
import useDiagramStore from './useDiagramStore';
import { runLinter } from '../data/linterRules';

export default function useLinter() {
  const nodes = useDiagramStore((s) => s.nodes);
  const edges = useDiagramStore((s) => s.edges);

  const warnings = useMemo(() => {
    if (nodes.length === 0) return [];
    return runLinter(nodes, edges);
  }, [nodes, edges]);

  const getWarningsForNode = (nodeId) =>
    warnings.filter((w) => w.nodeId === nodeId);

  const criticalCount = warnings.filter((w) => w.severity === 'critical').length;
  const warningCount = warnings.filter((w) => w.severity === 'warning').length;
  const infoCount = warnings.filter((w) => w.severity === 'info').length;

  return { warnings, getWarningsForNode, criticalCount, warningCount, infoCount };
}
