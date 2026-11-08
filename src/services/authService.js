
import { supabase } from "./supabaseClient";

// Share one authentication request across concurrent callers.
let pendingAuth = null;

export function getOrCreateGuestSession() {
  if (pendingAuth) {
    return pendingAuth;
  }

  pendingAuth = initializeGuestSession();

  // Clear the pending request when it finishes.
  // The existing Supabase session will be reused next time.
  void pendingAuth.then(
    () => { pendingAuth = null; },
    () => { pendingAuth = null; }
  );

  return pendingAuth;
}

async function initializeGuestSession() {
  const { data: sessionData, error: sessionError } =
    await supabase.auth.getSession();

  if (sessionError) {
    throw sessionError;
  }

  if (sessionData.session?.user) {
    return sessionData.session.user;
  }

  const { data, error } =
    await supabase.auth.signInAnonymously();

  if (error) {
    throw error;
  }

  if (!data.user) {
    throw new Error("Anonymous sign-in returned no user.");
  }

  return data.user;
}
