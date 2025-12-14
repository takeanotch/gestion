// types/supabase.ts

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          created_at: string
          updated_at: string | null
          full_name: string | null
          role: "gestionnaire" | "verificateur" | "entreprise" | "user" | "cnss_agent" | "dgm_agent" | "itravail_agent" | "generali_agent"
          email: string | null
        }
        Insert: {
          id: string
          created_at?: string
          updated_at?: string | null
          full_name?: string | null
          role: "gestionnaire" | "verificateur" | "entreprise" | "user" | "cnss_agent" | "dgm_agent" | "itravail_agent" | "generali_agent"
          email?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string | null
          full_name?: string | null
          role?: "gestionnaire" | "verificateur" | "entreprise" | "user" | "cnss_agent" | "dgm_agent" | "itravail_agent" | "generali_agent"
          email?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      // Ajoutez d'autres tables ici si nécessaire
    }
    Views: {
      // Ajoutez vos vues ici
    }
    Functions: {
      // Ajoutez vos fonctions ici
    }
    Enums: {
      // Ajoutez vos enums ici
    }
    CompositeTypes: {
      // Ajoutez vos types composites ici
    }
  }
}

// Types utilitaires
export type Profiles = Database["public"]["Tables"]["profiles"]["Row"]
export type ProfileRole = Database["public"]["Tables"]["profiles"]["Row"]["role"]