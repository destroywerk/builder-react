import React, { useState } from 'react';

const tabs = ['Details', 'Members (16)', 'Settings']; // Example tab names

const SplitView: React.FC = () => {
  const [activeTab, setActiveTab] = useState(tabs[0]);

  return (
    <div className="flex flex-col h-full border-l border-gray-200">
      {/* Split View Header */}
      <div className="h-20 border-b border-gray-200 flex items-center justify-between px-6">
        {/* Placeholder Title - adapt based on context */}
        <h2 className="text-lg font-medium text-gray-900">Details Panel</h2> 
        <button className="text-gray-500 hover:text-gray-700">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 px-6">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`
                ${activeTab === tab
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
                whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
              `}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      {/* Split View Content Area - Content depends on active tab */}
      <div className="flex-1 overflow-y-auto p-8">
        {/* Render content based on activeTab */} 
        {activeTab === 'Details' && <div>Details Content Placeholder</div>}
        {activeTab === 'Members (16)' && <div>Members Table/List Placeholder</div>}
        {activeTab === 'Settings' && <div>Settings Content Placeholder</div>}
      </div>
    </div>
  );
};

export default SplitView; 