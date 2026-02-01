import type { Database } from '@estuda-ai/domain';
import { createClient } from '@supabase/supabase-js';
import { createServerOnlyFn } from '@tanstack/react-start';
import { env } from '@/env';

export const supabaseClient = createServerOnlyFn(() =>
	createClient<Database>(env.SUPABASE_URL, env.SUPABASE_API_KEY),
);
