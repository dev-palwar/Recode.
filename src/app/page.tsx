import LeetCodePage from "@/components/LeetSync";
import { Button } from "@/components/ui/button";
import { SignInButton, SignedIn, SignedOut } from "@clerk/nextjs";
import { GithubIcon } from "lucide-react";

export default function Home() {
  return (
    <div
      className={`relative h-screen w-screen bg-[url('https://i.pinimg.com/1200x/bd/f4/59/bdf4599242715d396418687aaff8433b.jpg')] bg-cover bg-center`}
    >
      <div className="absolute inset-0 bg-black/65"></div>
      <div className="absolute inset-0 bg-black/30 backdrop-blur-none"></div>
      {/* GitHub Icon */}
      <a
        target="_blank"
        href="https://github.com/dev-palwar/Recode."
        className="absolute top-4 right-4 z-10"
      >
        <GithubIcon className="w-6 h-6" />
      </a>

      {/* Signed Out View */}
      <SignedOut>
        <div className="h-full w-full flex flex-col justify-center items-center text-center px-4 absolute">
          <div className="absolute bottom-20">
            <p className="mb-2 uppercase px-2 bg-amber-100 text-black">
              Install{" "}
              <span className="text-purple-950 underline">
                <a
                  target="_blank"
                  className="decoration-none"
                  href="https://github.com/dev-palwar/recode-leetcode-extension"
                >
                  Extension
                </a>
              </span>{" "}
              first if you haven't already.
            </p>
            <p className="mb-4 uppercase">
              Read the readme on GitHub for more info.
            </p>

            <SignInButton mode="redirect">
              <Button variant="outline" className="uppercase w-full max-w-xs">
                Sign in
              </Button>
            </SignInButton>
          </div>
        </div>
      </SignedOut>

      {/* Signed In View */}
      <SignedIn>
        <div className="absolute inset-0">
          <LeetCodePage />
        </div>
      </SignedIn>
    </div>
  );
}
