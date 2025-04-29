import React from 'react';
import PeopleSelectorContent from './components/PeopleSelectorContent';
import Sidebar from './components/Sidebar';

const App: React.FC = () => {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1">
        <PeopleSelectorContent />
      </div>
    </div>
  );
};

export default App;
