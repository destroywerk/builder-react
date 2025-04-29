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