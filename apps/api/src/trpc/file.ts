import { z } from "zod";
import { publicProcedure, router } from "./_base";
import { prisma } from "@intraflow/db";
import { fileDeleteSchema, FileDTO } from "@intraflow/types/file";
import { uploadFileToS3, deleteFileFromS3 } from "@intraflow/utils/s3";
import { sendFileUploadedEvent } from "@intraflow/utils/kafka";

// 🔹 Input schema for a single file
const singleFileSchema = z.object({
  name: z.string(),
  base64: z.string(),
});

type SingleFileInput = z.infer<typeof singleFileSchema>;

// 🔹 Input schema for multi-file upload
const multiUploadSchema = z.array(singleFileSchema);

// 🔹 Construct file URL (reuseable util)
const getFileUrl = (bucket: string, key: string): string => {
  const endpoint =
    process.env.S3_ENDPOINT?.replace(/\/$/, "") || "http://localhost:9000";
  return `${endpoint}/${bucket}/${key}`;
};

export const fileRouter = router({
  // 🟢 Upload multiple files
  uploadFiles: publicProcedure
    .input(multiUploadSchema)
    .mutation(async ({ input }) => {
      const uploadedFiles: FileDTO[] = [];

      for (const file of input) {
        const buffer = Buffer.from(file.base64, "base64");
        const filename = `${Date.now()}_${file.name}`;

        await uploadFileToS3(process.env.S3_BUCKET!, filename, buffer);

        const url = getFileUrl(process.env.S3_BUCKET!, filename);

        const dbFile = await prisma.file.create({
          data: {
            name: file.name,
            url,
          },
        });

        await sendFileUploadedEvent({
          id: dbFile.id,
          name: dbFile.name,
          url: dbFile.url,
        });

        uploadedFiles.push({
          id: dbFile.id,
          name: dbFile.name,
          url: dbFile.url,
          createdAt: dbFile.createdAt.toISOString(),
        });
      }

      return uploadedFiles;
    }),

  // 🟢 Get all uploaded files
  getFiles: publicProcedure.query(async () => {
    const files = await prisma.file.findMany({
      orderBy: { createdAt: "desc" },
    });

    return files.map(
      (file): FileDTO => ({
        id: file.id,
        name: file.name,
        url: file.url,
        createdAt: file.createdAt.toISOString(),
      })
    );
  }),

  // 🟢 Delete file by ID
  deleteFile: publicProcedure
    .input(fileDeleteSchema)
    .mutation(async ({ input }) => {
      const file = await prisma.file.findUnique({
        where: { id: input.id },
      });

      if (!file) {
        throw new Error("File not found");
      }

      const url = new URL(file.url);
      const key = url.pathname.replace(`/${process.env.S3_BUCKET}/`, "");

      await deleteFileFromS3(process.env.S3_BUCKET!, key);

      await prisma.file.delete({
        where: { id: input.id },
      });

      return { success: true };
    }),
});
