import { redirect } from '@sveltejs/kit';
import { isBirthdaySession } from '$lib/server/auth';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = ({ cookies }) => {
	if (!isBirthdaySession(cookies.get('birthday_session'))) {
		redirect(303, '/');
	}
};

export const actions = {
	logout: ({ cookies }) => {
		cookies.delete('birthday_session', { path: '/' });
		redirect(303, '/');
	}
} satisfies Actions;
