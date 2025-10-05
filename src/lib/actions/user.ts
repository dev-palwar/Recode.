"use server";

import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function syncUser() {
  const user = await currentUser();

  if (!user) {
    return { success: false, error: "No user found" };
  }

  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { clerkId: user.id },
    });

    // Only create if user doesn't exist
    if (!existingUser) {
      const email = user.emailAddresses[0]?.emailAddress;
      const name =
        `${user.firstName || ""} ${user.lastName || ""}`.trim() || null;

      const dbUser = await prisma.user.create({
        data: {
          clerkId: user.id,
          email,
          name,
          image: user.imageUrl,
        },
      });

      return { success: true, user: dbUser, created: true };
    }

    return { success: true, user: existingUser, created: false };
  } catch (error) {
    console.error("Error syncing user:", error);
    return { success: false, error: "Failed to sync user" };
  }
}
