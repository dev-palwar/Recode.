import { LeetCodeData } from "@/types";
import { currentUser } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = globalThis.prisma || new PrismaClient();
if (process.env.NODE_ENV !== "production") globalThis.prisma = prisma;

interface Problem {
  id: number;
  title: string;
  titleSlug: string;
  difficulty: string;
  difficultyLevel: number;
  acceptanceRate: number;
  totalAccepted: number;
  totalSubmissions: number;
  isPaidOnly: boolean;
  revisionCount?: number;
}

// Handle OPTIONS request for CORS preflight
export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}

export async function POST(request: Request) {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };

  const user = await currentUser();

  try {
    const data: LeetCodeData = await request.json();

    console.log("data ", data);

    if (!data.totalSolved || !data.problems || !Array.isArray(data.problems)) {
      return NextResponse.json(
        { error: "Invalid data format" },
        { status: 400, headers }
      );
    }

    // Fetches existing user data (if any)
    const existingUser = await prisma.user.findUnique({
      where: { clerkId: user?.id },
      select: { problems: true },
    });

    // Existing problems from DB
    const existingProblems = existingUser?.problems ?? [];

    // Merge logic — keeps higher revisionCount and updated info
    const mergedProblems = data.problems.map((newProb) => {
      const oldProb = existingProblems.find((p) => p.id === newProb.id);
      if (oldProb) {
        return {
          ...oldProb,
          ...newProb,
          revisionCount: Math.max(
            oldProb.revisionCount ?? 0,
            newProb.revisionCount ?? 0
          ),
        };
      }
      return { ...newProb, revisionCount: newProb.revisionCount ?? 0 };
    });

    // Also includes any old problems not present in the new data
    const allProblems = [
      ...mergedProblems,
      ...existingProblems.filter(
        (old) => !data.problems.some((np) => np.id === old.id)
      ),
    ];

    await prisma.user.upsert({
      where: { clerkId: user?.id },
      update: {
        lastFetched: data.lastFetched,
        totalSolved: data.totalSolved,
        filtered: data.filtered ?? undefined,
        problems: allProblems,
      },
      create: {
        clerkId: user?.id as string,
        email: user?.primaryEmailAddress?.emailAddress as string,
        name: user?.fullName ?? null,
        image: user?.imageUrl ?? null,
        lastFetched: data.lastFetched,
        totalSolved: data.totalSolved,
        filtered: data.filtered ?? undefined,
        problems: allProblems,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: `Merged ${data.problems.length} problems successfully.`,
        timestamp: new Date().toISOString(),
      },
      { headers }
    );
  } catch (error) {
    console.log("Error saving data:");
    return NextResponse.json(
      { error: "Failed to process data" },
      { status: 500, headers }
    );
  }
}
