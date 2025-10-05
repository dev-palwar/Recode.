import { currentUser } from "@clerk/nextjs/server";
import { UserButton } from "@clerk/nextjs";
import { prisma } from "@/lib/prisma";
import { syncUser } from "@/lib/actions/user";
import LeetCodePage from "@/components/LeetSync";

export default async function DashboardPage() {
  const user = await currentUser();

  if (!user) {
    return null;
  }

  // Sync user to MongoDB (creates or updates)
  await syncUser();

  // Fetch user from MongoDB
  const dbUser = await prisma.user.findUnique({
    where: { clerkId: user.id },
  });

  return (
    <div>
      <LeetCodePage />
    </div>
  );
}
