import httpStatus from "http-status";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const { image, order, href, start_date, end_date, create_by, update_by } =
      await request.json();
    if (
      !image ||
      !order ||
      !Number.isInteger(order) ||
      !create_by ||
      !update_by
    ) {
      return NextResponse.json(
        {
          code: httpStatus.BAD_REQUEST,
          error: "Bad request",
          timestamp: Date.now(),
        },
        { status: httpStatus.BAD_REQUEST },
      );
    }

    const currentDate = new Date();
    const carousel = await prisma.carousel.create({
      data: {
        image,
        order,
        href,
        start_date,
        end_date,
        create_by,
        create_date: currentDate,
        update_by,
        update_date: currentDate,
      },
    });
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
