export type UserRole = 
  | 'admin'
  | 'gestionnaire'
  | 'verificateur'
  | 'user'
  | 'entreprise'
  | 'dgm'
  | 'itravail'
  | 'igeneral'
  | 'cnss';

export interface UserProfile {
  id: string
  email: string
  first_name: string
  last_name: string
  role: UserRole
  created_at: string
}

// export type UserRole = 'admin' | 'editor' | 'user' | 'guest'
