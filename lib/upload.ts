import { put } from "@vercel/blob";
import type { PutBlobResult } from "@vercel/blob";

export const upload = (
  file: File,
  filename?: string | null,
): Promise<PutBlobResult> => {
  return put(filename || file.name, file, {
    access: "public",
  });
};
