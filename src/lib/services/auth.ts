import { createClient } from "@/lib/supabase";
import type { User, ProfileRow } from "@/lib/database.types";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function profileToUser(profile: ProfileRow): User {
  return {
    id: profile.id,
    name: profile.name,
    email: profile.email,
    role: profile.role,
    company: profile.company ?? undefined,
    avatar: profile.avatar_url ?? undefined,
  };
}

// ─── Auth operations ──────────────────────────────────────────────────────────

/**
 * Sign in with email and password.
 * Returns the user profile on success, null on failure.
 */
export async function signIn(
  email: string,
  password: string
): Promise<User | null> {
  const supabase = createClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !data.user) return null;

  // Fetch the profile to get role and name
  const profile = await getProfile(data.user.id);
  return profile;
}

/**
 * Sign out the current user.
 */
export async function signOut(): Promise<void> {
  const supabase = createClient();
  await supabase.auth.signOut();
}

/**
 * Get the current session's user profile.
 * Returns null if not authenticated.
 */
export async function getCurrentUser(): Promise<User | null> {
  const supabase = createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.user) return null;

  return getProfile(session.user.id);
}

/**
 * Fetch a user's profile from the profiles table.
 */
export async function getProfile(userId: string): Promise<User | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error || !data) return null;

  return profileToUser(data as ProfileRow);
}

/**
 * Subscribe to auth state changes.
 * Returns an unsubscribe function.
 */
export function onAuthStateChange(
  callback: (user: User | null) => void
): () => void {
  const supabase = createClient();
  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange(async (event, session) => {
    if (session?.user) {
      const profile = await getProfile(session.user.id);
      callback(profile);
    } else {
      callback(null);
    }
  });

  return () => subscription.unsubscribe();
}
