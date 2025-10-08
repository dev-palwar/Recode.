import { LeetCodeData } from "@/types";
import { currentUser } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = (globalThis as any).prisma || new PrismaClient();
if (process.env.NODE_ENV !== "production") (globalThis as any).prisma = prisma;

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
  if (!user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers });
  } 
  
  try {
    const data: LeetCodeData = await request.json();

    console.log("data ", data);

  if (typeof data.totalSolved !== "number" || !Array.isArray(data.problems)) {
      return NextResponse.json(
        { error: "Invalid data format" },
        { status: 400, headers }
      );
    }

    // Fetches existing user data (if any)
    const existingUser = await prisma.user.findUnique({
      where: { clerkId: user.id },
      select: { problems: true },
    });

    // Existing problems from DB
    const existingProblems = (existingUser?.problems ?? []) as Problem[];

    // Merge logic — keeps higher revisionCount and updated info

    const existingById = new Map<number, Problem>();
    for (const p of existingProblems) existingById.set(p.id, p);
    
    const seen = new Set<number>();
    
    const mergedProblems = data.problems.map((newProb) => {
      const oldProb = existingById.get(newProb.id);
      seen.add(newProb.id);

      const oldRev = oldProb?.revisionCount ?? 0;
      const newRev = newProb.revisionCount ?? 0;
      
        return {
          ...(oldProb ?? ({} as Problem)),
          ...newProb,
          revisionCount: Math.max(oldRev, newRev),
        }
    })

    // Also includes any old problems not present in the new data
    for (const old of existingProblems) {
      if (!seen.has(old.id)) {
      mergedProblems.push({
      ...old,
      revisionCount: old.revisionCount ?? 0,
      });
   }
}

    await prisma.user.upsert({
      where: { clerkId: user.id },
      update: {
        lastFetched: data.lastFetched,
        totalSolved: data.totalSolved,
        filtered: data.filtered ?? undefined,
        problems: mergedProblems,
      },
      create: {
        clerkId: user.id as string,
        email: user.primaryEmailAddress?.emailAddress ?? null,
        name: user?.fullName ?? null,
        image: user?.imageUrl ?? null,
        lastFetched: data.lastFetched,
        totalSolved: data.totalSolved,
        filtered: data.filtered ?? undefined,
        problems: mergedProblems,
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
    console.log("Error saving data:", error);
    return NextResponse.json(
      { error: "Failed to process data" },
      { status: 500, headers }
    );
  }
}
