"use client";

import { useEffect, useRef } from "react";
import { supabaseBrowser } from "@/lib/supabase";
import { syncSavesWithCloud } from "@/lib/saved";

/** Invisible: merges local saves with the cloud whenever a session appears. */
export default function AuthSync() {
  const synced = useRef(false);

  useEffect(() => {
    const sb = supabaseBrowser();

    sb.auth.getSession().then(({ data: { session } }) => {
      if (session && !synced.current) {
        synced.current = true;
        syncSavesWithCloud(session.user.id);
      }
    });

    const {
      data: { subscription },
    } = sb.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session && !synced.current) {
        synced.current = true;
        syncSavesWithCloud(session.user.id);
      }
      if (event === "SIGNED_OUT") {
        synced.current = false;
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return null;
}
