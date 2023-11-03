import { MetadataRoute } from "next";
import { allPosts } from "contentlayer/generated";

const NEXT_PUBLIC_ENV = process.env.NEXT_PUBLIC_ENV;

const domain =
  process.env.NODE_ENV === "production"
    ? `https://${
        NEXT_PUBLIC_ENV === "prod" ? "www" : NEXT_PUBLIC_ENV
      }.chenyifaer.com/homing-pigeon`
    : "http://localhost:3000/homing-pigeon";

export default function sitemap(): MetadataRoute.Sitemap {
  const sitemaps = allPosts
    .sort((a, b) => {
      return new Date(a.publishedAt) > new Date(b.publishedAt) ? -1 : 1;
    })
    .map((post) => ({
      url: `${domain}/${post.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    }));

  return sitemaps as MetadataRoute.Sitemap;
}
