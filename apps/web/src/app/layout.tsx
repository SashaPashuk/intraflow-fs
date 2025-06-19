import "./globals.css";
import { Toaster } from "react-hot-toast";
import { TRPCProvider } from "../components/TRPCProvider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="bg-gray-50 text-gray-900 font-sans min-h-screen">
        <TRPCProvider>{children}</TRPCProvider>
        <Toaster position="top-right" />
      </div>
    </>
  );
}
