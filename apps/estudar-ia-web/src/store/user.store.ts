import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '@/model/auth.model';

const USER_STORE_KEY = 'user-store';

type UserStoreState = {
	user: User | null;
};

type UserStoreActions = {
	setUser: (user: User | null) => void;
};

export const useUserStore = create<UserStoreState & UserStoreActions>()(
	persist(
		set => ({
			user: null,
			setUser: (user: User | null) => set({ user }),
		}),
		{
			name: USER_STORE_KEY,
		},
	),
);
