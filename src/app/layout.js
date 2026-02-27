import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ClientLayout from "@/components/ClientLayout";
import { StructuredData, generateOrganizationSchema, generateWebsiteSchema } from "@/components/SEO/StructuredData";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: {
    default: "SoftStack Agency | Leading Software Development & AI Solutions Company",
    template: "%s | SoftStack Agency"
  },
  description: "SoftStack Agency is a premier software development company specializing in AI agents, machine learning, mobile app development, web development, e-commerce solutions, UI/UX design, and digital transformation. Transform your business with cutting-edge technology and expert development team.",
  keywords: [
    // Core Services
    "software development company", "custom software development", "software development agency",
    "AI development", "AI agents", "artificial intelligence solutions", "machine learning development",
    "web development", "web application development", "website development services",
    "mobile app development", "iOS app development", "Android app development", "cross-platform apps",
    "e-commerce development", "online store development", "shopify development", "woocommerce development",
    
    // Technologies
    "react development", "next.js development", "node.js development", "javascript development",
    "python development", "AI integration", "API development", "cloud solutions",
    
    // Specializations
    "UI/UX design", "user interface design", "user experience design", "responsive web design",
    "digital transformation", "business automation", "enterprise software solutions",
    "SaaS development", "MVP development", "startup technology partner",
    
    // Location & Company
    "SoftStack Agency", "software development services", "tech consulting", "IT solutions",
    "agile development", "full-stack development", "DevOps services"
  ],
  authors: [{ name: "SoftStack Agency", url: "https://softstackagency.com" }],
  creator: "SoftStack Agency",
  publisher: "SoftStack Agency",
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://softstackagency.com'),
  alternates: {
    canonical: '/',
    languages: {
      'en-US': '/en-US',
      'en': '/en'
    }
  },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: '32x32' }
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }
    ],
    other: [
      { rel: 'mask-icon', url: '/favicon.svg', color: '#22D3EE' }
    ]
  },
  manifest: '/site.webmanifest',
  openGraph: {
    title: "SoftStack Agency | Leading Software Development & AI Solutions Company",
    description: "Premier software development agency specializing in AI agents, web development, mobile apps, e-commerce, and digital transformation. Build innovative solutions with our expert team.",
    url: 'https://softstackagency.com',
    siteName: 'SoftStack Agency',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/banner1.jpg',
        width: 1200,
        height: 630,
        alt: 'SoftStack Agency - Leading Software Development & AI Solutions',
        type: 'image/jpeg'
      },
      {
        url: '/app.jpg',
        width: 1200,
        height: 630,
        alt: 'Custom Software Development Services',
        type: 'image/jpeg'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    site: '@softstackagency',
    creator: '@softstackagency',
    title: "SoftStack Agency | Leading Software Development & AI Solutions",
    description: "Transform your business with cutting-edge AI agents, web development, mobile apps, and e-commerce solutions. Expert software development team.",
    images: ['/banner1.jpg']
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1
    }
  },
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
    bing: 'your-bing-verification-code'
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'SoftStack Agency'
  },
  category: 'technology',
  classification: 'Software Development, AI Solutions, Web Development',
  other: {
    'msapplication-TileColor': '#22D3EE',
    'application-name': 'SoftStack Agency'
  }
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#050914' },
    { media: '(prefers-color-scheme: light)', color: '#22D3EE' }
  ]
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <head>
        <StructuredData data={generateOrganizationSchema()} />
        <StructuredData data={generateWebsiteSchema()} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}
