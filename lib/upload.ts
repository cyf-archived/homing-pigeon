import { upload as uploadFile } from "@vercel/blob/client";
import type { PutBlobResult } from "@vercel/blob";

export const upload = (file: File): Promise<PutBlobResult> => {
  return uploadFile(file.name, file);
};
