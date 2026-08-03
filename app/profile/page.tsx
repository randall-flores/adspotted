"use client";

import { useEffect, useMemo, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabaseBrowser, type Ad } from "@/lib/supabase";
import { getSavedIds, onSavedChange } from "@/lib/saved";

export default function ProfilePage() {
  const [session, setSession] = useState<Session | null | undefined>(undefined);
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [sentTo, setSentTo] = useState<string | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [savedAds, setSavedAds] = useState<Ad[]>([]);

  useEffect(() => {
    const sb = supabaseBrowser();
    sb.auth.getSession().then(({ data }) => setSession(data.session));
    const {
      data: { subscription },
    } = sb.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    setSavedIds(getSavedIds());
    return onSavedChange(() => setSavedIds(getSavedIds()));
  }, []);

  useEffect(() => {
    let cancelled = false;
    if (savedIds.length === 0) {
      setSavedAds([]);
      return;
    }
    supabaseBrowser()
      .from("ads")
      .select("*")
      .in("id", savedIds)
      .then(({ data }) => {
        if (!cancelled && data) setSavedAds(data as Ad[]);
      });
    return () => {
      cancelled = true;
    };
  }, [savedIds]);

  const topCategory = useMemo(() => {
    if (savedAds.length === 0) return null;
    const counts = new Map<string, number>();
    for (const ad of savedAds) {
      counts.set(ad.category, (counts.get(ad.category) ?? 0) + 1);
    }
    return [...counts.entries()].sort((a, b) => b[1] - a[1])[0][0];
  }, [savedAds]);

  async function sendLink(e: React.FormEvent) {
    e.preventDefault();
    const target = email.trim();
    if (!target) return;
    setSending(true);
    setAuthError(null);
    const { error } = await supabaseBrowser().auth.signInWithOtp({
      email: target,
      options: { emailRedirectTo: `${window.location.origin}/profile` },
    });
    setSending(false);
    if (error) setAuthError(error.message);
    else setSentTo(target);
  }

  async function signOut() {
    await supabaseBrowser().auth.signOut();
  }

  return (
    <main className="mx-auto max-w-2xl px-5 py-4">
      <h1 className="font-display font-black text-[20px] mb-4">Profile</h1>

      {session === undefined && (
        <p className="text-sm text-[var(--gray)]">Loading…</p>
      )}

      {/* Signed out */}
      {session === null && (
        <div className="profile-card">
          <h2 className="font-display font-bold text-[16px]">
            Keep your saves everywhere
          </h2>
          <p className="text-sm text-[var(--gray)] mt-1.5 leading-relaxed">
            Sign in and everything you save syncs across your devices. No
            password — we email you a sign-in link.
          </p>
          {sentTo ? (
            <div className="mt-5">
              <p className="text-sm font-bold text-[var(--accent)]">
                Link sent to {sentTo}.
              </p>
              <p className="text-sm text-[var(--gray)] mt-1">
                Open it on this device and you&apos;re in. Wrong address?{" "}
                <button
                  type="button"
                  className="font-bold text-[var(--accent)]"
                  onClick={() => setSentTo(null)}
                >
                  Try again
                </button>
              </p>
            </div>
          ) : (
            <form onSubmit={sendLink} className="mt-5 flex gap-2.5 flex-col sm:flex-row">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="search-input !h-[46px] !px-4 flex-1"
                aria-label="Email address"
                autoComplete="email"
              />
              <button type="submit" className="cta-btn" disabled={sending}>
                {sending ? "Sending…" : "Send sign-in link"}
              </button>
            </form>
          )}
          {authError && (
            <p className="text-sm text-red-600 mt-3">
              Could not send the link: {authError}
            </p>
          )}
        </div>
      )}

      {/* Signed in */}
      {session && (
        <>
          <div className="profile-card">
            <div className="flex items-center gap-3.5">
              <span className="avatar">
                {(session.user.email ?? "?").slice(0, 1).toUpperCase()}
              </span>
              <div className="min-w-0">
                <p className="font-bold text-[15px] truncate">{session.user.email}</p>
                <p className="text-xs text-[var(--gray)] mt-0.5">
                  Member since{" "}
                  {new Date(session.user.created_at).toLocaleDateString("en-US", {
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-3">
            <div className="profile-card !mt-0">
              <p className="stat-num">{savedIds.length}</p>
              <p className="stat-label">saved finds</p>
            </div>
            <div className="profile-card !mt-0">
              <p className="stat-num">{topCategory ?? "—"}</p>
              <p className="stat-label">your taste</p>
            </div>
          </div>

          <button type="button" onClick={signOut} className="signout-btn mt-6">
            Sign out
          </button>
          <p className="text-xs text-[var(--gray)] mt-2">
            Your saves stay on this device after you sign out.
          </p>
        </>
      )}
    </main>
  );
}
