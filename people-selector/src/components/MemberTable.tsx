import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { Condition } from './PeopleSelectorContent';

export interface Member {
  id: number;
  name: string;
  role: string;
  added: boolean;
  avatar?: string;
  department?: string;
  isExternal?: boolean;
  workplace?: string;
}

// Sample data for members
export const memberData: Member[] = [
  { id: 1, name: 'Wade Warren', role: 'Product Designer', added: true, avatar: 'https://randomuser.me/api/portraits/men/1.jpg', department: 'Design', workplace: 'London' },
  { id: 2, name: 'Darlene Robertson', role: 'Product Designer', added: true, avatar: 'https://randomuser.me/api/portraits/women/2.jpg', department: 'Design', workplace: 'London' },
  { id: 3, name: 'Cameron Williamson', role: 'Product Designer', added: true, department: 'Design', workplace: 'London' },
  { id: 4, name: 'Jerome Bell', role: 'Contractor', added: true, avatar: 'https://randomuser.me/api/portraits/men/4.jpg', department: 'Design', isExternal: true, workplace: 'London' },
  { id: 5, name: 'Amelia Right', role: 'UX Designer', added: true, department: 'Design', workplace: 'London' },
  { id: 6, name: 'Anne Behrenbrude', role: 'UX Designer', added: true, avatar: 'https://randomuser.me/api/portraits/women/5.jpg', department: 'Design', workplace: 'London' },
  { id: 7, name: 'Marcus Chen', role: 'Employee', added: true, avatar: 'https://randomuser.me/api/portraits/men/7.jpg', department: 'Marketing', workplace: 'London' },
  { id: 8, name: 'Sophia Martinez', role: 'Employee', added: true, avatar: 'https://randomuser.me/api/portraits/women/8.jpg', department: 'Marketing', workplace: 'London' },
  { id: 9, name: 'Ethan Thompson', role: 'Employee', added: true, department: 'Marketing', workplace: 'London' },
  { id: 10, name: 'Isabella Garcia', role: 'Employee', added: true, avatar: 'https://randomuser.me/api/portraits/women/10.jpg', department: 'Marketing', workplace: 'London' },
  { id: 11, name: 'Lucas Anderson', role: 'Employee', added: true, avatar: 'https://randomuser.me/api/portraits/men/11.jpg', department: 'Engineering', workplace: 'London' },
  { id: 12, name: 'Mia Rodriguez', role: 'Employee', added: true, department: 'Engineering', workplace: 'London' },
  { id: 13, name: 'Noah Wilson', role: 'Employee', added: true, avatar: 'https://randomuser.me/api/portraits/men/13.jpg', department: 'Engineering', workplace: 'London' },
  { id: 14, name: 'Emma Taylor', role: 'Employee', added: true, avatar: 'https://randomuser.me/api/portraits/women/14.jpg', department: 'Engineering', workplace: 'London' },
  { id: 15, name: 'Liam Brown', role: 'Employee', added: true, department: 'Engineering', workplace: 'London' },
  { id: 16, name: 'Olivia Davis', role: 'Employee', added: true, avatar: 'https://randomuser.me/api/portraits/women/16.jpg', department: 'Engineering', workplace: 'London' },
  { id: 17, name: 'Marjory Dawes', role: 'Employee', added: true, avatar: 'https://randomuser.me/api/portraits/women/17.jpg', department: 'Marketing', workplace: 'London' },
  { id: 19, name: 'Sarah Johnson', role: 'Employee', added: true, avatar: 'https://randomuser.me/api/portraits/women/19.jpg', department: 'Product Management', workplace: 'Berlin' },
  { id: 20, name: 'Michael Chen', role: 'Employee', added: true, avatar: 'https://randomuser.me/api/portraits/men/20.jpg', department: 'Product Management', workplace: 'Berlin' },
  { id: 21, name: 'Emily Wilson', role: 'Employee', added: true, avatar: 'https://randomuser.me/api/portraits/women/21.jpg', department: 'Product Management', workplace: 'Berlin' },
  { id: 22, name: 'David Kim', role: 'Employee', added: true, avatar: 'https://randomuser.me/api/portraits/men/22.jpg', department: 'Product Management', workplace: 'Munich' },
  { id: 23, name: 'Jennifer Lee', role: 'Employee', added: true, avatar: 'https://randomuser.me/api/portraits/women/23.jpg', department: 'Product Management', workplace: 'Munich' },
  { id: 24, name: 'Robert Garcia', role: 'Employee', added: true, avatar: 'https://randomuser.me/api/portraits/men/24.jpg', department: 'Product Management', workplace: 'London' },
  { id: 25, name: 'Lisa Thompson', role: 'Employee', added: true, avatar: 'https://randomuser.me/api/portraits/women/25.jpg', department: 'Product Management', isExternal: true, workplace: 'London' },
  { id: 26, name: 'James Miller', role: 'Employee', added: true, avatar: 'https://randomuser.me/api/portraits/men/26.jpg', department: 'Product Management', isExternal: true, workplace: 'Berlin' },
  { id: 27, name: 'Patricia Davis', role: 'Employee', added: true, avatar: 'https://randomuser.me/api/portraits/women/27.jpg', department: 'Product Management', workplace: 'London' },
  { id: 28, name: 'Thomas Anderson', role: 'Employee', added: true, avatar: 'https://randomuser.me/api/portraits/men/28.jpg', department: 'Product Management', workplace: 'Munich' },
];

export interface MemberTableProps {
  activeTab: string;
  onExclude: (member: {
    id: number;
    type: string;
    name: string;
    description: string;
    avatar?: string;
  }) => void;
  onInclude: (id: number) => void;
  selections: Array<{
    id: number;
    type: string;
    name: string;
    description: string;
  }>;
  exclusions: Array<{
    id: number;
    type: string;
    name: string;
    description: string;
  }>;
  conditions: Condition[];
  itemConditions: Record<number, Condition[]>;
  onCountsChange: (counts: { members: number; excluded: number; all: number; }) => void;
  toggleOptions: {
    excludeExternal: boolean;
  };
}

const MemberTable: React.FC<MemberTableProps> = ({
  activeTab,
  onExclude,
  onInclude,
  selections,
  exclusions,
  conditions,
  itemConditions,
  onCountsChange,
  toggleOptions
}) => {
  // Get selected members based on selections and conditions
  const selectedMembers = useMemo(() => {
    return memberData.filter(member => {
      // If there are advanced conditions, check those first
      if (conditions.length > 0) {
        return conditions.every(condition => {
          if (condition.field === 'Department' && member.department) {
            return condition.values?.includes(member.department) || false;
          } else if (condition.field === 'Workplace' && member.workplace) {
            return condition.values?.includes(member.workplace) || false;
          } else if (condition.field === 'Title') {
            return condition.value === member.role;
          }
          return false;
        });
      }

      // Check if member is selected by any selection and its conditions
      return selections.some(selection => {
        // First check if member matches the selection itself
        let matchesSelection = false;
        if (selection.type === 'person') {
          matchesSelection = member.id === selection.id;
        } else if (selection.type === 'department') {
          matchesSelection = member.department === selection.name.split(' (')[0];
        } else if (selection.type === 'position') {
          matchesSelection = member.role === selection.name.split(' (')[0];
        } else if (selection.type === 'workplace') {
          matchesSelection = member.workplace === selection.name.split(' (')[0];
        }

        if (!matchesSelection) {
          return false;
        }

        // Then check all conditions for this selection
        const selectionConditions = itemConditions[selection.id] || [];
        if (selectionConditions.length === 0) {
          return true;
        }

        return selectionConditions.every(condition => {
          if (condition.field === 'Department' && member.department) {
            return condition.values?.includes(member.department) || false;
          } else if (condition.field === 'Workplace' && member.workplace) {
            return condition.values?.includes(member.workplace) || false;
          } else if (condition.field === 'Title') {
            return condition.value === member.role;
          }
          return false;
        });
      });
    });
  }, [selections, conditions, itemConditions]);

  // Filter members based on active tab
  const filteredMembers = useMemo(() => {
    if (activeTab === 'members') {
      return selectedMembers.filter(member => !exclusions.some(excl => excl.id === member.id));
    } else if (activeTab === 'excluded') {
      return selectedMembers.filter(member => exclusions.some(excl => excl.id === member.id));
    } else {
      return selectedMembers;
    }
  }, [activeTab, selectedMembers, exclusions]);

  // Update counts
  useEffect(() => {
    onCountsChange({
      members: selectedMembers.filter(member => !exclusions.some(excl => excl.id === member.id)).length,
      excluded: selectedMembers.filter(member => exclusions.some(excl => excl.id === member.id)).length,
      all: selectedMembers.length
    });
  }, [selectedMembers, exclusions, onCountsChange]);

  const renderMembers = () => {
    if (filteredMembers.length === 0) {
      return (
        <div className="flex flex-col items-center h-full text-gray-500 px-4 pt-[30px]">
          <div className="w-12 h-12 border-2 border-dashed border-gray-300 rounded-lg mb-3 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
          <div className="text-base mb-2">No members yet</div>
          <div className="text-sm text-center text-gray-500">
            Set conditions to add members who meet multiple requirements or directly add people, departments, workplaces etc{' '}
            <button className="text-blue-600 hover:text-blue-700">Learn more</button>.
          </div>
        </div>
      );
    }

    return filteredMembers.map((member) => (
      <div
        key={member.id}
        className="px-4 py-1.5 border-b border-gray-200 hover:bg-gray-50"
      >
        <div className="flex items-center">
          <div className="w-10">
            {member.avatar ? (
              <img 
                src={member.avatar} 
                alt={member.name} 
                className="w-6 h-6 rounded-full"
              />
            ) : (
              <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs">
                {member.name.split(' ').map(n => n[0]).join('')}
              </div>
            )}
          </div>
          <div className="flex-grow pl-0">
            <div className="text-sm">{member.name}</div>
          </div>
          <div className="w-[120px] flex items-center justify-center">
            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
              Active
            </span>
          </div>
          <div className="w-20 text-center">
            {exclusions.some(excl => excl.id === member.id) ? (
              <button
                onClick={() => onInclude(member.id)}
                className="px-2 py-1 text-xs font-medium rounded bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Include
              </button>
            ) : (
              <button
                onClick={() => onExclude({
                  id: member.id,
                  type: 'person',
                  name: member.name,
                  description: member.role || 'No role',
                  avatar: member.avatar
                })}
                className="px-2 py-1 text-xs font-medium rounded bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Exclude
              </button>
            )}
          </div>
        </div>
      </div>
    ));
  };

  return (
    <div className="h-full">
      {renderMembers()}
    </div>
  );
};

export default MemberTable; 