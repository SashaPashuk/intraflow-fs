import { z } from 'zod';

export const fileInputSchema = z.object({
  name: z.string(),
});

export const fileDeleteSchema = z.object({
  id: z.string().uuid(),
});

export type FileInput = z.infer<typeof fileInputSchema>;
export type FileDeleteInput = z.infer<typeof fileDeleteSchema>;

export interface FileDTO {
  id: string;
  name: string;
  url: string;
  createdAt: string;
}
