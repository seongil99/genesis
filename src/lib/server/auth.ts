import { createHmac, timingSafeEqual } from 'node:crypto';
import { env } from '$env/dynamic/private';

const DEFAULT_PASSWORD = 'makeawish';
const DEFAULT_SECRET = 'birthday-dev-secret-change-before-deploying';

function expectedPassword() {
	return env.BIRTHDAY_PASSWORD || DEFAULT_PASSWORD;
}

function sessionSignature() {
	return createHmac('sha256', env.AUTH_SECRET || DEFAULT_SECRET)
		.update(`birthday:${expectedPassword()}`)
		.digest('hex');
}

function safelyMatches(first: string, second: string) {
	const firstBuffer = Buffer.from(first);
	const secondBuffer = Buffer.from(second);

	return firstBuffer.length === secondBuffer.length && timingSafeEqual(firstBuffer, secondBuffer);
}

export function createBirthdaySession(password: string) {
	if (!safelyMatches(password, expectedPassword())) return null;
	return sessionSignature();
}

export function isBirthdaySession(session: string | undefined) {
	return typeof session === 'string' && safelyMatches(session, sessionSignature());
}
