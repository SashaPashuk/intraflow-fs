import FileUploader from "../components/UploadForm";
import FileList from "../components/FileList";

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-3xl bg-white rounded-lg shadow-md p-6 space-y-6">
        <h1 className="text-2xl font-bold text-gray-800 border-b pb-3">
          📁 File Manager
        </h1>
        <FileUploader />
        <FileList />
      </div>
    </main>
  );
}
