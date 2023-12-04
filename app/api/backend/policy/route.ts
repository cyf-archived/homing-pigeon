import httpStatus from "http-status";
import { NextResponse } from "next/server";
import hmacSHA1 from "crypto-js/hmac-sha1";
import Base64 from "crypto-js/enc-base64";
import Utf8 from "crypto-js/enc-utf8";

// https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const OSS_HOST = process.env.OSS_HOST;
    const OSS_ACCESS_ID = process.env.OSS_ACCESS_ID;
    const OSS_ACCESS_SECRET = process.env.OSS_ACCESS_SECRET;
    const OSS_BUCKET = process.env.OSS_BUCKET;

    if (!OSS_HOST || !OSS_ACCESS_ID || !OSS_ACCESS_SECRET || !OSS_BUCKET) {
      return NextResponse.json(
        {
          code: httpStatus.BAD_REQUEST,
          msg: "Bad request",
          timestamp: Date.now(),
        },
        { status: httpStatus.BAD_REQUEST },
      );
    }

    const timestamp = Date.now();
    const offset = timestamp + 4 * 60 * 60 * 1000;
    const date = new Date(offset);

    // prettier-ignore
    const policyObj =
`{
    "expiration": "${date.toISOString()}",
    "conditions": [
        { "bucket": "${OSS_BUCKET}" },
        [
            "content-length-range",
            0,
            15728640
        ]
    ]
}`;
    const policy = Base64.stringify(Utf8.parse(policyObj));
    const signature = Base64.stringify(hmacSHA1(policy, OSS_ACCESS_SECRET));

    return NextResponse.json(
      {
        code: 0,
        data: {
          policy: policy,
          signature: signature,
          expire: offset,
          accessId: OSS_ACCESS_ID,
          host: OSS_HOST,
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
