/**
 * Admin authentication utilities
 */

import { cookies } from 'next/headers';

const ADMIN_SESSION_COOKIE = 'admin_session';
const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours

/**
 * Verify admin password
 */
export function verifyAdminPassword(password: string): boolean {
  const adminPassword = process.env.ADMIN_PASSWORD;
  
  if (!adminPassword) {
    throw new Error('Admin password not configured');
  }

  return password === adminPassword;
}

/**
 * Create admin session
 */
export async function createAdminSession(): Promise<void> {
  const cookieStore = await cookies();
  const sessionToken = Buffer.from(
    JSON.stringify({
      authenticated: true,
      timestamp: Date.now(),
    })
  ).toString('base64');

  cookieStore.set(ADMIN_SESSION_COOKIE, sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: SESSION_DURATION / 1000, // Convert to seconds
    path: '/',
  });
}

/**
 * Verify admin session
 */
export async function verifyAdminSession(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get(ADMIN_SESSION_COOKIE);

    if (!sessionToken) {
      return false;
    }

    const session = JSON.parse(
      Buffer.from(sessionToken.value, 'base64').toString('utf-8')
    );

    // Check if session is still valid
    const now = Date.now();
    const sessionAge = now - session.timestamp;

    if (sessionAge > SESSION_DURATION) {
      await clearAdminSession();
      return false;
    }

    return session.authenticated === true;
  } catch (error) {
    return false;
  }
}

/**
 * Clear admin session
 */
export async function clearAdminSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_SESSION_COOKIE);
}


