import httpStatus from "http-status";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { userId } from "@/constants";
import { schema } from "@/schema/feedback";

// https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const params = await request.json();
    const {
      error,
      value: { title, description, files = [] },
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

    const feedback = await prisma.feedback.create({
      data: {
        title,
        description,
        files: {
          create: files.map(
            ({
              url,
              type,
              size,
              title,
            }: {
              url: string;
              type?: string;
              size?: number;
              title?: string;
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
        create_by: userId,
        update_by: userId,
      },
      include: {
        files: true,
      },
    });
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
