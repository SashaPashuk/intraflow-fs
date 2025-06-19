import { z } from "zod";

export const fileInputSchema = z.object({
  name: z.string(),
});

export const fileDeleteSchema = z.object({
  id: z.string().uuid(),
});

export const singleFileUploadSchema = z.object({
  name: z.string(),
  base64: z.string(),
});

export const multiUploadSchema = z.array(singleFileUploadSchema);

export type FileInput = z.infer<typeof fileInputSchema>;
export type FileDeleteInput = z.infer<typeof fileDeleteSchema>;
export type UploadFileInput = z.infer<typeof singleFileUploadSchema>;

export interface FileDTO {
  id: string;
  name: string;
  url: string;
  createdAt: string;
}
