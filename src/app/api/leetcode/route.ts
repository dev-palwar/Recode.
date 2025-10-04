import { NextRequest, NextResponse } from "next/server";

// In-memory storage (use database in production)
let leetcodeData: LeetCodeData | null = null;

// CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

// Handle OPTIONS request for CORS preflight
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

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
}

interface LeetCodeData {
  totalSolved: number;
  lastFetched: string;
  problems: Problem[];
}

// POST - Receive data from extension
export async function POST(request: NextRequest) {
  try {
    const data: LeetCodeData = await request.json();

    // Validate data
    if (!data.totalSolved || !data.problems || !Array.isArray(data.problems)) {
      return NextResponse.json(
        { error: "Invalid data format" },
        { status: 400 }
      );
    }

    // Store data (in production, save to database)
    leetcodeData = data;

    console.log(`Received ${data.totalSolved} solved problems from extension`);

    return NextResponse.json({
      success: true,
      message: `Successfully received ${data.totalSolved} problems`,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error processing LeetCode data:", error);
    return NextResponse.json(
      { error: "Failed to process data" },
      { status: 500 }
    );
  }
}

// GET - Send data to client
export async function GET(request: NextRequest) {
  try {
    if (!leetcodeData) {
      return NextResponse.json(
        {
          error:
            "No data available. Please import data from the extension first.",
        },
        { status: 404 }
      );
    }

    // Optional: Filter by difficulty
    const searchParams = request.nextUrl.searchParams;
    const difficulty = searchParams.get("difficulty");

    let filteredProblems = leetcodeData.problems;

    if (difficulty) {
      filteredProblems = leetcodeData.problems.filter(
        (p) => p.difficulty.toLowerCase() === difficulty.toLowerCase()
      );
    }

    return NextResponse.json({
      totalSolved: leetcodeData.totalSolved,
      lastFetched: leetcodeData.lastFetched,
      filtered: difficulty ? filteredProblems.length : leetcodeData.totalSolved,
      problems: filteredProblems,
    });
  } catch (error) {
    console.error("Error fetching LeetCode data:", error);
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 }
    );
  }
}
