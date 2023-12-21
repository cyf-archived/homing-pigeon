import { Metadata } from "next";
import { basePath } from "@/constants";

export async function generateMetadata({
  params,
}: {
  params: { lng: string };
}): Promise<Metadata | undefined> {
  return {
    title: params.lng === "en" ? "Roadmap" : "路线图",
    description: `${
      params.lng === "en" ? "Roadmap" : "路线图"
    } - 童话镇里一枝花, 人美歌甜陈一发.`,
    metadataBase: new URL("https://chenyifaer.com"),
    icons: {
      icon: `${basePath}/logo.png`,
    },
  };
}

export default async function Roadmap({ params }: { params: { lng: string } }) {
  return (
    <div className="w-full max-w-6xl px-4 sm:px-6">
      <div className="pb-12 md:pb-20">Roadmap</div>
    </div>
  );
}
