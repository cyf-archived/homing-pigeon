import httpStatus from "http-status";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { userId } from "@/constants";

// https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const { image, text, color } = await request.json();

    if (!id || !image) {
      return NextResponse.json(
        {
          code: httpStatus.BAD_REQUEST,
          msg: "Bad request",
          timestamp: Date.now(),
        },
        { status: httpStatus.BAD_REQUEST },
      );
    }

    const emoji = await prisma.emoji.update({
      data: {
        image,
        text,
        color,
        update_by: userId,
        update_date: new Date(),
      },
      where: {
        id,
        is_del: "NO",
      },
    });

    if (!emoji) {
      return NextResponse.json(
        { code: httpStatus.NOT_FOUND, msg: "Not Found", timestamp: Date.now() },
        { status: httpStatus.NOT_FOUND },
      );
    }

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
