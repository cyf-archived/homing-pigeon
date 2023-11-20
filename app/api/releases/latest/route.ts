import { Octokit } from "@octokit/rest";
import httpStatus from "http-status";

const octokit = new Octokit({
  auth: process.env.NEXT_PUBLIC_GH_TOKEN,
});

// https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config
export const dynamic = "force-dynamic";
// export const fetchCache = "force-no-store";

export async function GET() {
  try {
    const latestRelease = await octokit.repos.getLatestRelease({
      owner: process.env.NEXT_PUBLIC_GH_REPO_OWNER,
      repo: process.env.NEXT_PUBLIC_GH_REPO,
    });

    return Response.json(
      { code: 0, data: latestRelease.data, timestamp: Date.now() },
      { status: httpStatus.OK },
    );
  } catch (error: any) {
    return Response.json(
      {
        code: httpStatus.INTERNAL_SERVER_ERROR,
        error: error.message || error.toString(),
        timestamp: Date.now(),
      },
      { status: httpStatus.INTERNAL_SERVER_ERROR },
    );
  }
}
