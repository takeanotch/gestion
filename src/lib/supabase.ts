// lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ugzxfmfclutwnnbvbkqp.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVnenhmbWZjbHV0d25uYnZia3FwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU2MzQ4MjUsImV4cCI6MjA4MTIxMDgyNX0.KXEraCRRe2vKZMerRFbElkyNRqiVV0hONzRDApLgBzc';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);