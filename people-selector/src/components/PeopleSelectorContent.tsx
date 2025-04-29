import React, { useState, useMemo } from 'react';
import SearchInput from './SearchInput';
import MemberTable, { memberData } from './MemberTable';
import { Member } from '../types/Member';

// Tabs for the members view
const tabs = [
  { id: 'members', label: 'Members' },
  { id: 'excluded', label: 'Excluded' },
  { id: 'all', label: 'All' }
];

// Dummy data for condition options
const departmentOptions = [
  'Engineering',
  'Product Management',
  'Design',
  'Marketing',
  'Sales',
  'Customer Success',
  'Data Science',
  'DevOps',
  'Quality Assurance',
  'Human Resources',
  'Finance',
  'Legal',
  'Operations'
];

const workplaceOptions = ['Berlin', 'Munich', 'London', 'New York', 'San Francisco', 'Tokyo'];
const statusOptions = ['Onboarding', 'Active', 'On Leave', 'Terminated'];

export interface Condition {
  id: number;
  field: string;
  operator: string;
  value?: string;
  values?: string[];
}

interface SearchResultItem {
  id: number;
  type: string;
  name: string;
  description: string;
  avatar?: string;
  workplace?: string;
}

interface SearchResults {
  department: SearchResultItem[];
  position: SearchResultItem[];
  workplace: SearchResultItem[];
  person: SearchResultItem[];
}

interface Selection {
  id: number;
  type: string;
  name: string;
  description: string;
  avatar?: string;
  workplace?: string;
}

interface ExclusionItem {
  id: number;
  type: string;
  name: string;
  description: string;
  avatar?: string;
}

interface Item {
  id: number;
  type: string;
  name: string;
  description: string;
  avatar?: string;
}

const updatePeopleDataCounts = (memberData: Member[]): Item[] => {
  // Count members in each category
  const departmentCounts: { [key: string]: number } = {};
  const positionCounts: { [key: string]: number } = {};
  const workplaceCounts: { [key: string]: number } = {};
  
  memberData.forEach((member) => {
    if (member.department) {
      departmentCounts[member.department] = (departmentCounts[member.department] || 0) + 1;
    }
    if (member.role) {
      positionCounts[member.role] = (positionCounts[member.role] || 0) + 1;
    }
    if (member.workplace) {
      workplaceCounts[member.workplace] = (workplaceCounts[member.workplace] || 0) + 1;
    }
  });

  // Create updated items with counts
  return [
    // Teams
    { id: 401, type: 'team', name: 'Project Phoenix (8 people)', description: 'Core Product Development' },
    { id: 402, type: 'team', name: 'Atlas Initiative (6 people)', description: 'Platform Infrastructure' },
    { id: 403, type: 'team', name: 'Quantum Team (5 people)', description: 'Data Analytics' },
    { id: 404, type: 'team', name: 'Innovation Squad (7 people)', description: 'R&D' },
    { id: 405, type: 'team', name: 'Horizon Builders (4 people)', description: 'Frontend Development' },
    { id: 406, type: 'team', name: 'Nexus Group (6 people)', description: 'Backend Systems' },
    { id: 407, type: 'team', name: 'Catalyst Team (5 people)', description: 'Product Innovation' },

    // Legal Entities
    { id: 501, type: 'legal', name: 'Kolhorn Technologies GmbH', description: 'German Entity' },
    { id: 502, type: 'legal', name: 'Kolhorn Solutions Ltd.', description: 'UK Entity' },
    { id: 503, type: 'legal', name: 'Kolhorn Innovations Inc.', description: 'US Entity' },

    // Departments with dynamic counts
    ...Object.entries(departmentCounts).map(([dept, count], index) => ({
      id: index + 1,
      type: 'department',
      name: `${dept} (${count} people)`,
      description: 'Department'
    })),

    // Positions with dynamic counts
    ...Object.entries(positionCounts).map(([position, count], index) => ({
      id: 100 + index + 1,
      type: 'position',
      name: `${position} (${count} people)`,
      description: 'Position'
    })),

    // Workplaces with dynamic counts
    ...Object.entries(workplaceCounts).map(([workplace, count], index) => ({
      id: 300 + index + 1,
      type: 'workplace',
      name: `${workplace} (${count} people)`,
      description: 'Workplace'
    }))
  ];
};

const PeopleSelectorContent: React.FC = () => {
  // Tab state
  const [activeTab, setActiveTab] = useState('members');
  const [tabCounts, setTabCounts] = useState<{
    members: number;
    excluded: number;
    all: number;
  }>({ members: 0, excluded: 0, all: 0 });
  
  // Selected items state
  const [selections, setSelections] = useState<Selection[]>([]);
  
  // Conditions state
  const [conditions, setConditions] = useState<Condition[]>([
    { id: 1, field: 'Department', operator: 'is', values: ['Product Management'] }
  ]);
  
  // Exclusions state
  const [exclusions, setExclusions] = useState<ExclusionItem[]>([]);
  
  // Toggle options state
  const [toggleOptions, setToggleOptions] = useState({
    excludeHireDate: false,
    hireDateMonths: '6',
    excludeExternal: false,
    excludeOnLeave: true,
    onlyIncludeStatus: false,
    statusFilter: 'Onboarding'
  });
  
  // Search states
  const [memberSearchQuery, setMemberSearchQuery] = useState('');
  const [exclusionSearchQuery, setExclusionSearchQuery] = useState('');
  const [showMemberSearchResults, setShowMemberSearchResults] = useState(false);
  const [showExclusionSearchResults, setShowExclusionSearchResults] = useState(false);

  // Move useMemo inside the component
  const peopleData = useMemo(() => {
    return updatePeopleDataCounts(memberData);
  }, [memberData]);
  
  const memberSearchResults = useMemo(() => {
    if (!memberSearchQuery) return {
      department: [],
      position: [],
      workplace: [],
      person: []
    };

    const lowerQuery = memberSearchQuery.toLowerCase();
    
    const results: SearchResults = {
      department: [],
      position: [],
      workplace: [],
      person: []
    };

    // Search through departments
    results.department = peopleData.filter(item => 
      item.type === 'department' && 
      (item.name.toLowerCase().includes(lowerQuery) || 
       item.description.toLowerCase().includes(lowerQuery))
    );

    // Search through positions
    results.position = peopleData.filter(item => 
      item.type === 'position' && 
      (item.name.toLowerCase().includes(lowerQuery) || 
       item.description.toLowerCase().includes(lowerQuery))
    );

    // Search through workplaces
    results.workplace = peopleData.filter(item => 
      item.type === 'workplace' && 
      (item.name.toLowerCase().includes(lowerQuery) || 
       item.description.toLowerCase().includes(lowerQuery))
    );

    // Search through individual people
    results.person = memberData
      .filter(member => 
        !selections.some(sel => sel.id === member.id) && // Don't show already selected people
        (member.name.toLowerCase().includes(lowerQuery) ||
         member.role.toLowerCase().includes(lowerQuery) ||
         member.department?.toLowerCase().includes(lowerQuery) ||
         member.workplace?.toLowerCase().includes(lowerQuery))
      )
      .map(member => ({
        id: member.id,
        type: 'person',
        name: member.name,
        description: member.role,
        avatar: member.avatar,
        workplace: member.workplace
      }));

    return results;
  }, [memberSearchQuery, memberData, selections]);

  const handleAddSelection = (item: Selection) => {
    if (!selections.some(s => s.id === item.id)) {
      setSelections(prev => [...prev, item]);
      // Remove from exclusions if present
      if (exclusions.some(excl => excl.id === item.id)) {
        setExclusions(prev => prev.filter(excl => excl.id !== item.id));
      }
    }
    setShowMemberSearchResults(false);
    setMemberSearchQuery('');
  };

  // Add remove selection handler
  const handleRemoveSelection = (id: number) => {
    setSelections(prev => prev.filter(sel => sel.id !== id));
  };

  const renderMemberSearchResults = () => {
    if (!memberSearchQuery || !showMemberSearchResults) return null;

    const sections = [
      { key: 'department' as const, title: 'Departments' },
      { key: 'position' as const, title: 'Positions' },
      { key: 'workplace' as const, title: 'Workplaces' },
      { key: 'person' as const, title: 'People' }
    ];

    return (
      <div className="absolute z-10 mt-1 bg-white rounded-md shadow-lg max-h-[400px] overflow-y-auto" style={{ width: 'calc(100% - 2rem)' }}>
        {sections.map(section => {
          const items = memberSearchResults[section.key];
          if (!items || items.length === 0) return null;

          return (
            <div key={section.key} className="mb-4 p-2">
              <h3 className="text-sm font-medium text-gray-700 mb-2">{section.title}</h3>
              <div className="space-y-2">
                {items.map((item: SearchResultItem) => {
                  const selection: Selection = {
                    id: item.id,
                    type: item.type,
                    name: item.name,
                    description: item.description || 'No description',
                    avatar: item.avatar,
                    workplace: item.workplace
                  };

                  return (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-2 hover:bg-gray-50 cursor-pointer rounded"
                      onClick={() => handleAddSelection(selection)}
                    >
                      <div className="flex items-center">
                        {item.type === 'person' && (
                          <div className="mr-3">
                            {item.avatar ? (
                              <img 
                                src={item.avatar} 
                                alt={item.name} 
                                className="w-8 h-8 rounded-full"
                              />
                            ) : (
                              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                                {item.name.split(' ').map((n: string) => n[0]).join('')}
                              </div>
                            )}
                          </div>
                        )}
                        <div>
                          <div className="font-medium">{item.name}</div>
                          <div className="text-sm text-gray-500">{item.description}</div>
                        </div>
                      </div>
                      {item.workplace && (
                        <div className="text-sm text-gray-500">{item.workplace}</div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // Add condition with empty initial state
  const addCondition = () => {
    const newId = conditions.length > 0 
      ? Math.max(...conditions.map(c => c.id)) + 1 
      : 1;
    
    setConditions([...conditions, { 
      id: newId, 
      field: 'Department', 
      operator: 'is', 
      values: [] // Start with empty values
    }]);
  };
  
  // Update condition handling to only filter when values are selected
  const filterMembers = (members: Member[]) => {
    return members.filter(member => {
      // Check global conditions
      if (showAdvancedConditions) {
        return conditions.every(condition => {
          if (!condition.values || condition.values.length === 0) {
            return true; // Skip empty conditions
          }
          
          if (condition.field === 'Department') {
            return member.department && condition.values.includes(member.department);
          } else if (condition.field === 'Title') {
            return member.role && condition.value === member.role;
          } else if (condition.field === 'Workplace') {
            return member.workplace && condition.values.includes(member.workplace);
          }
          return true;
        });
      }

      // Check item-specific conditions
      return selections.every(selection => {
        const conditions = itemConditions[selection.id] || [];
        
        // First check if the member matches the selection itself
        let matchesSelection = false;
        if (selection.type === 'department') {
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
        return conditions.every(condition => {
          if (!condition.values || condition.values.length === 0) {
            return true; // Skip empty conditions
          }

          if (condition.field === 'Department') {
            return member.department && condition.values.includes(member.department);
          } else if (condition.field === 'Title') {
            return member.role && condition.value === member.role;
          } else if (condition.field === 'Workplace') {
            return member.workplace && condition.values.includes(member.workplace);
          }
          return true;
        });
      });
    });
  };
  
  // Update condition
  const updateCondition = (id: number, field: string, value: any) => {
    setConditions(conditions.map(condition => {
      if (condition.id === id) {
        const updatedCondition = { ...condition, [field]: value };
        // Initialize values array for multi-select fields if changing field type
        if (field === 'field') {
          if (value === 'Department' || value === 'Workplace') {
            updatedCondition.values = [];
            delete updatedCondition.value;
          } else {
            delete updatedCondition.values;
            updatedCondition.value = '';
          }
        }
        return updatedCondition;
      }
      return condition;
    }));
  };
  
  // Remove condition
  const removeCondition = (id: number) => {
    setConditions(conditions.filter(condition => condition.id !== id));
  };
  
  // Handle exclusion search
  const handleExclusionSearch = (query: string) => {
    setExclusionSearchQuery(query);
    if (query.trim()) {
      const searchTerm = query.toLowerCase();
      const filtered = peopleData.filter(item => {
        if (item.type !== 'person') {
          return false;
        }
        
        if (exclusions.some(excl => excl.id === item.id)) {
          return false;
        }
        
        const nameMatch = item.name.toLowerCase().includes(searchTerm);
        const descriptionMatch = (item.description || '').toLowerCase().includes(searchTerm);
        
        return nameMatch || descriptionMatch;
      });
      setShowExclusionSearchResults(true);
    } else {
      const allPeople = peopleData
        .filter(item => item.type === 'person')
        .filter(item => !exclusions.some(excl => excl.id === item.id))
        .sort((a, b) => a.name.localeCompare(b.name));
      
      setShowExclusionSearchResults(true);
    }
  };
  
  // Add exclusion with proper typing
  const addExclusion = (item: typeof peopleData[0]) => {
    if (!exclusions.some(excl => excl.id === item.id)) {
      const newExclusion: ExclusionItem = {
        id: item.id,
        type: item.type,
        name: item.name,
        description: item.description || 'No description',
        avatar: item.avatar
      };
      setExclusions([...exclusions, newExclusion]);
      if (selections.some(sel => sel.id === item.id)) {
        setSelections(selections.filter(sel => sel.id !== item.id));
      }
    }
    setExclusionSearchQuery('');
    setShowExclusionSearchResults(false);
  };
  
  // Remove exclusion
  const removeExclusion = (id: number) => {
    setExclusions(exclusions.filter(item => item.id !== id));
  };
  
  // Toggle option change
  const handleToggleChange = (option: string, value: boolean) => {
    setToggleOptions({
      ...toggleOptions,
      [option]: value
    });

    if (option === 'excludeExternal') {
      const externalEmployees = memberData.filter((member) => member.isExternal);
      
      if (value) {
        const newExclusions: ExclusionItem[] = externalEmployees
          .filter((external) => !exclusions.some(excl => excl.id === external.id))
          .map((external) => ({
            id: external.id,
            type: 'person',
            name: external.name,
            description: external.role || 'No role',
            avatar: external.avatar
          }));
        
        if (newExclusions.length > 0) {
          setExclusions([...exclusions, ...newExclusions]);
        }
      } else {
        setExclusions(exclusions.filter(excl => 
          !externalEmployees.some((external) => external.id === excl.id)
        ));
      }
    }
  };
  
  // Update dropdown value
  const handleDropdownChange = (option: string, value: string) => {
    setToggleOptions({
      ...toggleOptions,
      [option]: value
    });
  };

  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    department: false,
    position: false,
    workplace: false,
    person: false
  });

  const toggleSection = (type: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  const [showAdvancedConditions, setShowAdvancedConditions] = useState(false);
  const [itemConditions, setItemConditions] = useState<Record<number, Condition[]>>({});

  // Add condition to specific item
  const addItemCondition = (itemId: number) => {
    const currentConditions = itemConditions[itemId] || [];
    const newId = currentConditions.length > 0 
      ? Math.max(...currentConditions.map(c => c.id)) + 1 
      : 1;
    
    // If this is the first condition, convert the selection into a condition
    if (currentConditions.length === 0) {
      const selection = selections.find(s => s.id === itemId);
      if (selection) {
        const baseCondition = {
          id: newId,
          field: selection.type.charAt(0).toUpperCase() + selection.type.slice(1),
          operator: "is",
          values: [selection.name.split(' (')[0]] // Remove the count part
        };
        setItemConditions({
          ...itemConditions,
          [itemId]: [baseCondition]
        });
        return;
      }
    }
    
    // Add a new empty condition
    setItemConditions({
      ...itemConditions,
      [itemId]: [...currentConditions, { 
        id: newId, 
        field: "", 
        operator: "is", 
        values: [] 
      }]
    });
  };

  // Update condition for specific item
  const updateItemCondition = (itemId: number, conditionId: number, field: string, value: any) => {
    const currentConditions = itemConditions[itemId] || [];
    setItemConditions({
      ...itemConditions,
      [itemId]: currentConditions.map(condition => {
        if (condition.id === conditionId) {
          const updatedCondition = { ...condition, [field]: value };
          if (field === 'field') {
            if (value === 'Department' || value === 'Workplace') {
              updatedCondition.values = [];
              delete updatedCondition.value;
            } else {
              delete updatedCondition.values;
              updatedCondition.value = '';
            }
          }
          return updatedCondition;
        }
        return condition;
      })
    });
  };

  // Remove condition from specific item
  const removeItemCondition = (itemId: number, conditionId: number) => {
    const currentConditions = itemConditions[itemId] || [];
    setItemConditions({
      ...itemConditions,
      [itemId]: currentConditions.filter(condition => condition.id !== conditionId)
    });
  };

  // Convert selections and their conditions to advanced conditions
  const convertToAdvancedConditions = () => {
    const newConditions: Condition[] = [];
    let nextId = 1;

    // Convert each selection into conditions
    selections.forEach(selection => {
      if (selection.type === 'department') {
        newConditions.push({
          id: nextId++,
          field: 'Department',
          operator: 'is',
          values: [selection.name.split(' (')[0]] // Remove the count part
        });
      } else if (selection.type === 'position') {
        newConditions.push({
          id: nextId++,
          field: 'Title',
          operator: 'is',
          value: selection.name.split(' (')[0] // Remove the count part
        });
      } else if (selection.type === 'workplace') {
        newConditions.push({
          id: nextId++,
          field: 'Workplace',
          operator: 'is',
          values: [selection.name.split(' (')[0]] // Remove the count part
        });
      }

      // Add any additional conditions from the item
      const itemSpecificConditions = itemConditions[selection.id] || [];
      itemSpecificConditions.forEach(condition => {
        newConditions.push({
          ...condition,
          id: nextId++
        });
      });
    });

    setConditions(newConditions);
    setSelections([]);
    setItemConditions({});
    setShowAdvancedConditions(true);
  };

  // Convert advanced conditions back to selections
  const convertToSimpleConditions = () => {
    const newSelections: Selection[] = [];
    const newItemConditions: Record<number, Condition[]> = {};
    let nextId = Math.max(...peopleData.map(item => item.id)) + 1;

    conditions.forEach(condition => {
      if (condition.field === 'Department' && condition.values?.length) {
        condition.values.forEach(value => {
          const existingItem = peopleData.find(
            item => item.type === 'department' && item.name.split(' (')[0] === value
          );
          if (existingItem) {
            newSelections.push({
              id: existingItem.id,
              type: 'department',
              name: existingItem.name,
              description: existingItem.description
            });
          }
        });
      } else if (condition.field === 'Title' && condition.value) {
        const existingItem = peopleData.find(
          item => item.type === 'position' && item.name.split(' (')[0] === condition.value
        );
        if (existingItem) {
          newSelections.push({
            id: existingItem.id,
            type: 'position',
            name: existingItem.name,
            description: existingItem.description
          });
        }
      } else if (condition.field === 'Workplace' && condition.values?.length) {
        condition.values.forEach(value => {
          const existingItem = peopleData.find(
            item => item.type === 'workplace' && item.name.split(' (')[0] === value
          );
          if (existingItem) {
            newSelections.push({
              id: existingItem.id,
              type: 'workplace',
              name: existingItem.name,
              description: existingItem.description
            });
          }
        });
      }
    });

    setSelections(newSelections);
    setItemConditions(newItemConditions);
    setConditions([]);
    setShowAdvancedConditions(false);
  };

  return (
    <div className="flex h-full">
      {/* Left section - Member selection */}
      <div className="flex-1 flex flex-col bg-white">
        {/* Header with close button */}
        <div className="h-16 flex items-center justify-between pl-[100px] pr-6 border-b border-gray-200">
          <h1 className="text-xl font-medium">Select people</h1>
          <button className="text-gray-500 hover:text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        {/* Main content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-3xl mx-auto px-12">
            <p className="text-sm text-gray-500 mb-4">
              All selected items will be included in the group and automatically updated
            </p>

            {/* Search input */}
            <div className="relative">
              <SearchInput
                value={memberSearchQuery}
                onChange={(e) => setMemberSearchQuery(e.target.value)}
                onFocus={() => setShowMemberSearchResults(true)}
                placeholder="Add people, departments, teams, workplaces etc."
              />
              {renderMemberSearchResults()}
            </div>

            <div className="mt-4 space-y-2">
              {selections.map(item => (
                <SelectedItem 
                  key={item.id}
                  type={item.type as 'person' | 'position' | 'department'} 
                  name={item.name} 
                  description={item.description}
                  onRemove={() => handleRemoveSelection(item.id)}
                  conditions={itemConditions[item.id] || []}
                  onAddCondition={() => addItemCondition(item.id)}
                  onUpdateCondition={(conditionId, field, value) => 
                    updateItemCondition(item.id, conditionId, field, value)
                  }
                  onRemoveCondition={(conditionId) => removeItemCondition(item.id, conditionId)}
                  options={{
                    departments: departmentOptions,
                    workplaces: workplaceOptions
                  }}
                />
              ))}
            </div>

            {/* Add 24px padding */}
            <div className="h-6"></div>

            {/* Exclusions section */}
            <div className="pt-6 border-t border-gray-200">
              <h2 className="text-base font-medium mb-1">Exclusions</h2>
              <p className="text-sm text-gray-500 mb-4">Choose people or conditions who will be excluded from the above selection.</p>
              
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <div className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white focus-within:outline-none focus-within:ring-1 focus-within:ring-purple-200 focus-within:border-purple-200">
                  <div className="flex items-center flex-wrap gap-2">
                    {exclusions.map(item => (
                      <div key={item.id} className="flex items-center bg-gray-100 rounded-md py-0.5 px-2">
                        {item.avatar ? (
                          <img 
                            src={item.avatar} 
                            alt={item.name} 
                            className="w-8 h-8 rounded-full mr-1.5"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs mr-1.5">
                            {item.name.split(' ').map(n => n[0]).join('')}
                          </div>
                        )}
                        <span className="text-sm">{item.name}</span>
                        <button 
                          className="ml-1 text-gray-500 hover:text-red-600"
                          onClick={() => removeExclusion(item.id)}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    ))}
                    <input
                      type="text"
                      className="flex-1 min-w-[200px] text-gray-500 focus:outline-none"
                      placeholder={exclusions.length === 0 ? "Search people to exclude" : ""}
                      value={exclusionSearchQuery}
                      onChange={(e) => handleExclusionSearch(e.target.value)}
                      onFocus={() => {
                        setShowExclusionSearchResults(true);
                        handleExclusionSearch(''); // Show all people when focused
                      }}
                      onBlur={(e) => {
                        // Check if the click is within the dropdown
                        const relatedTarget = e.relatedTarget as HTMLElement;
                        if (!relatedTarget?.closest('.exclusion-search-dropdown')) {
                          setTimeout(() => {
                            setShowExclusionSearchResults(false);
                          }, 200);
                        }
                      }}
                    />
                  </div>
                </div>

                {/* Exclusion search results dropdown */}
                {showExclusionSearchResults && (
                  <div 
                    className="exclusion-search-dropdown absolute z-10 mt-1 w-full bg-white shadow-lg rounded-lg border border-gray-200 max-h-[200px] overflow-y-auto"
                    style={{ bottom: 'auto' }}
                    onMouseDown={(e) => e.preventDefault()}
                  >
                    {peopleData
                      .filter(item => 
                        item.type === 'person' && 
                        !exclusions.some(excl => excl.id === item.id) &&
                        (exclusionSearchQuery === '' || 
                         item.name.toLowerCase().includes(exclusionSearchQuery.toLowerCase()) ||
                         item.description.toLowerCase().includes(exclusionSearchQuery.toLowerCase()))
                      )
                      .sort((a, b) => a.name.localeCompare(b.name))
                      .map(result => (
                        <div 
                          key={result.id}
                          className="px-4 py-2 hover:bg-gray-50 cursor-pointer flex items-center"
                          onClick={() => addExclusion(result)}
                        >
                          {result.avatar ? (
                            <img 
                              src={result.avatar} 
                              alt={result.name} 
                              className="w-8 h-8 rounded-full object-cover mr-3"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-800 mr-3">
                              {result.name.split(' ').map((n: string) => n[0]).join('')}
                            </div>
                          )}
                          <div>
                            <div className="font-medium">{result.name}</div>
                            <div className="text-sm text-gray-500">{result.description}</div>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>

              {/* Toggle options */}
              <div className="mt-4 space-y-3">
                <ToggleOption 
                  label="Exclude people with hire date within" 
                  value={toggleOptions.hireDateMonths}
                  active={toggleOptions.excludeHireDate}
                  onToggle={(value) => handleToggleChange('excludeHireDate', value)}
                  onValueChange={(value) => handleDropdownChange('hireDateMonths', value)}
                  options={['3', '6', '12', '18', '24']}
                />
                <ToggleOption 
                  label="Exclude external employees" 
                  active={toggleOptions.excludeExternal}
                  onToggle={(value) => handleToggleChange('excludeExternal', value)}
                />
                <ToggleOption 
                  label="Exclude employees on leave" 
                  active={toggleOptions.excludeOnLeave}
                  onToggle={(value) => handleToggleChange('excludeOnLeave', value)}
                />
                <ToggleOption 
                  label="Only include people with status" 
                  value={toggleOptions.statusFilter}
                  active={toggleOptions.onlyIncludeStatus}
                  onToggle={(value) => handleToggleChange('onlyIncludeStatus', value)}
                  onValueChange={(value) => handleDropdownChange('statusFilter', value)}
                  options={statusOptions}
                />
              </div>

              {/* Advanced exclusions link */}
              <button className="mt-4 text-sm text-purple-700 hover:text-purple-800">
                Switch to advanced exclusions
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="h-16 border-t border-gray-200 flex items-center justify-end px-6 space-x-3">
          <button className="px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
            Cancel
          </button>
          <button className="px-4 py-2 text-sm text-white bg-purple-700 rounded-md hover:bg-purple-800">
            Save
          </button>
        </div>
      </div>

      {/* Right section - Member table */}
      <div className="w-[480px] border-l border-gray-200 bg-white">
        {/* Tabs */}
        <div className="border-b border-gray-200" style={{ paddingTop: '65px' }}>
          <div className="flex px-4">
            {tabs.map(tab => {
              const count = tabCounts[tab.id as keyof typeof tabCounts];
              return (
              <button
                key={tab.id}
                className={`py-4 px-4 text-base font-medium ${
                  activeTab === tab.id
                      ? 'text-purple-700 border-b-2 border-purple-700'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
                  {count !== undefined && (
                    <span className={`ml-2 ${activeTab === tab.id ? 'text-purple-700' : 'text-gray-400'}`}>
                      {count}
                  </span>
                )}
              </button>
              );
            })}
          </div>
        </div>

        {/* Table headers */}
        <div className="flex items-center px-4 py-2 border-b border-gray-200 bg-gray-50 text-xs font-medium text-gray-500">
          <div className="w-0"></div>
          <div className="flex items-center flex-grow pl-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
            Employee
          </div>
          <div className="w-[120px] text-center flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 2a1 1 0 00-1 1v1.323l-3.954 1.582A1 1 0 004 6.868V16a1 1 0 001 1h10a1 1 0 001-1V6.868a1 1 0 00-1.046-.963L11 4.323V3a1 1 0 00-1-1H10zm4 8V7l-5-2v3h5z" clipRule="evenodd" />
            </svg>
            Status
          </div>
          <div className="w-20 text-center flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
            </svg>
            Action
          </div>
        </div>

        {/* Member table content */}
        <div className="overflow-y-auto" style={{ height: 'calc(100% - 87px)' }}>
          <MemberTable 
            activeTab={activeTab} 
            onExclude={(member) => {
              if (!exclusions.some(excl => excl.id === member.id)) {
                setExclusions([...exclusions, member]);
              }
            }}
            onInclude={(id: number) => {
              removeExclusion(id);
            }}
            selections={selections}
            exclusions={exclusions}
            conditions={showAdvancedConditions ? conditions : []}
            itemConditions={itemConditions}
            onCountsChange={(counts) => setTabCounts(counts)}
            toggleOptions={{ excludeExternal: toggleOptions.excludeExternal }}
          />
        </div>
      </div>
    </div>
  );
};

// Component for selected items (person, group, etc.)
interface SelectedItemProps {
  type: 'person' | 'position' | 'department';
  name: string;
  description: string;
  onRemove: () => void;
  conditions?: Condition[];
  onAddCondition?: () => void;
  onUpdateCondition?: (id: number, field: string, value: any) => void;
  onRemoveCondition?: (id: number) => void;
  options?: {
    departments: string[];
    workplaces: string[];
  };
}

const SelectedItem: React.FC<SelectedItemProps> = ({ 
  type, 
  name, 
  description, 
  onRemove,
  conditions = [],
  onAddCondition,
  onUpdateCondition,
  onRemoveCondition,
  options
}) => {
  // Get the appropriate icon based on type
  const getIcon = () => {
    if (conditions.length > 0) {
      // Show purple circle with people icon for conditions
      return (
        <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-800">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        </div>
      );
    }
    if (type === 'person') {
      // Find the person in memberData to get their avatar
      const person = memberData.find(p => p.name === name);
      if (person?.avatar) {
        return (
          <img 
            src={person.avatar} 
            alt={name}
            className="w-8 h-8 rounded-full object-cover"
          />
        );
      }
      return (
        <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-800">
          <span>{name.split(' ').map(n => n[0]).join('')}</span>
        </div>
      );
    } else if (type === 'position') {
      return (
        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-800">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
      );
    } else {
      return (
        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-800">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        </div>
      );
    }
  };

  return (
    <div className="bg-[#F7F7FA] rounded-xl py-2.5 px-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          {getIcon()}
          <div className="ml-3 flex flex-col justify-center min-h-[32px]">
            {conditions.length > 0 ? (
              <div className="font-medium">People added based on all of the following conditions</div>
            ) : (
              <>
                <div className="font-medium">{name}</div>
                <div className="text-sm text-gray-500">{description}</div>
              </>
            )}
          </div>
        </div>
        <div className="flex items-center gap-6">
          {type !== 'person' && onAddCondition && conditions.length === 0 && (
            <button 
              className="text-sm text-purple-700 hover:text-purple-800"
              onClick={onAddCondition}
            >
              + Add condition
            </button>
          )}
          <button 
            className="text-gray-400 hover:text-gray-500"
            onClick={onRemove}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>

      {/* Conditions section */}
      {conditions && onUpdateCondition && onRemoveCondition && options && conditions.length > 0 && (
        <div className="mt-3 space-y-2">
          {conditions.map(condition => (
            <ConditionRow
              key={condition.id}
              condition={condition}
              options={options}
              onUpdate={(field, value) => onUpdateCondition(condition.id, field, value)}
              onRemove={() => onRemoveCondition(condition.id)}
              selections={[]}
              onAddSelection={() => {}}
            />
          ))}
          <button 
            className="text-sm text-purple-700 hover:text-purple-800 flex items-center"
            onClick={onAddCondition}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Add condition
          </button>
        </div>
      )}
    </div>
  );
};

// Component for condition row
interface ConditionRowProps {
  condition: Condition;
  options: {
    departments: string[];
    workplaces: string[];
  };
  onUpdate: (field: string, value: any) => void;
  onRemove: () => void;
  selections: Array<{
    id: number;
    type: string;
    name: string;
    description: string;
  }>;
  onAddSelection: (item: {
    id: number;
    type: string;
    name: string;
    description: string;
  }) => void;
}

const ConditionRow: React.FC<ConditionRowProps> = ({ 
  condition, 
  options, 
  onUpdate, 
  onRemove,
  selections,
  onAddSelection
}) => {
  const [isFocused, setIsFocused] = useState(false);
  
  // Get options based on field
  const getFieldOptions = () => {
    if (condition.field === 'Department') {
      return options.departments.filter(dep => !condition.values?.includes(dep));
    } else if (condition.field === 'Workplace') {
      return options.workplaces.filter(wp => !condition.values?.includes(wp));
    }
    return [];
  };

  // Remove a specific value from multi-select
  const removeValue = (value: string) => {
    if (condition.values) {
      const newValues = condition.values.filter(v => v !== value);
      onUpdate('values', newValues);
    }
  };

  // Add a new value to multi-select
  const addValue = (value: string) => {
    const currentValues = condition.values || [];
    if (!currentValues.includes(value)) {
      onUpdate('values', [...currentValues, value]);
    }
  };

  // Check if field uses multi-select
  const isMultiSelect = condition.field === 'Department' || condition.field === 'Workplace';

  // Handle field change
  const handleFieldChange = (newField: string) => {
    onUpdate('field', newField);
  };

  return (
    <div className="flex items-center">
      <div className="w-1/3">
        <div className="relative">
          <select 
            className="block w-full pl-3 pr-10 py-2 text-sm border border-gray-300 rounded-lg appearance-none bg-white h-[42px]"
            value={condition.field || ""}
            onChange={(e) => handleFieldChange(e.target.value)}
          >
            <option value="" className="text-gray-500 italic">Select value</option>
            <option>Department</option>
            <option>Workplace</option>
            <option>Position</option>
            <option>Status</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
      </div>
      
      <div className="w-1/5 mx-2">
        <div className="relative">
          <select 
            className="block w-full pl-3 pr-10 py-2 text-sm border border-gray-300 rounded-lg appearance-none bg-white h-[42px]"
            value={condition.operator}
            onChange={(e) => onUpdate('operator', e.target.value)}
          >
            <option>is</option>
            <option>is not</option>
            {!isMultiSelect && <option>contains</option>}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
      </div>
      
      <div className="flex-1">
        {isMultiSelect ? (
          <div className="relative flex-1">
            <div 
              className="flex flex-wrap items-center border border-gray-300 rounded-lg p-0.5 pl-2 bg-white min-h-[42px] cursor-pointer"
              onClick={() => setIsFocused(true)}
            >
              {condition.values?.map((val, index) => (
                <div key={index} className="flex items-center bg-gray-100 rounded-md m-0.5">
                  <span className="px-1.5 py-0.5 text-sm">{val}</span>
                  <button 
                    className="text-gray-400 hover:text-gray-500 p-0.5"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeValue(val);
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              ))}
              <div className="px-2 py-1 text-sm text-gray-500">
                {!condition.values?.length ? `Select ${condition.field.toLowerCase()}...` : ''}
              </div>
            </div>
            {isFocused && (
              <div 
                className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-[200px] overflow-y-auto"
                onMouseDown={(e) => e.preventDefault()}
              >
                {getFieldOptions().map(opt => (
                  <div
                    key={opt}
                    className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      addValue(opt);
                      setIsFocused(false);
                    }}
                    onMouseDown={(e) => e.preventDefault()}
                  >
                    {opt}
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <select 
            className="block w-full pl-3 pr-10 py-2 text-sm border border-gray-300 rounded-lg appearance-none bg-white h-[42px]"
            value={condition.value || ''}
            onChange={(e) => {
              if (e.target.value) {
                onUpdate('value', e.target.value);
              }
            }}
          >
            <option value="">Select a value</option>
            {getFieldOptions().map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        )}
      </div>
      
      <button 
        className="ml-2 text-gray-400 hover:text-gray-500"
        onClick={onRemove}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
      </button>
    </div>
  );
};

// Component for toggle options
interface ToggleOptionProps {
  label: string;
  value?: string;
  active: boolean;
  options?: string[];
  onToggle: (value: boolean) => void;
  onValueChange?: (value: string) => void;
}

const ToggleOption: React.FC<ToggleOptionProps> = ({ 
  label, 
  value, 
  active, 
  options,
  onToggle,
  onValueChange 
}) => {
  return (
    <div className="flex items-center">
      <label className="inline-flex items-center cursor-pointer">
        <span className="relative">
          <span 
            className={`block w-10 h-6 ${active ? 'bg-purple-700' : 'bg-gray-300'} rounded-full transition-colors duration-200 ease-in-out`}
            onClick={() => onToggle(!active)}
          >
            <span className={`absolute left-0.5 top-0.5 bg-white w-5 h-5 rounded-full transition-transform duration-200 ease-in-out ${active ? 'transform translate-x-4' : ''}`} />
          </span>
        </span>
        <span className="ml-3 text-sm text-gray-700">{label}</span>
      </label>
      {value && options && onValueChange && (
        <div className="relative ml-2">
          <select 
            className="block pl-3 pr-8 py-1 text-sm border border-gray-300 rounded-md appearance-none bg-white"
            value={value}
            onChange={(e) => onValueChange(e.target.value)}
            disabled={!active}
          >
            {options.map(option => (
              <option key={option} value={option}>
                {option}{label.includes('hire date') ? ' months' : ''}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
      )}
    </div>
  );
};

// Component for excluded items
interface ExcludedItemProps {
  item: {
    id: number;
    type: string;
    name: string;
    description: string;
    avatar?: string;
  };
  onRemove: (id: number) => void;
}

const ExcludedItem: React.FC<ExcludedItemProps> = ({ item, onRemove }) => {
  return (
    <div className="flex items-center justify-between bg-gray-50 p-2 rounded">
      <div className="flex items-center">
        {item.avatar ? (
          <img 
            src={item.avatar} 
            alt={item.name} 
            className="w-8 h-8 rounded-full mr-2"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center mr-2">
            {item.name.split(' ').map(n => n[0]).join('')}
          </div>
        )}
        <div>
          <div className="text-sm font-medium">{item.name}</div>
          <div className="text-xs text-gray-500">{item.description}</div>
        </div>
      </div>
      <button
        onClick={() => onRemove(item.id)}
        className="text-gray-400 hover:text-gray-500"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
};

export default PeopleSelectorContent; 