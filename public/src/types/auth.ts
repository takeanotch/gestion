export interface UserProfile {
  id: string
  email: string
  created_at: string
}

export interface Role {
  id: string
  name: string
  description: string | null
  created_at: string
}

export interface AuthContextType {
  user: any | null // Type plus spécifique possible avec @supabase/supabase-js
  profile: UserProfile | null
  roles: Role[]
  loading: boolean
  signUp: (email: string, password: string, roleNames?: string[]) => Promise<any>
  signIn: (email: string, password: string) => Promise<any>
  signOut: () => Promise<void>
  hasRole: (roleName: string) => boolean
  hasAnyRole: (roleNames: string[]) => boolean
  hasAllRoles: (roleNames: string[]) => boolean
  assignRoles: (userId: string, roleNames: string[]) => Promise<Array<{
    roleName: string
    success: boolean
    error?: string
  }>>
  removeRoles: (userId: string, roleNames: string[]) => Promise<{ error?: any }>
}