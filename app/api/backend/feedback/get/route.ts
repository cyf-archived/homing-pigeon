import httpStatus from "http-status";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json(
        {
          code: httpStatus.BAD_REQUEST,
          msg: "Bad request",
          timestamp: Date.now(),
        },
        { status: httpStatus.BAD_REQUEST },
      );
    }

    const feedback = await prisma.feedback.findUnique({
      select: {
        id: true,
        title: true,
        description: true,
        files: {
          select: {
            id: true,
            feedback_id: true,
            url: true,
            type: true,
            size: true,
            title: true,
          },
          where: {
            is_del: "NO",
          },
        },
        create_by: true,
        create_date: true,
        update_by: true,
        update_date: true,
      },
      where: {
        id,
        is_del: "NO",
      },
    });

    if (!feedback) {
      return NextResponse.json(
        { code: httpStatus.NOT_FOUND, msg: "Not Found", timestamp: Date.now() },
        { status: httpStatus.NOT_FOUND },
      );
    }

    return NextResponse.json(
      { code: 0, data: feedback, timestamp: Date.now() },
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
