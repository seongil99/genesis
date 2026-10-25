import { redirect } from '@sveltejs/kit';
import { base, resolve } from '$app/paths';
import { isBirthdaySession } from '$lib/server/auth';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = ({ cookies }) => {
	if (!isBirthdaySession(cookies.get('birthday_session'))) {
		redirect(303, resolve('/'));
	}
};

export const actions = {
	logout: ({ cookies }) => {
		cookies.delete('birthday_session', { path: base || '/' });
		redirect(303, resolve('/'));
	}
} satisfies Actions;
