import { useState, useRef, useEffect } from 'react';
import { DollarSign, TrendingUp, Info } from 'lucide-react';
import useCostCalculator from '../../hooks/useCostCalculator';
import useDiagramStore from '../../hooks/useDiagramStore';

export default function CostWidget() {
  const { totalMonthlyCost, perNodeCosts } = useCostCalculator();
  const nodes = useDiagramStore((s) => s.nodes);
  const [isOpen, setIsOpen] = useState(false);
  const widgetRef = useRef(null);

  const nodeCount = nodes.length;
  const formattedCost = totalMonthlyCost.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  useEffect(() => {
    function handleClickOutside(event) {
      if (widgetRef.current && !widgetRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const toggleOpen = () => setIsOpen(!isOpen);

  return (
    <div className="relative" ref={widgetRef}>
      <div 
        className="cost-widget cursor-pointer hover:bg-green-900/20 hover:border-green-800/40 hover:scale-[1.02] active:scale-95 transition-all"
        onClick={toggleOpen}
        title="View Cost Breakdown"
      >
        <div className="cost-widget__icon">
          <DollarSign size={16} />
        </div>
        <div className="cost-widget__content">
          <span className="cost-widget__label">Est. Monthly</span>
          <span className="cost-widget__value">${formattedCost}</span>
        </div>
        <div className="cost-widget__meta">
          <TrendingUp size={12} />
          <span>{nodeCount} {nodeCount === 1 ? 'service' : 'services'}</span>
        </div>
      </div>

      {isOpen && (
        <div className="absolute top-[calc(100%+16px)] right-0 w-[350px] bg-[#111111]/95 backdrop-blur-xl border border-white/5 shadow-2xl rounded-2xl p-5 z-50 transition-all">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-white/5">
            <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center text-green-400">
              <DollarSign size={16} />
            </div>
            <div>
              <h3 className="text-white text-sm font-semibold">Cost Breakdown</h3>
              <p className="text-xs text-gray-500">Estimated monthly run rates</p>
            </div>
          </div>
          
          <div className="space-y-3 mb-5 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
            {Object.keys(perNodeCosts).length === 0 ? (
              <div className="flex flex-col items-center justify-center py-6 text-gray-500">
                <p className="text-xs">No services added yet.</p>
                <p className="text-[10px] mt-1 text-gray-600">Drag nodes to canvas to see costs.</p>
              </div>
            ) : (
              Object.entries(perNodeCosts).map(([nodeId, nodeCost], i) => {
                const node = nodes.find(n => n.id === nodeId);
                return (
                  <div key={i} className="flex justify-between items-start bg-white/[0.02] hover:bg-white/[0.04] transition-colors p-3 rounded-xl border border-white/[0.05]">
                    <div className="flex flex-col min-w-0 pr-3">
                      <span className="text-gray-200 text-sm font-medium truncate">{node?.data?.label || 'Unknown Service'}</span>
                      <span className="text-[#a0a0a0] text-xs mt-0.5 truncate">{node?.data?.fullName || ''}</span>
                    </div>
                    <div className="flex flex-col items-end shrink-0">
                      <span className="text-gray-300 text-sm font-mono tracking-tight text-right w-full">
                        ${nodeCost.cost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                      <span className="text-[#777] text-[10px] mt-0.5">/mo</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
          
          <div className="pt-4 border-t border-white/5 flex justify-between items-center">
            <span className="text-sm font-medium text-gray-400">Total Build Cost</span>
            <div className="flex flex-col items-end">
              <span className="text-xl font-bold tracking-tight text-green-400 font-mono">${formattedCost}</span>
              <span className="text-[#666] text-[10px] uppercase font-bold tracking-wider mt-0.5">USD / Month</span>
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-blue-500/5 border border-blue-500/10 rounded-lg flex items-start gap-3">
            <Info size={14} className="text-blue-400 shrink-0 mt-0.5" />
            <p className="text-[10px] text-[#888] leading-relaxed">
              These estimates cover baseline compute and storage allocations. Additional charges for data transfer, API requests, and load balancing may apply.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
