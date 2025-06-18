"use client";

import { useState } from "react";
import { trpc } from "../lib/trpc";
import toast from "react-hot-toast";
import { ProgressBar } from "@intraflow/ui";

type UploadingFile = {
  name: string;
  progress: number;
  previewUrl?: string;
};

const MAX_FILES = 5;
const MAX_FILE_SIZE_MB = 30;

export default function FileUploader() {
  const [uploading, setUploading] = useState<UploadingFile[]>([]);
  const utils = trpc.useUtils();

  const uploadMutation = trpc.file.uploadFiles.useMutation({
    onSuccess: (result) => {
      toast.success(`✅ Uploaded ${result.length} file(s)`);
      utils.file.getFiles.invalidate();
    },
    onError: (err) => {
      toast.error(`❌ Failed to upload files: ${err.message}`);
    },
  });

  const handleFiles = (files: FileList | null) => {
    if (!files) return;

    const fileArray = Array.from(files);

    if (fileArray.length > MAX_FILES) {
      toast.error(`❌ Max ${MAX_FILES} files allowed`);
      return;
    }

    for (const file of fileArray) {
      if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
        toast.error(`❌ ${file.name} exceeds ${MAX_FILE_SIZE_MB}MB`);
        return;
      }
    }

    const readers = fileArray.map(
      (file) =>
        new Promise<{ name: string; base64: string; previewUrl?: string }>(
          (resolve, reject) => {
            const reader = new FileReader();

            reader.onprogress = (event) => {
              if (event.lengthComputable) {
                const progress = Math.round((event.loaded / event.total) * 100);
                setUploading((prev) =>
                  prev.map((f) =>
                    f.name === file.name ? { ...f, progress } : f
                  )
                );
              }
            };

            reader.onload = () => {
              const base64 = (reader.result as string).split(",")[1];
              const previewUrl = file.type.startsWith("image/")
                ? URL.createObjectURL(file)
                : undefined;

              setUploading((prev) => [
                ...prev,
                { name: file.name, progress: 0, previewUrl },
              ]);

              resolve({ name: file.name, base64, previewUrl });
            };

            reader.onerror = () => reject(reader.error);
            reader.readAsDataURL(file);
          }
        )
    );

    Promise.all(readers)
      .then((result) => {
        uploadMutation.mutate(
          result.map(({ name, base64 }) => ({ name, base64 }))
        );
      })
      .catch((err) => {
        console.error("❌ File read error:", err);
        toast.error("Error reading files");
      })
      .finally(() => {
        setUploading([]);
      });
  };

  return (
    <div className="space-y-6">
      <div
        className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 hover:bg-gray-100 transition text-gray-600 text-sm"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          handleFiles(e.dataTransfer.files);
        }}
      >
        <p>
          Drag and drop files here or{" "}
          <label className="text-blue-600 underline cursor-pointer">
            select files
            <input
              type="file"
              multiple
              className="hidden"
              onChange={(e) => handleFiles(e.target.files)}
            />
          </label>
        </p>
        <p className="mt-2 text-xs text-gray-400">
          Max {MAX_FILES} files, {MAX_FILE_SIZE_MB}MB each
        </p>
      </div>

      {uploading.length > 0 && (
        <div className="space-y-4">
          <p className="font-medium text-sm text-gray-700">Uploading:</p>
          {uploading.map((file) => (
            <div key={file.name} className="space-y-1">
              <div className="flex items-center justify-between">
                <p className="text-sm truncate">{file.name}</p>
                <span className="text-xs text-gray-500">{file.progress}%</span>
              </div>
              <ProgressBar progress={file.progress} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
