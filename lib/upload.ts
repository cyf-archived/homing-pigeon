import { put } from "@vercel/blob";
import type { PutBlobResult } from "@vercel/blob";

export const upload = (file: File): Promise<PutBlobResult> => {
  return put(file.name, file, {
    access: "public",
  });
};
