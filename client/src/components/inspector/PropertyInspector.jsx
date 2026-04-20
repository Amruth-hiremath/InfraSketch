import { useMemo } from 'react';
import { X, Trash2 } from 'lucide-react';
import useDiagramStore from '../../hooks/useDiagramStore';
import useCostCalculator from '../../hooks/useCostCalculator';
import { getServiceById, AWS_REGIONS, AVAILABILITY_ZONES } from '../../data/awsServices';
import AWS_ICONS from '../nodes/AWSIcons';
import { AWS_CATEGORIES } from '../../data/awsServices';

export default function PropertyInspector() {
  const selectedNodeId = useDiagramStore((s) => s.selectedNodeId);
  const nodes = useDiagramStore((s) => s.nodes);
  const updateNodeData = useDiagramStore((s) => s.updateNodeData);
  const updateNodeProperties = useDiagramStore((s) => s.updateNodeProperties);
  const removeNode = useDiagramStore((s) => s.removeNode);
  const setSelectedNode = useDiagramStore((s) => s.setSelectedNode);

  const { perNodeCosts } = useCostCalculator();

  const selectedNode = useMemo(
    () => nodes.find((n) => n.id === selectedNodeId),
    [nodes, selectedNodeId]
  );

  if (!selectedNode) {
    return (
      <div className="inspector inspector--empty">
        <div className="inspector__placeholder">
          <div className="inspector__placeholder-icon">
            <svg viewBox="0 0 48 48" fill="none" width="48" height="48">
              <rect x="8" y="8" width="32" height="32" rx="4" stroke="#6b7280" strokeWidth="2" strokeDasharray="4 2" />
              <path d="M20 20l8 8M28 20l-8 8" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
          <p>Select a node to inspect</p>
          <span>Click on any service on the canvas</span>
        </div>
      </div>
    );
  }

  const serviceType = selectedNode.data.serviceType;
  const service = getServiceById(serviceType);
  const properties = selectedNode.data.properties || {};
  const nodeCost = perNodeCosts[selectedNode.id]?.cost || 0;
  const categoryColor = AWS_CATEGORIES.find((c) => c.id === selectedNode.data.category)?.color || '#FF5C00';
  const icon = AWS_ICONS[serviceType];

  const handleLabelChange = (value) => {
    updateNodeData(selectedNode.id, { label: value });
  };

  const handlePropertyChange = (key, value) => {
    updateNodeProperties(selectedNode.id, { [key]: value });
  };

  const handleDelete = () => {
    removeNode(selectedNode.id);
    setSelectedNode(null);
  };

  const renderField = (schema) => {
    const value = properties[schema.key];

    switch (schema.type) {
      case 'select':
        return (
          <select
            value={value ?? ''}
            onChange={(e) => handlePropertyChange(schema.key, e.target.value)}
            className="inspector__select"
          >
            {schema.options.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        );

      case 'number':
        return (
          <input
            type="number"
            value={value ?? ''}
            min={schema.min}
            max={schema.max}
            step={schema.step || 1}
            onChange={(e) => handlePropertyChange(schema.key, Number(e.target.value))}
            className="inspector__input"
          />
        );

      case 'toggle':
        return (
          <label className="inspector__toggle">
            <input
              type="checkbox"
              checked={!!value}
              onChange={(e) => handlePropertyChange(schema.key, e.target.checked)}
            />
            <span className="inspector__toggle-slider" />
            <span className="inspector__toggle-label">{value ? 'Enabled' : 'Disabled'}</span>
          </label>
        );

      case 'text':
        return (
          <input
            type="text"
            value={value ?? ''}
            onChange={(e) => handlePropertyChange(schema.key, e.target.value)}
            className="inspector__input"
          />
        );

      default:
        return (
          <input
            type="text"
            value={value ?? ''}
            onChange={(e) => handlePropertyChange(schema.key, e.target.value)}
            className="inspector__input"
          />
        );
    }
  };

  return (
    <div className="inspector">
      {/* Header */}
      <div className="inspector__header">
        <div className="inspector__header-left">
          <div className="inspector__icon" style={{ color: categoryColor }}>
            {icon}
          </div>
          <div>
            <h3 className="inspector__service-name">{service?.fullName || serviceType}</h3>
            <span className="inspector__service-type" style={{ color: categoryColor }}>
              {serviceType.toUpperCase()}
            </span>
          </div>
        </div>
        <div className="inspector__header-actions">
          <button onClick={handleDelete} className="inspector__btn-delete" title="Delete node">
            <Trash2 size={14} />
          </button>
          <button onClick={() => setSelectedNode(null)} className="inspector__btn-close" title="Close">
            <X size={14} />
          </button>
        </div>
      </div>

      {/* Cost badge */}
      <div className="inspector__cost">
        <span>Estimated Monthly Cost</span>
        <span className="inspector__cost-value">${nodeCost.toFixed(2)}</span>
      </div>

      {/* Global Properties */}
      <div className="inspector__section">
        <h4 className="inspector__section-title">General</h4>

        <div className="inspector__field">
          <label>Label</label>
          <input
            type="text"
            value={selectedNode.data.label || ''}
            onChange={(e) => handleLabelChange(e.target.value)}
            className="inspector__input"
          />
        </div>

        <div className="inspector__field">
          <label>Region</label>
          <select
            value={properties.region || 'us-east-1'}
            onChange={(e) => handlePropertyChange('region', e.target.value)}
            className="inspector__select"
          >
            {AWS_REGIONS.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>

        <div className="inspector__field">
          <label>Availability Zone</label>
          <select
            value={properties.availabilityZone || 'a'}
            onChange={(e) => handlePropertyChange('availabilityZone', e.target.value)}
            className="inspector__select"
          >
            {AVAILABILITY_ZONES.map((az) => (
              <option key={az} value={az}>
                {(properties.region || 'us-east-1')}{az}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Service-specific Properties */}
      {service?.propertySchema && service.propertySchema.length > 0 && (
        <div className="inspector__section">
          <h4 className="inspector__section-title">Configuration</h4>
          {service.propertySchema.map((schema) => (
            <div key={schema.key} className="inspector__field">
              <label>{schema.label}</label>
              {renderField(schema)}
            </div>
          ))}
        </div>
      )}

      {/* Warnings */}
      {selectedNode.data.warnings && selectedNode.data.warnings.length > 0 && (
        <div className="inspector__section">
          <h4 className="inspector__section-title inspector__section-title--warnings">
            ⚠ Warnings
          </h4>
          {selectedNode.data.warnings.map((w, i) => (
            <div key={i} className={`inspector__warning inspector__warning--${w.severity}`}>
              {w.message}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
