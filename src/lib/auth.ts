// lib/auth.ts
'use server';

import { cookies } from 'next/headers';
import { supabase } from './supabase';
import { Account, User } from '@/types';

export async function login(username: string, password: string): Promise<{ success: boolean; user?: User; error?: string }> {
  try {
    // Récupérer l'utilisateur depuis Supabase
    const { data: accounts, error } = await supabase
      .from('accounts')
      .select('*')
      .eq('username', username)
      .eq('password', password);

    if (error || !accounts || accounts.length === 0) {
      return { success: false, error: 'Identifiants invalides' };
    }

    const user = accounts[0] as Account;
    
    // Créer la session
    const sessionData = {
      id: user.id,
      username: user.username,
      role: user.role,
    };

    // Stocker la session dans un cookie
    const cookieStore = cookies();
    cookieStore.set('session', JSON.stringify(sessionData), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60, // 24 heures
      path: '/',
    });

    return { 
      success: true, 
      user: { 
        id: user.id, 
        username: user.username, 
        role: user.role 
      } 
    };
  } catch (error) {
    console.error('Erreur de connexion:', error);
    return { success: false, error: 'Erreur serveur' };
  }
}

export async function logout(): Promise<void> {
  const cookieStore = cookies();
  cookieStore.delete('session');
}

export async function getSession(): Promise<User | null> {
  try {
    const cookieStore = cookies();
    const sessionCookie = cookieStore.get('session');
    
    if (!sessionCookie || !sessionCookie.value) {
      return null;
    }

    return JSON.parse(sessionCookie.value) as User;
  } catch (error) {
    console.error('Erreur de session:', error);
    return null;
  }
}