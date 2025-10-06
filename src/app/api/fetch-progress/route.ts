import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

const prisma = globalThis.prisma || new PrismaClient();
if (process.env.NODE_ENV !== "production") globalThis.prisma = prisma;

export async function POST(req: Request) {
  try {
    const data = await req.json();

    const userProgress = await prisma.user.findUnique({
      where: { clerkId: data.clerkId },
    });

    return NextResponse.json(userProgress);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch progress" },
      { status: 500 }
    );
  }
}
