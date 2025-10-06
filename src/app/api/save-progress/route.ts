import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { data } = await req.json();

    const user = await prisma.user.upsert({
      where: { clerkId: data.clerkId },
      update: {
        clerkId: data.clerkId,
        email: data.email,
        name: data.name,
        image: data.image,
        problems: data.problems,
        filtered: data.filtered,
        lastFetched: data.lastFetched,
        totalSolved: data.totalSolved,
      },
      create: {
        clerkId: data.clerkId,
        email: data.email,
        name: data.name,
        image: data.image,
        problems: data.problems,
        filtered: data.filtered,
        lastFetched: data.lastFetched,
        totalSolved: data.totalSolved,
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to save progress" },
      { status: 500 }
    );
  }
}
