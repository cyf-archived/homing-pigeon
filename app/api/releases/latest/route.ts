import { Octokit } from "@octokit/rest";

const octokit = new Octokit({
  auth: process.env.NEXT_PUBLIC_GH_TOKEN,
});

// https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config
// export const dynamic = 'force-dynamic'
export const fetchCache = "force-no-store";

export async function GET() {
  try {
    const latestRelease = await octokit.repos.getLatestRelease({
      owner: process.env.NEXT_PUBLIC_GH_REPO_OWNER,
      repo: process.env.NEXT_PUBLIC_GH_REPO,
    });

    return Response.json(
      { code: 0, data: latestRelease.data },
      { status: 200 },
    );
  } catch (error: any) {
    return Response.json(
      { code: -1, error: error.message || error.toString() },
      { status: 500 },
    );
  }
}
