import httpStatus from "http-status";
import { NextResponse } from "next/server";
// import { Prisma } from "@prisma/client";
// import prisma from "@/lib/prisma";

// https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get("date");
    if (!date) {
      return NextResponse.json(
        {
          code: httpStatus.BAD_REQUEST,
          msg: "Bad request",
          timestamp: Date.now(),
        },
        { status: httpStatus.BAD_REQUEST },
      );
    }

    const now = Date.now();
    return NextResponse.json(
      {
        code: 0,
        data: [
          {
            title: "FaFa Runner",
            from: new Date(now),
            to: new Date(now + 2 * 24 * 60 * 60 * 1000),
          },
          {
            title: "Homing pigeon",
            from: new Date(now + 4 * 60 * 60 * 1000),
            to: new Date(now + 4 * 24 * 60 * 60 * 1000),
            background: "0xFFFF5050",
          },
          {
            title: "Cyf Insider",
            from: new Date(now + 8 * 60 * 60 * 1000),
            to: new Date(now + 6 * 24 * 60 * 60 * 1000),
            background: "0xFFFF5050",
          },
        ],
        timestamp: Date.now(),
      },
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
