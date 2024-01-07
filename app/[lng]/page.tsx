"use client";
import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import Balancer from "react-wrap-balancer";
import { RoughNotation } from "react-rough-notation";
import { FaBlog } from "react-icons/fa";
import Image from "next/image";
// import dynamic from "next/dynamic";
import Pkg from "@/components/home/pkg";
import { AppStore, Android, GooglePlay } from "@/components/shared/icons";
import { useTranslation } from "@/i18n/client";
import { latestTop10Release, getReleaseInfo } from "@/request";
import { allPosts } from "contentlayer/generated";
import { Release, Package } from "@/types/release";
import { basePath } from "@/constants";

// const DynamicCard = dynamic(() => import("@/components/home/card"), {
//   ssr: false,
// });

type SystemOS = "ios" | "android";

const platforms: Record<SystemOS, string[]> = {
  ios: [".ipa"],
  android: [".apk", ".aab"],
};

export default function Home({
  params,
}: {
  params: {
    lng: string;
  };
}) {
  const { t } = useTranslation(params.lng, "header");
  const { t: tc } = useTranslation(params.lng, "common");
  const [loading, setLoading] = useState<boolean>(false);
  const [releases, setReleases] = useState<Release[]>([]);
  const [pkgs, setPkgs] = useState<Package[]>([]);
  const [error, setError] = useState<any>(null);

  const post = allPosts
    .filter((post) => post.slug.startsWith(`${params.lng}/blog`))
    .sort((a, b) => {
      return new Date(a.publishedAt) > new Date(b.publishedAt) ? -1 : 1;
    })
    .at(0);

  const latestRelease = useMemo(() => releases[0], [releases]);

  const { ios, android } = useMemo(() => {
    const packages: Record<SystemOS, Package[]> = {
      ios: [],
      android: [],
    };
    Object.keys(platforms).forEach((key: string) => {
      const matcher = (name: string) =>
        platforms[key as SystemOS].some((platform: string) =>
          name.endsWith(platform),
        );
      packages[key as SystemOS] =
        pkgs.filter(({ short_name }) => short_name && matcher(short_name)) ||
        [];
    });
    return packages;
  }, [pkgs]);

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await latestTop10Release();
      setLoading(false);
      if (res?.code === 0) {
        const data = res?.data || [];
        setReleases(data);
        if (data.length) {
          const prefix = data[0]?.prefix;
          if (!prefix) {
            return;
          }
          const pkgRes = await getReleaseInfo(prefix);
          if (pkgRes?.code === 0) {
            setPkgs(pkgRes?.data || []);
          } else {
            console.error(pkgRes?.msg);
            setError(pkgRes?.msg);
          }
        }
      } else {
        console.error(res?.msg);
        setError(res?.msg);
      }
    } catch (error: any) {
      console.error(error);
      setLoading(false);
      setError(error.message || error.toString());
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <>
      <div className="w-full max-w-xl px-5 xl:px-0">
        {post && (
          <Link
            href={`/${post.slug}`}
            rel="noreferrer"
            className="mx-auto mb-12 flex max-w-fit animate-fade-up items-center justify-center space-x-2 overflow-hidden rounded-full bg-blue-100 px-7 py-2 transition-colors hover:bg-blue-200"
          >
            <FaBlog className="h-5 w-5 text-[#1d9bf0]" />
            <p className="text-sm font-semibold text-[#1d9bf0]">{post.title}</p>
          </Link>
        )}
        <div className="mb-8 flex items-center justify-center space-x-20">
          <Image
            className="rounded-full"
            alt="logo"
            src={`${basePath}/logo.png`}
            width={160}
            height={160}
          />
        </div>
        <h1
          className="animate-fade-up bg-clip-text text-center font-display text-4xl font-bold tracking-[-0.02em] text-black/80 opacity-0 drop-shadow-sm dark:text-white/80 md:text-7xl md:leading-[5rem]"
          style={{ animationDelay: "0.15s", animationFillMode: "forwards" }}
        >
          <Balancer>{t("title")}</Balancer>
        </h1>
        <p
          className="mt-6 animate-fade-up text-center text-red-400 opacity-0 md:text-xl"
          style={{ animationDelay: "0.25s", animationFillMode: "forwards" }}
        >
          <Balancer>
            <RoughNotation
              animate
              type="highlight"
              show={true}
              color="rgb(36, 54, 110)"
              animationDelay={1000}
              animationDuration={2500}
            >
              一个可以接收直播通知的应用.
            </RoughNotation>
          </Balancer>
        </p>
      </div>
      <div className="mt-10 grid w-full max-w-screen-xl animate-fade-up xl:px-0">
        <div className="flex items-center justify-center">
          <div className="grid w-full grid-cols-1 gap-5 px-10 sm:grid-cols-2 sm:px-10 md:max-w-5xl md:grid-cols-4 lg:px-0">
            <Pkg
              lng={params.lng}
              disabled={loading || error || !android.length}
              packages={android}
            >
              <Android className="h-7 w-7" />
              <p>
                <span className="sm:inline-block">Android</span>
              </p>
            </Pkg>
            <Pkg
              lng={params.lng}
              disabled={loading || error || !ios.length}
              packages={ios}
            >
              <AppStore className="h-7 w-7" />
              <p>
                <span className="sm:inline-block">App Store</span>
              </p>
            </Pkg>
            <Link
              className="flex items-center justify-center space-x-2 rounded-full border border-gray-300 bg-white px-5 py-2 text-sm text-gray-600 shadow-md transition-colors hover:border-gray-800 dark:bg-black dark:text-white/80 max-md:mx-0"
              href=""
            >
              <GooglePlay className="h-7 w-7" />
              <p>
                <span className="sm:inline-block">Google Play</span>
              </p>
            </Link>
            <Link
              className="flex items-center justify-center space-x-2 rounded-full border border-gray-300 bg-white px-5 py-2 text-sm text-gray-600 shadow-md transition-colors hover:border-gray-800 dark:bg-black dark:text-white/80 max-md:mx-0"
              href=""
            >
              <AppStore className="h-7 w-7" />
              <p>
                <span className="sm:inline-block">App Store</span>
              </p>
            </Link>
          </div>
        </div>
      </div>
      {latestRelease?.version && (
        <p
          className="mt-4 animate-fade-up text-center text-sm opacity-0"
          style={{ animationDelay: "0.25s", animationFillMode: "forwards" }}
        >
          <Balancer>
            {tc("latest")}:{" "}
            <span className="text-red-400">{latestRelease?.version}</span>
          </Balancer>
        </p>
      )}
    </>
  );
}
