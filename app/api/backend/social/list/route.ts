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

    const where: Prisma.SocialWhereInput = {
      is_del: "NO",
    };
    const [socials, total] = await prisma.$transaction([
      prisma.social.findMany({
        skip: (page - 1) * pageSize,
        take: pageSize,
        select: {
          id: true,
          title: true,
          subtitles: {
            select: {
              id: true,
              title: true,
              color: true,
              social_id: true,
              create_by: true,
              create_date: true,
              update_by: true,
              update_date: true,
            },
            where: {
              is_del: "NO",
            },
          },
          tips: {
            select: {
              id: true,
              type: true,
              text: true,
              href: true,
              color: true,
              social_id: true,
              create_by: true,
              create_date: true,
              update_by: true,
              update_date: true,
            },
            where: {
              is_del: "NO",
            },
          },
          descriptions: {
            select: {
              id: true,
              name: true,
              links: {
                select: {
                  id: true,
                  type: true,
                  text: true,
                  href: true,
                  color: true,
                  description_id: true,
                  create_by: true,
                  create_date: true,
                  update_by: true,
                  update_date: true,
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
              is_del: "NO",
            },
          },
          create_by: true,
          create_date: true,
          update_by: true,
          update_date: true,
        },
        where,
      }),
      prisma.social.count({
        where,
      }),
    ]);
    return NextResponse.json(
      {
        code: 0,
        data: {
          items: socials,
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
