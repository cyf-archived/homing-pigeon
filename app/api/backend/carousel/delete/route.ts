import httpStatus from "http-status";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const { update_by } = await request.json();
    if (!id || !update_by) {
      return NextResponse.json(
        {
          code: httpStatus.BAD_REQUEST,
          error: "Bad request",
          timestamp: Date.now(),
        },
        { status: httpStatus.BAD_REQUEST },
      );
    }

    const carousel = await prisma.carousel.update({
      data: {
        update_by,
        update_date: new Date(),
        is_del: "YES",
      },
      where: {
        id,
        is_del: "NO",
      },
    });

    if (!carousel) {
      return NextResponse.json(
        { code: httpStatus.NOT_FOUND, timestamp: Date.now() },
        { status: httpStatus.NOT_FOUND },
      );
    }

    return NextResponse.json(
      { code: 0, data: carousel, timestamp: Date.now() },
      { status: httpStatus.OK },
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        code: httpStatus.INTERNAL_SERVER_ERROR,
        error: error.message || error.toString(),
        timestamp: Date.now(),
      },
      { status: httpStatus.INTERNAL_SERVER_ERROR },
    );
  }
}
