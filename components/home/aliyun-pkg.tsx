"use client";
import React, { useState } from "react";
import Link from "next/link";
import Popover from "@/components/shared/popover";
import { LngProps } from "@/i18next-lng";
import { Package } from "@/types/aliyun-oss";

export default function AliyunPkg(
  props: LngProps & {
    packages: Package[];
    disabled: boolean;
    children: React.ReactNode;
  },
) {
  const { packages, disabled, children } = props;
  const [openPopover, setOpenPopover] = useState(false);

  return (
    <Popover
      content={
        <div className="w-full min-w-[14rem] rounded-md bg-white p-2 dark:bg-black">
          {packages.map((pkg) => {
            return (
              <Link
                key={pkg.etag}
                href={pkg.url || ""}
                className="relative flex w-full items-center justify-start space-x-2 rounded-md p-2 text-left text-sm transition-all duration-75 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <p className="text-sm">{pkg.short_name}</p>
              </Link>
            );
          })}
        </div>
      }
      align="end"
      openPopover={openPopover}
      setOpenPopover={setOpenPopover}
    >
      <button
        onClick={() => setOpenPopover(!openPopover)}
        className="flex items-center justify-center space-x-2 rounded-full border border-gray-300 bg-white px-5 py-2 text-sm text-gray-600 shadow-md transition-colors hover:enabled:border-gray-800 disabled:cursor-not-allowed dark:bg-black dark:text-white/80 max-md:mx-0"
        disabled={disabled}
        rel="noopener noreferrer"
      >
        {children}
      </button>
    </Popover>
  );
}
