import React from 'react';

// TODO: Define specific props based on Person, Entity, Builder types later
interface MemberListItemProps {
  type: 'person' | 'entity' | 'condition_set';
  name: string;
  description?: string;
  // Add other props like avatar, icons etc. as needed
}

const MemberListItem: React.FC<MemberListItemProps> = ({ type, name, description }) => {
  // Basic placeholder rendering
  return (
    <div className="flex items-center p-3 hover:bg-gray-50 rounded-lg cursor-pointer border-b last:border-b-0">
      {/* Placeholder for Avatar/Icon */}
      <div className="w-10 h-10 bg-gray-200 rounded-full mr-3 flex-shrink-0">
        {/* Icon based on type could go here */}
      </div>
      <div className="flex-grow">
        <div className="font-medium text-gray-900">{name}</div>
        {description && <div className="text-sm text-gray-500">{description}</div>}
      </div>
      {/* Placeholder for Action Button (e.g., remove) */}
      <button className="ml-4 text-gray-400 hover:text-red-600">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
};

export default MemberListItem; 