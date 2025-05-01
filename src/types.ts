export interface Condition {
  field: string;
  operator: 'equals' | 'contains' | 'startsWith';
  value: string;
} 