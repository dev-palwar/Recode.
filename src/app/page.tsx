"use client";

import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { supabase } from "../../lib/supabaseClient";
import LeetCodeSync from "@/components/LeetSync";

export default function Home() {
  const { user, isSignedIn } = useUser();

  useEffect(() => {
    const saveUser = async () => {
      if (!user) return;

      const email = user.emailAddresses[0]?.emailAddress;
      const { data, error } = await supabase.from("users").upsert(
        {
          clerk_id: user.id,
          email,
          name: `${user.firstName} ${user.lastName}`,
        },
        { onConflict: "clerk_id" }
      );

      if (error) console.error("Supabase error:", error);
      else console.log("User saved:", data);
    };

    saveUser();
  }, [user]);

  return (
    <div className="">
      {isSignedIn && user ? (
        <>
          <LeetCodeSync />
        </>
      ) : (
        <p className="text-lg">Please sign in to continue.</p>
      )}
    </div>
  );
}
