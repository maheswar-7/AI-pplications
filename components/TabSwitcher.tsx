
import React from 'react';
import { AppTab } from '../types';

interface TabSwitcherProps {
  activeTab: AppTab;
  onTabChange: (tab: AppTab) => void;
}

const TabSwitcher: React.FC<TabSwitcherProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: AppTab.MOCKUP, label: 'Merch Mockup Generator' },
    { id: AppTab.EDITOR, label: 'AI Image Editor' },
  ];

  return (
    <div className="flex justify-center p-2 bg-gray-800 rounded-lg max-w-md mx-auto">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`w-full px-3 py-2.5 text-sm font-semibold rounded-md transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-800 focus-visible:ring-indigo-500 ${
            activeTab === tab.id
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-gray-300 hover:bg-gray-700'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default TabSwitcher;
