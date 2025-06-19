// src/services/FileService.ts
import { FileRepository } from "../repositories/FileRepository";
import { StorageProvider } from "../providers/StorageProvider";
import { EventPublisher } from "../providers/EventPublisher";
import { UploadFileInput, FileDTO } from "@intraflow/types/file";

export class FileService {
  static async uploadMultiple(input: UploadFileInput[]): Promise<FileDTO[]> {
    const uploadedFiles: FileDTO[] = [];

    for (const file of input) {
      const buffer = Buffer.from(file.base64, "base64");
      const filename = `${Date.now()}_${file.name}`;

      const url = await StorageProvider.upload(filename, buffer);

      const dbFile = await FileRepository.create(file.name, url);

      await EventPublisher.fileUploaded({
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
  }

  static async getAll(): Promise<FileDTO[]> {
    const files = await FileRepository.findAll();

    return files.map((file) => ({
      id: file.id,
      name: file.name,
      url: file.url,
      createdAt: file.createdAt.toISOString(),
    }));
  }

  static async delete(id: string): Promise<{ success: true }> {
    const file = await FileRepository.findById(id);
    if (!file) throw new Error("File not found");

    await StorageProvider.remove(file.url);
    await FileRepository.delete(id);

    return { success: true };
  }
}
