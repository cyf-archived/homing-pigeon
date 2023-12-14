import httpStatus from "http-status";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { userId } from "@/constants";
import { schema } from "@/schema/social";

// https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const params = await request.json();
    const {
      error,
      value: { title, subtitles = [], tips = [], descriptions = [] },
    } = schema.validate(params);
    if (error) {
      return NextResponse.json(
        {
          code: httpStatus.BAD_REQUEST,
          msg: "Bad request",
          timestamp: Date.now(),
        },
        { status: httpStatus.BAD_REQUEST },
      );
    }

    const social = await prisma.social.create({
      data: {
        title,
        subtitles: {
          createMany: {
            data: subtitles.map(
              ({ title, color }: { title: string; color?: string }) => ({
                title,
                color,
                create_by: userId,
                update_by: userId,
              }),
            ),
          },
        },
        tips: {
          createMany: {
            data: tips.map(
              ({
                type,
                text,
                href,
                color,
              }: {
                type: string;
                text?: string;
                href?: string;
                color?: string;
              }) => ({
                type,
                text,
                href,
                color,
                create_by: userId,
                update_by: userId,
              }),
            ),
          },
        },
        descriptions: {
          createMany: {
            data: descriptions.map(
              ({
                name,
                links,
              }: {
                name?: string;
                links: Array<{
                  type: string;
                  text?: string;
                  href?: string;
                  color?: string;
                }>;
              }) => ({
                name,
                links: {
                  createMany: {
                    data: links.map(
                      ({
                        type,
                        text,
                        href,
                        color,
                      }: {
                        type: string;
                        text?: string;
                        href?: string;
                        color?: string;
                      }) => ({
                        type,
                        text,
                        href,
                        color,
                        create_by: userId,
                        update_by: userId,
                      }),
                    ),
                  },
                },
                create_by: userId,
                update_by: userId,
              }),
            ),
          },
        },
        create_by: userId,
        update_by: userId,
      },
      include: {
        subtitles: true,
        tips: true,
        descriptions: {
          include: {
            links: true,
          },
        },
      },
    });
    return NextResponse.json(
      { code: 0, data: social, timestamp: Date.now() },
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
