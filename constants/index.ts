export const cacheLngKey: string = "__homing_pigeon_lng__";
export const cacheThemeKey: string = "__homing_pigeon_theme__";
export const basePath =
  process.env.NEXT_PUBLIC_VERCEL_ENV === "production" ? "/homing-pigeon" : "";
