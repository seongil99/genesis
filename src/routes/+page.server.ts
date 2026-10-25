import { fail, redirect } from '@sveltejs/kit';
import { base, resolve } from '$app/paths';
import { createBirthdaySession, isBirthdaySession } from '$lib/server/auth';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = ({ cookies }) => {
	if (isBirthdaySession(cookies.get('birthday_session'))) {
		redirect(303, resolve('/birthday'));
	}
};

export const actions = {
	default: async ({ cookies, request }) => {
		const data = await request.formData();
		const password = data.get('password');
		const session = typeof password === 'string' ? createBirthdaySession(password) : null;

		if (!session) {
			return fail(400, { incorrect: true });
		}

		cookies.set('birthday_session', session, {
			// Scoped to the base path so it isn't sent to the rest of the host.
			path: base || '/',
			httpOnly: true,
			sameSite: 'lax',
			secure: process.env.NODE_ENV === 'production',
			maxAge: 60 * 60 * 12
		});

		redirect(303, resolve('/birthday'));
	}
} satisfies Actions;
