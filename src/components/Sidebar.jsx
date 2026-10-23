import React from 'react';
import { Home, Copy, Tag, LayoutGrid, HelpCircle } from 'lucide-react';

export default function Sidebar({
  activeTab,
  setActiveTab,
  stats,
  isScanned,
  onOpenGuide,
}) {
  const navItems = [
    {
      id: 'home',
      label: 'Home',
      icon: Home,
      badge: null,
      badgeColor: null,
    },
    {
      id: 'duplicates',
      label: 'Duplicate Labels',
      icon: Copy,
      badge: isScanned && stats.duplicateLabelsCount > 0 ? stats.duplicateLabelsCount : null,
      badgeColor: 'badge-pink',
    },
    {
      id: 'unused',
      label: 'Unused Labels',
      icon: Tag,
      badge: isScanned && stats.unusedLabelsCount > 0 ? stats.unusedLabelsCount : null,
      badgeColor: 'badge-yellow',
    },
    {
      id: 'all',
      label: 'All Labels',
      icon: LayoutGrid,
      badge: isScanned ? stats.totalLabelsCount : null,
      badgeColor: 'badge-gray',
    },
  ];

  return (
    <aside className="modal-sidebar">
      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
              onClick={() => setActiveTab(item.id)}
            >
              <span className="nav-item-icon-wrap">
                <Icon size={18} />
              </span>
              <span className="nav-item-label">{item.label}</span>
              {item.badge !== null && (
                <span className={`nav-item-badge ${item.badgeColor}`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <button className="sidebar-guide-btn" onClick={onOpenGuide}>
          <HelpCircle size={15} />
          <span>Trello Power-Up Setup</span>
        </button>
      </div>
    </aside>
  );
}
