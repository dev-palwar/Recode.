import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const data = await req.json();

    const user = await prisma.user.upsert({
      where: { clerkId: data.clerkId },
      update: {
        name: data.name,
        image: data.image,
        email: data.email,
        problems: data.problems,
      },
      create: {
        clerkId: data.clerkId,
        email: data.email,
        name: data.name,
        image: data.image,
        problems: data.problems,
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error("Error saving progress:", error);
    return NextResponse.json(
      { error: "Failed to save progress" },
      { status: 500 }
    );
  }
}
