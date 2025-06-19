import { prisma } from "@intraflow/db";

export class FileRepository {
  static async create(name: string, url: string) {
    return prisma.file.create({
      data: { name, url },
    });
  }

  static async findAll() {
    return prisma.file.findMany({
      orderBy: { createdAt: "desc" },
    });
  }

  static async findById(id: string) {
    return prisma.file.findUnique({
      where: { id },
    });
  }

  static async delete(id: string) {
    return prisma.file.delete({
      where: { id },
    });
  }
}
