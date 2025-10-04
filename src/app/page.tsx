"use client";

import { useUser } from "@clerk/nextjs";
import LeetCodeSync from "@/components/LeetSync";

export default function Home() {
  const { user, isSignedIn } = useUser();

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
