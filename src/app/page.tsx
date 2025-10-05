"use client";

import LeetCodePage from "@/components/LeetSync";
import { SignInButton, SignedIn, SignedOut, useUser } from "@clerk/nextjs";
import { useEffect } from "react";

export default function Home() {
  const { user, isSignedIn } = useUser();

  useEffect(() => {
    // When user signs out, Clerk automatically clears its session
    // We don't need to manually track anything
  }, [isSignedIn, user]);

  return (
    <div>
      {" "}
      <SignedOut>
        <SignInButton mode="redirect">
          <div className="h-screen flex justify-center items-center">
            <button className="cursor-pointer w-full py-3 px-4 rounded-lg font-semibold transition duration-200">
              Sign in with Google
            </button>
          </div>
        </SignInButton>
      </SignedOut>
      <SignedIn>
        <LeetCodePage />
      </SignedIn>
    </div>
  );
}
