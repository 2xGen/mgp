/**
 * @deprecated Firebase Auth/Firestore removed.
 * App auth + DB → Supabase (`src/lib/supabase/*`).
 * Google Business Profile APIs still use the mgp-cloud OAuth client (env vars).
 *
 * This stub exists only so leftover imports fail loudly during the rebuild.
 */
export function getDeprecatedFirebase() {
  throw new Error(
    "Firebase Auth/Firestore has been removed. Use Supabase clients in src/lib/supabase/."
  );
}

export const auth = null as never;
export const db = null as never;
export default null as never;
