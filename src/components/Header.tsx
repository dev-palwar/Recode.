"use client";

import { SignedIn, UserButton, useUser } from "@clerk/nextjs";
import React, { useState } from "react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "./ui/button";
import { storage } from "@/lib/storage";
import { Prisma, User } from "@prisma/client";
import { toast } from "sonner";
import { Spinner } from "./ui/spinner";

type Props = {};

function Header({}: Props) {
  const [loading, setLoading] = useState(false);
  const { user } = useUser();

  if (!user) {
    return;
  }

  const handleSaveProgress = async () => {
    setLoading(true);
    const savedData = storage.get();

    console.log(savedData?.problems);

    const payload: Prisma.UserCreateInput = {
      clerkId: user.id,
      name: user.fullName,
      email: user.primaryEmailAddress?.emailAddress as string,
      image: user.imageUrl,
      problems: savedData?.problems ?? [],
    };

    if (savedData && user) {
      try {
        const res = await fetch("/api/save-progress", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const updated = await res.json();
        toast("Progress saved 👍 ");
        setLoading(false);
        console.log("Progress saved:", updated);
      } catch (error) {
        console.error("Error:", error);
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
    </header>
  );
}

export default Header;
