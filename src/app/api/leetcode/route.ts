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

interface LeetCodeData {
  totalSolved: number;
  lastFetched: string;
  problems: Problem[];
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

// POST - Receive data from extension
export async function POST(request: Request) {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };

  const user = await currentUser();

  try {
    const data: LeetCodeData = await request.json();

    // Validate data
    if (!data.totalSolved || !data.problems || !Array.isArray(data.problems)) {
      return NextResponse.json(
        { error: "Invalid data format" },
        { status: 400, headers }
      );
    }

    await prisma.user.upsert({
      where: { clerkId: user?.id },
      update: {
        lastFetched: data.lastFetched,
        totalSolved: data.totalSolved,
        problems: data.problems,
      },
      create: {
        clerkId: user?.id as string,
        lastFetched: data.lastFetched,
        totalSolved: data.totalSolved,
        problems: data.problems,
        email: user?.primaryEmailAddress?.emailAddress ?? "",
        name: user?.fullName,
        image: user?.imageUrl,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: `Successfully received ${data.totalSolved} problems`,
        timestamp: new Date().toISOString(),
      },
      { headers }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to process data" },
      { status: 500, headers }
    );
  }
}
