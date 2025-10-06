import LeetCodePage from "@/components/LeetSync";
import { Button } from "@/components/ui/button";
import { SignInButton, SignedIn, SignedOut, useUser } from "@clerk/nextjs";

export default function Home() {
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