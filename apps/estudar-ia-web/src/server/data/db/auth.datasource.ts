import type {
	SignInWithPasswordCredentials,
	SignUpWithPasswordCredentials,
} from '@supabase/supabase-js';
import { supabaseClient } from './supabase.client';

export const AuthDbDataSource = {
	async login(credentials: SignInWithPasswordCredentials) {
		const { data, error } =
			await supabaseClient().auth.signInWithPassword(credentials);

		if (error) throw error;

		return data;
	},

	async logout() {
		const { error } = await supabaseClient().auth.signOut();

		if (error) throw error;
	},

	async signUp(credentials: SignUpWithPasswordCredentials) {
		const { data, error } = await supabaseClient().auth.signUp(credentials);

		if (error) throw error;

		return data;
	},
};
