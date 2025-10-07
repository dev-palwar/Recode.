import LeetCodePage from "@/components/LeetSync";
import { Button } from "@/components/ui/button";
import { SignInButton, SignedIn, SignedOut } from "@clerk/nextjs";
import { GithubIcon } from "lucide-react";

export default function Home() {
  return (
    <div className="relative h-screen w-screen">
      {/* GitHub Icon */}
      <a
        target="_blank"
        href="https://github.com/dev-palwar/leetcode-solved-problems-tracker"
        className="absolute top-4 right-4"
      >
        <GithubIcon className="w-6 h-6" />
      </a>

      {/* Signed Out View */}
      <SignedOut>
        <div className="h-full w-full flex flex-col justify-center items-center text-center px-4">
          <p className="mb-2">
            Install{" "}
            <span className="text-purple-500 underline">
              <a
                target="_blank"
                href="https://github.com/dev-palwar/leetcode-extension"
              >
                Extension
              </a>
            </span>{" "}
            first if you haven't already.
          </p>
          <p className="mb-4">Read the readme on GitHub for more info.</p>

          <SignInButton mode="redirect">
            <Button variant="default" className="w-full max-w-xs">
              Sign in
            </Button>
          </SignInButton>
        </div>
      </SignedOut>

      {/* Signed In View */}
      <SignedIn>
        <LeetCodePage />
      </SignedIn>
    </div>
  );
}
