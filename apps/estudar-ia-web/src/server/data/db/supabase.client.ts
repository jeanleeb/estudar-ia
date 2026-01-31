import type { Database } from '@estuda-ai/domain';
import { createClient } from '@supabase/supabase-js';
import { env } from '@/env';

export const supabase = createClient<Database>(
	env.SUPABASE_URL,
	env.SUPABASE_API_KEY,
);
