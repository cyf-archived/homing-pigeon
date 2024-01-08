export const cacheLngKey: string = "__homing_pigeon_lng__";
export const cacheTokenKey: string = "__homing_pigeon_token__";
export const cacheThemeKey: string = "__homing_pigeon_theme__";
export const host =
  process.env.NEXT_PUBLIC_VERCEL_ENV === "production"
    ? "https://www.chenyifaer.com"
    : "http://localhost:3000";
export const basePath =
  process.env.NEXT_PUBLIC_VERCEL_ENV === "production" ? "/homing-pigeon" : "";
