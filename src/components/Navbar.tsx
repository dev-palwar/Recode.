"use client";

import Link from "next/link";
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";

import { useUser } from "@clerk/nextjs";

export default function Navbar() {
  const { isLoaded,user, isSignedIn } = useUser();
   if (!isLoaded) {
  return (
    <nav className="flex justify-between items-center px-6 sm:px-12 py-4 bg-black shadow-md">
      {/* Left side - Logo / Brand */}
      <Link href="/" className="text-xl font-semibold text-[#6c47ff]">
        MyApp
      </Link>

      {/* Middle - Nav links */}
      <div className="hidden sm:flex gap-6 text-gray-700 font-medium">
        <Link href="/" className="hover:text-[#6c47ff] transition-colors">
          Home
        </Link>
        <Link href="/about" className="hover:text-[#6c47ff] transition-colors">
          About
        </Link>
      </div>

      {/* Right side - Auth buttons */}
      <div className="flex items-center gap-3">
        <SignedOut>
          <SignInButton>
            <button className="text-sm sm:text-base text-gray-700 hover:text-[#6c47ff] transition-colors">
              Log in
            </button>
          </SignInButton>

          <SignUpButton>
            <button className="bg-[#6c47ff] text-white rounded-full font-medium text-sm sm:text-base h-10 sm:h-11 px-4 sm:px-5 hover:bg-[#5836d9] transition-colors">
              Sign up
            </button>
          </SignUpButton>
        </SignedOut>

        <SignedIn>
          <UserButton afterSignOutUrl="/" />
        </SignedIn>
      </div>
    </nav>
  );
}else
{
  return (
    <nav className="flex justify-between items-center px-6 py-4 bg-black shadow">
      <Link href="/" className="text-xl font-semibold text-[#6c47ff]">MyApp</Link>

      <div className="flex gap-6 text-gray-700 font-medium">
        <Link href="/">Home</Link>
        <Link href="/about">About</Link>
      </div>

      <div className="flex items-center gap-3">
        <SignedOut>
          <SignInButton mode="modal">
            <button className="text-sm hover:text-[#6c47ff]">Login</button>
          </SignInButton>
          <SignUpButton mode="modal">
            <button className="bg-[#6c47ff] text-white rounded-full px-4 py-2 text-sm hover:bg-[#5836d9]">
              Sign Up
            </button>
          </SignUpButton>
        </SignedOut>

        <SignedIn>
          <UserButton afterSignOutUrl="/" />
          <span className="hidden sm:inline text-gray-700">Hi, {user?.firstName}</span>
        </SignedIn>
      </div>
    </nav>
  );
}
}
