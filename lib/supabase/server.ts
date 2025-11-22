import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { Database } from '@/types/database';

export const createClient = async () => {
  return createServerComponentClient<Database>({ cookies: async () => await cookies() });
};
