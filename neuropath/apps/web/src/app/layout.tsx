import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: {
    default: "NeuroPath — Learning built for your brain",
    template: "%s | NeuroPath",
  },
  description:
    "NeuroPath diagnoses how your brain retains information — through performance, not guesswork — then turns every lecture into a personalized study system.",
  keywords: [
    "personalized learning",
    "study app",
    "learning diagnostics",
    "growth mindset",
    "AI study tool",
    "NeuroPath",
  ],
  authors: [{ name: "NeuroPath" }],
  creator: "NeuroPath",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"
  ),
  openGraph: {
    type: "website",
    locale: "en_US",
    title: "NeuroPath — Learning built for your brain",
    description:
      "Discover how your brain actually learns. Personalized study packs from every lecture.",
    siteName: "NeuroPath",
  },
  twitter: {
    card: "summary_large_image",
    title: "NeuroPath — Learning built for your brain",
    description:
      "Discover how your brain actually learns. Personalized study packs from every lecture.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#0c0c0e",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        {children}

        {/* Global toast notifications */}
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 4000,
            style: {
              background: "#141418",
              color: "#f0ede8",
              border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: "12px",
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "14px",
              fontWeight: "400",
              padding: "12px 18px",
            },
            success: {
              iconTheme: {
                primary: "#d94f2b",
                secondary: "#f0ede8",
              },
            },
            error: {
              iconTheme: {
                primary: "#e8603c",
                secondary: "#f0ede8",
              },
            },
          }}
        />
      </body>
    </html>
  );
}
