// types/index.ts
export interface User {
  id: string;
  username: string;
  role: 'admin' | 'agent';
}

export interface Account {
  id: string;
  username: string;
  password: string;
  role: 'admin' | 'agent';
}

export interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  loading: boolean;
}