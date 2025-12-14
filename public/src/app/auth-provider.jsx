'use client';

import { AuthProvider } from '@/context/AuthContext';

export default function AuthContextProvider({ children }) {
  return <AuthProvider>{children}</AuthProvider>;
}