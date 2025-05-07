import React, { useState } from 'react';

interface Condition {
  field: string;
  operator: string;
  value?: string;
  values?: string[];
}

interface ConditionSetProps {
  conditions: Condition[];
  onAddCondition: () => void;
  onRemoveCondition: (index: number) => void;
  onUpdateCondition: (index: number, updatedCondition: Condition) => void;
}

const ConditionSet: React.FC<ConditionSetProps> = ({
  conditions,
  onAddCondition,
  onRemoveCondition,
  onUpdateCondition,
}) => {
  const [isOpen, setIsOpen] = useState(conditions.length > 0);

  const handleAddClick = () => {
    setIsOpen(true);
    onAddCondition();
  };

  if (!isOpen) {
    return (
      <button
        onClick={handleAddClick}
        className="mt-2 flex items-center text-gray-700 hover:text-gray-900 text-sm font-medium"
      >
        <svg
          className="w-5 h-5 mr-1"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
          />
        </svg>
        Add condition set
      </button>
    );
  }

  return (
    <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
      <div className="space-y-4">
        {conditions.map((condition, index) => (
          <div key={index} className="flex items-center gap-2">
            <select
              className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={condition.field}
              onChange={(e) => {
                onUpdateCondition(index, { ...condition, field: e.target.value });
              }}
            >
              <option value="">Select field</option>
              <option value="department">Department</option>
              <option value="role">Role</option>
              <option value="workplace">Workplace</option>
              <option value="location">Location</option>
            </select>
            <select
              className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={condition.operator}
              onChange={(e) => {
                onUpdateCondition(index, {
                  ...condition,
                  operator: e.target.value,
                });
              }}
            >
              {condition.field === 'workplace' ? (
                <option value="equals">equals</option>
              ) : (
                <>
                  <option value="equals">equals</option>
                  <option value="contains">contains</option>
                  <option value="startsWith">starts with</option>
                </>
              )}
            </select>
            {condition.field === 'workplace' ? (
              <select
                className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={condition.value}
                onChange={(e) => {
                  onUpdateCondition(index, { ...condition, value: e.target.value });
                }}
              >
                <option value="">Select workplace</option>
                <option value="Berlin">Berlin</option>
                <option value="Munich">Munich</option>
                <option value="London">London</option>
              </select>
            ) : (
              <input
                type="text"
                className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Value"
                value={condition.value}
                onChange={(e) => {
                  onUpdateCondition(index, { ...condition, value: e.target.value });
                }}
              />
            )}
            <button
              onClick={() => {
                onRemoveCondition(index);
                if (conditions.length === 1) {
                  setIsOpen(false);
                }
              }}
              className="p-2 text-gray-400 hover:text-gray-600"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ))}
        <button
          onClick={onAddCondition}
          className="text-sm text-blue-600 hover:text-blue-700 font-medium"
        >
          + Add another condition
        </button>
      </div>
    </div>
  );
};

export default ConditionSet; 