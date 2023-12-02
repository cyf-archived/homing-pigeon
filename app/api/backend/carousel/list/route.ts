import httpStatus from "http-status";
import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import prisma from "@/lib/prisma";

// https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const currentDate = new Date();
    const where: Prisma.CarouselWhereInput = {
      OR: [
        {
          start_date: null,
          end_date: null,
        },
        {
          start_date: { not: null, gte: currentDate },
          end_date: { not: null, lte: currentDate },
        },
        {
          start_date: null,
          end_date: { not: null, lte: currentDate },
        },
        {
          start_date: { not: null, gte: currentDate },
          end_date: null,
        },
      ],
      AND: [
        {
          is_del: "NO",
        },
      ],
    };
    const carousels = await prisma.carousel.findMany({
      select: {
        id: true,
        image: true,
        order: true,
        text: true,
        href: true,
        start_date: true,
        end_date: true,
        create_by: true,
        create_date: true,
        update_by: true,
        update_date: true,
      },
      where,
      orderBy: [
        {
          order: "desc",
        },
      ],
    });
    return NextResponse.json(
      {
        code: 0,
        data: carousels,
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
