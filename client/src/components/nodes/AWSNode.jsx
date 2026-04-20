import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import AWS_ICONS from './AWSIcons';
import { AWS_CATEGORIES } from '../../data/awsServices';

const CATEGORY_COLORS = {};
AWS_CATEGORIES.forEach((c) => {
  CATEGORY_COLORS[c.id] = c.color;
});

function AWSNode({ data, selected }) {
  const {
    label = 'Untitled',
    serviceType = 'ec2',
    category = 'compute',
    warnings = [],
  } = data;

  const categoryColor = CATEGORY_COLORS[category] || '#FF5C00';
  const icon = AWS_ICONS[serviceType];
  const hasWarnings = warnings.length > 0;
  const hasCritical = warnings.some((w) => w.severity === 'critical');

  return (
    <>
      {/* Connection handles */}
      <Handle type="target" position={Position.Top} className="aws-handle" />
      <Handle type="target" position={Position.Left} className="aws-handle" />
      <Handle type="source" position={Position.Bottom} className="aws-handle" />
      <Handle type="source" position={Position.Right} className="aws-handle" />

      <div
        className={`aws-node ${selected ? 'aws-node--selected' : ''} ${hasCritical ? 'aws-node--critical' : hasWarnings ? 'aws-node--warning' : ''}`}
        style={{ '--category-color': categoryColor }}
      >
        {/* Category stripe */}
        <div className="aws-node__stripe" style={{ backgroundColor: categoryColor }} />

        {/* Warning badge */}
        {hasWarnings && (
          <div className={`aws-node__badge ${hasCritical ? 'aws-node__badge--critical' : 'aws-node__badge--warning'}`}>
            {warnings.length}
          </div>
        )}

        {/* Icon */}
        <div className="aws-node__icon" style={{ color: categoryColor }}>
          {icon || <div className="aws-node__icon-fallback">{serviceType[0]?.toUpperCase()}</div>}
        </div>

        {/* Label */}
        <div className="aws-node__label">{label}</div>

        {/* Service type tag */}
        <div className="aws-node__type" style={{ color: categoryColor }}>
          {serviceType.toUpperCase()}
        </div>
      </div>
    </>
  );
}

export default memo(AWSNode);
