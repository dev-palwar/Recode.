"use client";

import LeetCodePage from "@/components/LeetSync";
import { Button } from "@/components/ui/button";
import {
  SignIn,
  SignInButton,
  SignedIn,
  SignedOut,
  useUser,
} from "@clerk/nextjs";
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
            <Button variant={"ghost"}>Sign in</Button>
          </div>
        </SignInButton>
      </SignedOut>
      <SignedIn>
        <LeetCodePage />
      </SignedIn>
    </div>
  );
}
