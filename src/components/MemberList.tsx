import React from 'react';
import MemberListItem from './MemberListItem';

// Placeholder data - replace with actual data fetching later
const placeholderMembers = [
  { type: 'entity', name: 'Legal Entity Example', description: 'A sample legal entity' },
  { type: 'person', name: 'Anne Behrenbrude', description: 'VP of Design' },
  { type: 'condition_set', name: 'Condition set', description: 'People who meet all conditions...' },
  { type: 'entity', name: 'Another Department', description: 'Sales Department' },
];

const MemberList: React.FC = () => {
  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden"> {/* Corresponds to Direct add frame */}
      {placeholderMembers.length > 0 ? (
        <div className="divide-y divide-gray-200">
          {placeholderMembers.map((member, index) => (
            <MemberListItem
              key={index} // Use a better key in real app
              type={member.type as 'person' | 'entity' | 'condition_set'} 
              name={member.name}
              description={member.description}
            />
          ))}
        </div>
      ) : (
        // Placeholder for Empty State (JSON lines 2985-3110)
        <div className="p-6 text-center text-gray-500">
          No members yet. Add people or set conditions.
        </div>
      )}
    </div>
  );
};

export default MemberList; 