import Link from "next/link";
import "./globals.css";
import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "My Blog",
  description: "A simple blog built with Next.js and PostgreSQL",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (  
    <html lang="en" className="dark">
      <body
        className={`${inter.className} bg-[#001b39] text-gray-100 min-h-screen flex flex-col items-center`}
      >
        <header className="p-6 text-center">
          <Link href={"https://github.com/ShivaNach"} target="_blank" rel="noopener noreferrer">
          <div className="group bg-[#001733] inline-block px-6 py-4 rounded-2xl hover:bg-[#002b49] transition-colors">
          <h1 className="text-5xl font-bold group-hover:text-blue-500 transition-colors">My Blog</h1>
          <h1 className="text-xl ml-20 group-hover:text-blue-500 transition-colors">-by ShivaNach</h1>
          </div>
          </Link>
        </header>
        <main className="px-4 py-8">
          {children}
        </main>
        <footer className="w-full p-4 text-center border-t border-gray-700 text-sm text-gray-400">
          Made with ❤️ by ShivaNach
        </footer>
      </body>
    </html>
  );
}
