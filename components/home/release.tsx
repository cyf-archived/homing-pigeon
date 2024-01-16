"use client";
import { useCallback } from "react";
import { MdOutlineInsertDriveFile, MdOutlineVerified } from "react-icons/md";
import GitHubPkg from "@/components/home/github-pkg";
import { Release } from "@/types/github";
import { LngProps } from "@/i18next-lng";

export default function Release({
  release,
  lng,
}: { release: Release } & LngProps) {
  const Badge = useCallback(() => {
    if (!release.prerelease && !release.draft) {
      return <MdOutlineVerified className="text-xl text-green-400" />;
    }
    if (release.prerelease && !release.draft) {
      return <MdOutlineVerified className="text-xl text-red-400" />;
    }
    if (!release.prerelease && release.draft) {
      return <MdOutlineVerified className="text-xl text-gray-400" />;
    }
    return null;
  }, [release]);

  return (
    <li
      key={release.id}
      className="flex flex-wrap items-center justify-between gap-x-6 gap-y-4 py-5 sm:flex-nowrap"
    >
      <div>
        <div className="flex items-center gap-2 pb-2 text-2xl font-semibold leading-6 text-gray-900 dark:text-gray-100">
          <a href={release.html_url} className="hover:underline">
            {release.tag_name}
          </a>
          <Badge />
        </div>
        <div className="mt-1 flex items-center gap-x-2 text-sm leading-5 text-gray-500 dark:text-gray-400">
          <p>
            <a href={release.author?.html_url} className="hover:underline">
              {release.author?.login}
            </a>
          </p>
          <svg viewBox="0 0 2 2" className="h-0.5 w-0.5 fill-current">
            <circle cx={1} cy={1} r={1} />
          </svg>
          <p>
            <time dateTime={release.created_at}>{release.created_at}</time>
          </p>
        </div>
      </div>
      <dl className="flex w-full flex-none justify-between gap-x-8 sm:w-auto">
        <div className="flex -space-x-0.5">
          <dt className="sr-only">Commenters</dt>
          <dd key={release.author?.id}>
            <img
              className="h-6 w-6 rounded-full bg-gray-50 ring-2 ring-white"
              src={release.author?.avatar_url}
              alt={release.author?.login}
            />
          </dd>
        </div>
        <GitHubPkg
          assets={release?.assets || []}
          lng={lng}
          disabled={false}
          wrapped={false}
        >
          <div className="flex w-16 cursor-pointer gap-x-2.5">
            <dt>
              <span className="sr-only">Total assets</span>
              <MdOutlineInsertDriveFile
                className="h-6 w-6 text-gray-400"
                aria-hidden="true"
              />
            </dt>
            <dd className="text-sm leading-6 text-gray-900 dark:text-gray-500">
              {release?.assets?.length}
            </dd>
          </div>
        </GitHubPkg>
      </dl>
    </li>
  );
}
