import { useState, useMemo } from 'react';
import { Search, ChevronDown, ChevronRight } from 'lucide-react';
import AWS_SERVICES, { AWS_CATEGORIES } from '../../data/awsServices';
import AWS_ICONS from '../nodes/AWSIcons';

function DraggableService({ service }) {
  const onDragStart = (event) => {
    event.dataTransfer.setData('application/infrasketch-service', service.id);
    event.dataTransfer.effectAllowed = 'move';
  };

  const categoryColor = AWS_CATEGORIES.find((c) => c.id === service.category)?.color || '#FF5C00';
  const icon = AWS_ICONS[service.id];

  return (
    <div
      className="palette-item"
      draggable
      onDragStart={onDragStart}
      title={service.fullName}
    >
      <div className="palette-item__icon" style={{ color: categoryColor }}>
        {icon || <span>{service.name[0]}</span>}
      </div>
      <div className="palette-item__info">
        <div className="palette-item__name">{service.name}</div>
        <div className="palette-item__desc">{service.description}</div>
      </div>
    </div>
  );
}

function CategoryGroup({ category, services, defaultOpen = false }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="palette-category">
      <button
        className="palette-category__header"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="palette-category__left">
          <div
            className="palette-category__dot"
            style={{ backgroundColor: category.color }}
          />
          <span className="palette-category__label">{category.label}</span>
          <span className="palette-category__count">{services.length}</span>
        </div>
        {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
      </button>
      {isOpen && (
        <div className="palette-category__items">
          {services.map((service) => (
            <DraggableService key={service.id} service={service} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function ComponentPalette() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCategories = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    return AWS_CATEGORIES.map((cat) => ({
      ...cat,
      services: AWS_SERVICES.filter(
        (s) =>
          s.category === cat.id &&
          (query === '' ||
            s.name.toLowerCase().includes(query) ||
            s.fullName.toLowerCase().includes(query) ||
            s.description.toLowerCase().includes(query))
      ),
    })).filter((cat) => cat.services.length > 0);
  }, [searchQuery]);

  return (
    <div className="palette">
      <div className="palette__header">
        <h2 className="palette__title">AWS Services</h2>
        <span className="palette__subtitle">Drag to canvas</span>
      </div>

      <div className="palette__search">
        <Search size={14} className="palette__search-icon" />
        <input
          type="text"
          placeholder="Search services..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="palette__search-input"
        />
      </div>

      <div className="palette__categories">
        {filteredCategories.map((cat, idx) => (
          <CategoryGroup
            key={cat.id}
            category={cat}
            services={cat.services}
            defaultOpen={idx < 2}
          />
        ))}
        {filteredCategories.length === 0 && (
          <div className="palette__empty">No services match "{searchQuery}"</div>
        )}
      </div>
    </div>
  );
}
