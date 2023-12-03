import httpStatus from "http-status";
import { NextResponse } from "next/server";
import { upload } from "@/lib/upload";
import prisma from "@/lib/prisma";
import { userId } from "@/constants";

// https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    let filename = formData.get("filename");

    if (
      (filename && typeof filename !== "string") ||
      !file ||
      typeof file === "string"
    ) {
      return NextResponse.json(
        {
          code: httpStatus.BAD_REQUEST,
          msg: "Bad request",
          timestamp: Date.now(),
        },
        { status: httpStatus.BAD_REQUEST },
      );
    }

    const blob = await upload(file, filename);
    const fileSize = file.size;

    await prisma.file.create({
      data: {
        url: blob.url,
        name: blob.pathname,
        type: blob.contentType,
        size: fileSize,
        create_by: userId,
        update_by: userId,
      },
    });

    return NextResponse.json(
      {
        code: 0,
        data: {
          ...(blob || {}),
          fileSize,
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
