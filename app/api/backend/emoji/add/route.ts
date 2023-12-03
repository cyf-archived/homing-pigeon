import httpStatus from "http-status";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { userId } from "@/constants";

// https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const { image, text, color } = await request.json();
    if (!image) {
      return NextResponse.json(
        {
          code: httpStatus.BAD_REQUEST,
          msg: "Bad request",
          timestamp: Date.now(),
        },
        { status: httpStatus.BAD_REQUEST },
      );
    }

    const emoji = await prisma.emoji.create({
      data: {
        image,
        text,
        color,
        create_by: userId,
        update_by: userId,
      },
    });
    return NextResponse.json(
      { code: 0, data: emoji, timestamp: Date.now() },
      { status: httpStatus.OK },
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        code: httpStatus.INTERNAL_SERVER_ERROR,
        msg: error.message || error.toString(),
        timestamp: Date.now(),
      },
      { status: httpStatus.INTERNAL_SERVER_ERROR },
    );
  }
}
