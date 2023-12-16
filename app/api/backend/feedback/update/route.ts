import httpStatus from "http-status";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { userId } from "@/constants";
import { schema } from "@/schema/feedback";

// https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const del_file_ids = searchParams.getAll("del_file_ids");
    const params = await request.json();
    const {
      error,
      value: { title, description, files = [] },
    } = schema.validate(params);
    if (!id || error) {
      return NextResponse.json(
        {
          code: httpStatus.BAD_REQUEST,
          msg: "Bad request",
          timestamp: Date.now(),
        },
        { status: httpStatus.BAD_REQUEST },
      );
    }

    const feedback = await prisma.feedback.update({
      data: {
        title,
        description,
        files: {
          updateMany: [
            ...(del_file_ids.length
              ? [
                  {
                    data: {
                      update_by: userId,
                      update_date: new Date(),
                      is_del: "YES",
                    },
                    where: {
                      id: {
                        in: del_file_ids,
                      },
                      is_del: "NO",
                    },
                  },
                ]
              : []),
            ...(files
              .filter((file: any) => !!file.id)
              .map(
                ({
                  id,
                  url,
                  type,
                  size,
                  title,
                }: {
                  id: string;
                  url: string;
                  type: string;
                  size: number;
                  title: string;
                }) => ({
                  data: {
                    url,
                    type,
                    size,
                    title,
                    update_by: userId,
                    update_date: new Date(),
                  },
                  where: {
                    id,
                    is_del: "NO",
                  },
                }),
              ) || []),
          ],
          create: files
            .filter((file: any) => !file.id)
            .map(
              ({
                url,
                type,
                size,
                title,
              }: {
                url: string;
                type: string;
                size: number;
                title: string;
              }) => ({
                url,
                type,
                size,
                title,
                create_by: userId,
                update_by: userId,
              }),
            ),
        },
        update_by: userId,
        update_date: new Date(),
      },
      include: {
        files: true,
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
