"use client";

import { trpc } from "../lib/trpc";
import toast from "react-hot-toast";
import { DeleteButton } from "@intraflow/ui";

export default function FileList() {
  const utils = trpc.useUtils();

  const { data: files, isLoading } = trpc.file.getFiles.useQuery();
  const deleteMutation = trpc.file.deleteFile.useMutation();

  const handleDelete = (id: string) => {
    deleteMutation.mutate(
      { id },
      {
        onSuccess: () => {
          toast.success("🗑️ File deleted");
          utils.file.getFiles.invalidate();
        },
        onError: () => {
          toast.error("❌ Failed to delete file");
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="mx-auto mt-6 animate-pulse">
        <div className="h-4 bg-gray-300 rounded mb-2 w-1/2" />
        <div className="h-4 bg-gray-200 rounded mb-2 w-full" />
        <div className="h-4 bg-gray-200 rounded mb-2 w-full" />
        <div className="h-4 bg-gray-200 rounded mb-2 w-3/4" />
      </div>
    );
  }

  if (!files || files.length === 0) {
    return (
      <p className="text-center mt-6 text-gray-500 italic">
        No files uploaded yet.
      </p>
    );
  }

  return (
    <div className="mx-auto mt-6 border border-gray-200 rounded-md shadow-sm overflow-hidden">
      <h3 className="text-lg font-semibold bg-gray-100 px-4 py-3 border-b text-gray-800">
        Uploaded Files
      </h3>
      <table className="w-full text-sm">
        <thead className="bg-gray-50 text-gray-700">
          <tr>
            <th className="text-left px-4 py-2">Name</th>
            <th className="text-left px-4 py-2">Date</th>
            <th className="text-left px-4 py-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {files.map((file) => (
            <tr
              key={file.id}
              className="border-t hover:bg-gray-50 transition-colors"
            >
              <td className="px-4 py-2 text-blue-600 truncate">{file.name}</td>
              <td className="px-4 py-2 text-gray-600">
                {new Date(file.createdAt).toLocaleDateString()}
              </td>
              <td className="px-4 py-2">
                <DeleteButton
                  onClick={() => handleDelete(file.id)}
                  label="Remove"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
