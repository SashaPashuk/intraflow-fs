import { uploadFileToS3, deleteFileFromS3 } from "@intraflow/utils/s3";

const BUCKET = process.env.S3_BUCKET!;
const ENDPOINT =
  process.env.S3_ENDPOINT?.replace(/\/$/, "") || "http://localhost:9000";

export class StorageProvider {
  static async upload(name: string, buffer: Buffer): Promise<string> {
    await uploadFileToS3(BUCKET, name, buffer);
    return `${ENDPOINT}/${BUCKET}/${name}`;
  }

  static async remove(fileUrl: string): Promise<void> {
    const url = new URL(fileUrl);
    const key = url.pathname.replace(`/${BUCKET}/`, "");
    await deleteFileFromS3(BUCKET, key);
  }
}
