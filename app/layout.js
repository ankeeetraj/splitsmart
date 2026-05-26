import { Space_Grotesk } from 'next/font/google'
import "./globals.css";
import Providers from "./providers"

const spaceGrotesk = Space_Grotesk({ subsets: ['latin'] })

export const metadata = {
  title: "SplitSmart",
  description: "AI-powered group expense splitting",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${spaceGrotesk.className} antialiased min-h-screen flex flex-col`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
