import cron from 'node-cron';
import { S3Client, ListObjectsV2Command, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { prisma } from '@intraflow/db';

const s3 = new S3Client({
  region: 'us-east-1',
  endpoint: process.env.S3_ENDPOINT || 'http://localhost:9000',
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY || 'minioadmin',
    secretAccessKey: process.env.S3_SECRET_KEY || 'minioadmin',
  },
  forcePathStyle: true,
});

const run = async () => {
  const bucket = process.env.S3_BUCKET!;
  const listCommand = new ListObjectsV2Command({ Bucket: bucket });

  const result = await s3.send(listCommand);
  const s3Files = result.Contents ?? [];

  const dbFiles = await prisma.file.findMany();
  const dbFileKeys = new Set(dbFiles.map((f) => f.url.split('/').pop()));

  const toDelete = s3Files.filter((f) => !dbFileKeys.has(f.Key));

  for (const file of toDelete) {
    if (!file.Key) continue;
    await s3.send(new DeleteObjectCommand({ Bucket: bucket, Key: file.Key }));
    console.log(`[S3-Cleaner] 🗑 Deleted orphaned file: ${file.Key}`);
  }

  console.log(`[S3-Cleaner] ✅ Cleanup finished. Deleted: ${toDelete.length} file(s)`);
};

cron.schedule('* * * * *', () => {
  console.log(`[S3-Cleaner] 🕐 Running scheduled cleanup at ${new Date().toISOString()}`);
  run().catch((err) => console.error('[S3-Cleaner] ❌ Error during cleanup:', err));
});

run().catch((err) => console.error('[S3-Cleaner] ❌ Initial run failed:', err));
