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

    const where: Prisma.EmojiWhereInput = {
      is_del: "NO",
    };
    const [emojis, total] = await prisma.$transaction([
      prisma.emoji.findMany({
        skip: (page - 1) * pageSize,
        take: pageSize,
        select: {
          id: true,
          image: true,
          text: true,
          color: true,
          create_by: true,
          create_date: true,
          update_by: true,
          update_date: true,
        },
        where,
      }),
      prisma.emoji.count({
        where,
      }),
    ]);
    return NextResponse.json(
      {
        code: 0,
        data: {
          items: emojis,
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
