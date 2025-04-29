import React from 'react';
import Sidebar from './Sidebar';
import PeopleSelectorContent from './PeopleSelectorContent';

const Page: React.FC = () => {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Left Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden flex flex-col">
        <div className="flex-1 overflow-y-auto">
          <PeopleSelectorContent />
        </div>
      </div>
    </div>
  );
};

export default Page; 