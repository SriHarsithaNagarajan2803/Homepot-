import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://beqxeulqxcfsogppblqz.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJlcXhldWxxeGNmc29ncHBibHF6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc4ODY3NTAsImV4cCI6MjEwMzQ2Mjc1MH0.V6PuIJCl__XqEgYXUyshg9dLLZVDJHLfOYdJhwE0toU';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);