import { clerkClient } from '@clerk/clerk-sdk-node';

export { clerkClient };

export async function getClerkUser(userId: string) {
  try {
    return await clerkClient.users.getUser(userId);
  } catch (error) {
    return null;
  }
}

export async function verifyClerkSession(sessionId: string) {
  try {
    return await clerkClient.sessions.getSession(sessionId);
  } catch (error) {
    return null;
  }
}
