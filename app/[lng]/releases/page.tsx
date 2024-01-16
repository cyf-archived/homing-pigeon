"use client";
import React, { useState, useEffect, useCallback } from "react";
import ReleaseComp from "@/components/home/release";
import { getReleases } from "@/request";
import type { Release } from "@/types/github";

export default function Releases({
  params,
}: {
  params: {
    lng: string;
  };
}) {
  const [loading, setLoading] = useState<boolean>(false);
  const [releases, setReleases] = useState<Release[]>([]);
  const [page, setPage] = useState<number>(1);
  const [error, setError] = useState<boolean>(false);

  const fetchData = async (page: number) => {
    try {
      setLoading(true);
      const res = await getReleases(page);
      setLoading(false);
      if (res?.code === 0) {
        setReleases(releases.concat(res?.data || []));
        return;
      }
      setError(true);
      console.error(res?.msg);
    } catch (error) {
      setLoading(false);
      setError(true);
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData(page);
  }, [page]);

  const ShowContent = useCallback(
    ({
      isShow,
      children,
    }: {
      isShow: boolean;
      children: React.ReactElement;
    }) => (isShow ? children : null),
    [],
  );

  return (
    <>
      <div className="min-h-[calc(100vh-8rem)] w-full max-w-screen-xl flex-1 px-5 xl:px-0">
        <div className="mb-4 text-3xl text-black dark:text-white">Release</div>
        <ul
          role="list"
          className="w-full divide-y divide-gray-300 dark:divide-gray-500"
        >
          {releases.map((release: Release) => (
            <ReleaseComp key={release.id} lng={params.lng} release={release} />
          ))}
        </ul>
        <ShowContent isShow={!(releases.length < page * 10)}>
          <button
            onClick={() => setPage(page + 1)}
            className="mx-auto flex items-center justify-center space-x-2 rounded-full border border-gray-300 bg-white px-5 py-2 text-sm text-gray-600 shadow-md transition-colors hover:enabled:border-gray-800 disabled:cursor-not-allowed dark:bg-black dark:text-white/80 max-md:mx-10"
            disabled={loading}
            rel="noopener noreferrer"
          >
            Load More
          </button>
        </ShowContent>
      </div>
    </>
  );
}
