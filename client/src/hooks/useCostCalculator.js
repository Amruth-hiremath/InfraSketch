import { useMemo } from 'react';
import useDiagramStore from './useDiagramStore';
import { calculateTotalCost } from '../data/pricingMatrix';

export default function useCostCalculator() {
  const nodes = useDiagramStore((s) => s.nodes);

  const costData = useMemo(() => {
    if (nodes.length === 0) {
      return { totalMonthlyCost: 0, perNodeCosts: {} };
    }
    return calculateTotalCost(nodes);
  }, [nodes]);

  return costData;
}
