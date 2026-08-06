import type { Metadata } from "next";
import { Fredoka, Plus_Jakarta_Sans } from "next/font/google";
import { headers } from "next/headers";
import "./globals.css";

const fredoka = Fredoka({
  variable: "--font-fredoka",
  subsets: ["latin"],
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  display: "swap",
});

const title = "BrightNest Pediatric Clinic | Gentle care for growing families";
const description =
  "Warm, evidence-led pediatric care in Lahore. Book online consultations, in-clinic visits, growth guidance, and parenting sessions with Dr. Zara Ahmed.";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host =
    requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host");
  const forwardedProtocol = requestHeaders.get("x-forwarded-proto");
  const protocol =
    forwardedProtocol ?? (host?.includes("localhost") || host?.startsWith("127.") ? "http" : "https");
  const origin = host
    ? `${protocol}://${host}`
    : process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  return {
    metadataBase: new URL(origin),
    title: {
      default: title,
      template: "%s | BrightNest Pediatric Clinic",
    },
    description,
    keywords: [
      "pediatric clinic Lahore",
      "child specialist",
      "online pediatric consultation",
      "child development",
      "parenting guidance",
    ],
    robots: { index: true, follow: true },
    openGraph: {
      title,
      description,
      type: "website",
      siteName: "BrightNest Pediatric Clinic",
      images: [
        {
          url: `${origin}/og.png`,
          width: 1792,
          height: 935,
          alt: "BrightNest Pediatric Clinic — Gentle care for every little milestone.",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${origin}/og.png`],
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${fredoka.variable} ${jakarta.variable}`}>
        {children}
      </body>
    </html>
  );
}
