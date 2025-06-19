import { z } from "zod";
import { publicProcedure, router } from "./_base";
import { fileDeleteSchema } from "@intraflow/types/file";
import { FileService } from "../services/FileService";

const singleFileSchema = z.object({
  name: z.string(),
  base64: z.string(),
});

export const fileRouter = router({
  uploadFiles: publicProcedure
    .input(z.array(singleFileSchema))
    .mutation(({ input }) => FileService.uploadMultiple(input)),

  getFiles: publicProcedure.query(() => FileService.getAll()),

  deleteFile: publicProcedure
    .input(fileDeleteSchema)
    .mutation(({ input }) => FileService.delete(input.id)),
});
