import httpStatus from "http-status";
import { basename } from "path";
import oss from "@/lib/aliyun-oss";

// https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config
export const dynamic = "force-dynamic";
// export const fetchCache = "force-no-store";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  let prefix = searchParams.get("prefix") || process.env.DISTRIBUTION_ENV;

  try {
    prefix = prefix.endsWith("/") ? prefix : `${prefix}/`;
    const { prefixes } = await oss.list(
      {
        prefix,
        delimiter: "/",
        "max-keys": 10,
      },
      { timeout: 60000 },
    );

    const releases = prefixes.map((p) => ({ version: basename(p), prefix: p }));

    return Response.json(
      {
        code: 0,
        data: releases,
        timestamp: Date.now(),
      },
      { status: httpStatus.OK },
    );
  } catch (error: any) {
    return Response.json(
      {
        code: httpStatus.INTERNAL_SERVER_ERROR,
        msg: error.message || error.toString(),
        timestamp: Date.now(),
      },
      { status: httpStatus.INTERNAL_SERVER_ERROR },
    );
  }
}
