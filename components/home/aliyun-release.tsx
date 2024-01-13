"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Balancer from "react-wrap-balancer";
import { Android, AppStore, GooglePlay } from "@/components/shared/icons";
import AliyunPkg from "@/components/home/aliyun-pkg";
import { platforms } from "@/constants";
import { getReleaseInfo, latestTop10Release } from "@/request";
import { useTranslation } from "@/i18n/client";
import { Release, Package } from "@/types/aliyun-oss";
import { LngProps } from "@/i18next-lng";
import { SystemOS } from "@/types/common";

export default function AliyunRelease({ lng }: LngProps) {
  const { t } = useTranslation(lng, "common");
  const [loading, setLoading] = useState<boolean>(false);
  const [releases, setReleases] = useState<Release[]>([]);
  const [pkgs, setPkgs] = useState<Package[]>([]);
  const [error, setError] = useState<any>(null);

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
      setLoading(false);
      setError(error.message || error.toString());
      console.error(error);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <>
      <div className="mt-10 grid w-full max-w-screen-xl animate-fade-up xl:px-0">
        <div className="flex items-center justify-center">
          <div className="grid w-full grid-cols-1 gap-5 px-10 sm:grid-cols-2 sm:px-10 md:max-w-5xl md:grid-cols-4 lg:px-0">
            <AliyunPkg
              lng={lng}
              disabled={loading || error || !android.length}
              packages={android}
            >
              <Android className="h-7 w-7" />
              <p>
                <span className="sm:inline-block">Android</span>
              </p>
            </AliyunPkg>
            <AliyunPkg
              lng={lng}
              disabled={loading || error || !ios.length}
              packages={ios}
            >
              <AppStore className="h-7 w-7" />
              <p>
                <span className="sm:inline-block">App Store</span>
              </p>
            </AliyunPkg>
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
            {t("latest")}:{" "}
            <span className="text-red-400">{latestRelease?.version}</span>
          </Balancer>
        </p>
      )}
    </>
  );
}
