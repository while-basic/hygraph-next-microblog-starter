import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Chris's Microblog",
  description: "Chris's Microblog",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-black text-white">
        <div className="container max-w-full min-h-screen bg-black">
          <div className="mx-auto max-w-xl px-4 py-8">
            <h1 className="text-4xl text-white font-bold mb-4">Chris&apos;s Microblog</h1>
            {children}
          </div>
        </div>

        <footer className="text-center bg-black text-white p-3">
          Copyright {new Date().getFullYear()} | Powered by
          <a href="https://chriscelaya.com" className="hover:text-gray-300"> Celaya Solutions</a>
        </footer>
      </body>
    </html>
  );
}
