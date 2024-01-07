import httpStatus from "http-status";
import { basename, extname } from "path";
import oss from "@/lib/aliyun-oss";

// https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config
export const dynamic = "force-dynamic";
// export const fetchCache = "force-no-store";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  let prefix = searchParams.get("prefix") || "";
  prefix = decodeURIComponent(prefix);

  if (!prefix) {
    return Response.json(
      {
        code: httpStatus.BAD_REQUEST,
        msg: "prefix must not be empty.",
        timestamp: Date.now(),
      },
      { status: httpStatus.BAD_REQUEST },
    );
  }

  try {
    const { objects } = await oss.list(
      {
        prefix,
        "max-keys": 10,
      },
      { timeout: 60000 },
    );

    const packages = objects.map((object) => ({
      etag: object.etag,
      name: object.name,
      short_name: basename(object.name),
      ext: extname(object.name),
      url: object.url,
      size: object.size,
    }));

    return Response.json(
      {
        code: 0,
        data: packages,
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
