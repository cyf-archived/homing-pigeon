import httpStatus from "http-status";
import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import prisma from "@/lib/prisma";

// https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const pageParam = searchParams.get("page") || "1";
    const pageSizeParam = searchParams.get("page_size") || "10";

    if (isNaN(parseInt(pageParam, 10)) || isNaN(parseInt(pageSizeParam, 10))) {
      return NextResponse.json(
        {
          code: httpStatus.BAD_REQUEST,
          msg: "Bad request",
          timestamp: Date.now(),
        },
        { status: httpStatus.BAD_REQUEST },
      );
    }

    const page = parseInt(pageParam, 10);
    const pageSize = parseInt(pageSizeParam, 10);

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
    const [carousels, total] = await prisma.$transaction([
      prisma.carousel.findMany({
        skip: (page - 1) * pageSize,
        take: pageSize,
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
        where,
        orderBy: [
          {
            order: "desc",
          },
        ],
      }),
      prisma.carousel.count({
        where,
      }),
    ]);
    return NextResponse.json(
      {
        code: 0,
        data: {
          items: carousels,
          page,
          pageSize,
          pageInfo: {
            total,
            pages: Math.ceil(total / pageSize),
          },
        },
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
