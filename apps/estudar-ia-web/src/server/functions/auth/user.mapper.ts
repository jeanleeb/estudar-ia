import type { Tables } from '@estuda-ai/domain';
import type { User as SupabaseUser } from '@supabase/supabase-js';
import type { User } from '@/model/auth.model';

type AuthUserMetadata = Partial<
	Pick<Tables<'profiles'>, 'first_name' | 'last_name'>
>;

export function buildAuthUserMetadata(name: string): AuthUserMetadata {
	const trimmedName = name.trim();
	if (!trimmedName) {
		return {};
	}

	const [firstName, ...rest] = trimmedName.split(/\s+/);
	const lastName = rest.join(' ');

	return {
		first_name: firstName || undefined,
		last_name: lastName || undefined,
	};
}

export function mapAuthUserToSessionUser(user: SupabaseUser): User {
	const metadata = (user.user_metadata ?? {}) as AuthUserMetadata;

	return {
		id: user.id,
		email: user.email ?? undefined,
		firstName: metadata.first_name ?? undefined,
		lastName: metadata.last_name ?? undefined,
	};
}
