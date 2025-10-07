"use client";

import { SignedIn, UserButton, useUser } from "@clerk/nextjs";
import React, { useState } from "react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "./ui/button";
import { storage } from "@/lib/storage";
import { Prisma, User } from "@prisma/client";
import { toast } from "sonner";
import { Spinner } from "./ui/spinner";
import { saveUserProgress } from "@/lib/api";
import { GithubIcon } from "lucide-react";

function Header() {
  const [loading, setLoading] = useState(false);
  const { user } = useUser();

  if (!user) {
    return;
  }

  const handleSaveProgress = async () => {
    setLoading(true);
    const savedData = storage.get({ userId: user?.id });

    if (!savedData) {
      toast("There's likely nothing to be saved");
      return;
    }

    const payload: Prisma.UserCreateInput = {
      clerkId: user.id,
      name: user.fullName,
      email: user.primaryEmailAddress?.emailAddress as string,
      image: user.imageUrl,
      problems: savedData?.problems ?? [],
      filtered: savedData?.filtered,
      lastFetched: savedData?.lastFetched,
      totalSolved: savedData?.totalSolved,
    };

    if (savedData && user) {
      try {
        const res = await saveUserProgress(payload);
        if (res) {
          toast("Progress saved 👍 ");
          setLoading(false);
        }
      } catch (error) {
        setLoading(false);
        toast("Some error occurred");
      }
    }
  };

  return (
    <header className="flex justify-end items-center p-4 gap-4 h-16">
      <SignedIn>
        <UserButton />
        <Button variant={"outline"} onClick={handleSaveProgress}>
          {loading ? (
            <>
              <Spinner /> Saving...
            </>
          ) : (
            "Save progress"
          )}
        </Button>
      </SignedIn>
      <ThemeToggle />
      <a
        target="_blank"
        href="https://github.com/dev-palwar/leetcode-solved-problems-tracker"
      >
        <GithubIcon className="w-6 h-6" />
      </a>
    </header>
  );
}

export default Header;
