import httpStatus from "http-status";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const currentDate = new Date();
    const carousels = await prisma.carousel.findMany({
      select: {
        id: true,
        image: true,
        order: true,
        href: true,
        start_date: true,
        end_date: true,
        create_by: true,
        create_date: true,
        update_by: true,
        update_date: true,
      },
      where: {
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
      },
      orderBy: [
        {
          order: "desc",
        },
      ],
    });
    return NextResponse.json(
      { code: 0, data: carousels, timestamp: Date.now() },
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
