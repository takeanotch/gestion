
// 'use client'
// import { createContext, useContext, useEffect, useState } from 'react';
// import { supabase } from '../lib/supabase/supabaseClient';
// import { UserProfile, UserRole } from '../types';

// type AuthContextType = {
//   user: UserProfile | null;
//   role: UserRole | null;
//   loading: boolean;
//   signUp: (email: string, password: string) => Promise<void>;
//   signIn: (email: string, password: string) => Promise<void>;
//   signOut: () => Promise<void>;
// };

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export function AuthProvider({ children }: { children: React.ReactNode }) {
//   const [user, setUser] = useState<UserProfile | null>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchSession = async () => {
//       const { data: { session }, error } = await supabase.auth.getSession();

//       if (error) {
//         console.error('Error fetching session:', error);
//         setLoading(false);
//         return;
//       }

//       if (session?.user) {
//         await fetchUserProfile(session.user.id);
//       } else {
//         setLoading(false);
//       }
//     };

//     const fetchUserProfile = async (userId: string) => {
//       const { data, error } = await supabase
//         .from('profiles')
//         .select('*')
//         .eq('id', userId)
//         .single();

//       if (error) {
//         console.error('Error fetching profile:', error);
//         setLoading(false);
//         return;
//       }

//       setUser(data);
//       setLoading(false);
//     };

//     fetchSession();

//     const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
//       if (event === 'SIGNED_IN' && session?.user) {
//         await fetchUserProfile(session.user.id);
//       } else if (event === 'SIGNED_OUT') {
//         setUser(null);
//         setLoading(false);
//       }
//     });

//     return () => subscription.unsubscribe();
//   }, []);

//   const signUp = async (email: string, password: string) => {
//     setLoading(true);
//     const { error } = await supabase.auth.signUp({ email, password });
//     if (error) throw error;
//     setLoading(false);
//   };

//   const signIn = async (email: string, password: string) => {
//     setLoading(true);
//     const { error } = await supabase.auth.signInWithPassword({ email, password });
//     if (error) throw error;
//     setLoading(false);
//   };

//   const signOut = async () => {
//     setLoading(true);
//     await supabase.auth.signOut();
//     setUser(null);
//     setLoading(false);
//   };

//   const value = {
//     user,
//     role: user?.role || null,
//     loading,
//     signUp,
//     signIn,
//     signOut,
//   };

//   return (
//     <AuthContext.Provider value={value}>
//       {children}
//     </AuthContext.Provider>
//   );
// }

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (context === undefined) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// };

'use client'
import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase/supabaseClient';
import { useRouter } from 'next/navigation';
import { UserProfile, UserRole } from '../types';

type AuthContextType = {
  user: UserProfile | null;
  role: UserRole | null;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchSession = async () => {
      setLoading(true);
      try {
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) throw error;

        if (session?.user) {
          await fetchUserProfile(session.user.id);
        }
      } catch (error) {
        console.error('Error fetching session:', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchUserProfile = async (userId: string) => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();

        if (error) throw error;

        setUser(data);
      } catch (error) {
        console.error('Error fetching profile:', error);
        throw error;
      }
    };

    fetchSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        await fetchUserProfile(session.user.id);
        router.push('/dashboard');
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        router.push('/login');
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  const signUp = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      await supabase.auth.signOut();
      setUser(null);
      router.push('/login');
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    role: user?.role || null,
    loading,
    signUp,
    signIn,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};