import { supabaseBrowser } from "./supabase";

const KEY = "adrift:saved";
const EVENT = "adrift:saved-change";

export function getSavedIds(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function isSaved(id: string): boolean {
  return getSavedIds().includes(id);
}

/**
 * Toggles an id and returns the new saved state.
 * localStorage is the source of truth for the UI; when a session exists the
 * change is mirrored to the saves table in the background.
 */
export function toggleSaved(id: string): boolean {
  const ids = getSavedIds();
  const has = ids.includes(id);
  const next = has ? ids.filter((x) => x !== id) : [...ids, id];
  window.localStorage.setItem(KEY, JSON.stringify(next));
  window.dispatchEvent(new CustomEvent(EVENT));

  const sb = supabaseBrowser();
  sb.auth.getSession().then(({ data: { session } }) => {
    if (!session) return;
    if (has) {
      sb.from("saves")
        .delete()
        .match({ user_id: session.user.id, ad_id: id })
        .then(() => {});
    } else {
      sb.from("saves")
        .upsert(
          { user_id: session.user.id, ad_id: id },
          { onConflict: "user_id,ad_id", ignoreDuplicates: true }
        )
        .then(() => {});
    }
  });

  return !has;
}

/**
 * After sign-in: push local saves to the cloud, pull the union back down.
 * Local saves made while signed out survive the merge.
 */
export async function syncSavesWithCloud(userId: string): Promise<void> {
  const sb = supabaseBrowser();
  const local = getSavedIds();
  if (local.length > 0) {
    await sb
      .from("saves")
      .upsert(
        local.map((ad_id) => ({ user_id: userId, ad_id })),
        { onConflict: "user_id,ad_id", ignoreDuplicates: true }
      );
  }
  const { data } = await sb
    .from("saves")
    .select("ad_id")
    .order("created_at", { ascending: true });
  if (data) {
    window.localStorage.setItem(
      KEY,
      JSON.stringify(data.map((r) => r.ad_id as string))
    );
    window.dispatchEvent(new CustomEvent(EVENT));
  }
}

export function savedCount(): number {
  return getSavedIds().length;
}

/** Subscribe to save changes (this tab and others). Returns unsubscribe. */
export function onSavedChange(fn: () => void): () => void {
  window.addEventListener(EVENT, fn);
  window.addEventListener("storage", fn);
  return () => {
    window.removeEventListener(EVENT, fn);
    window.removeEventListener("storage", fn);
  };
}
