import dynamic from 'next/dynamic';
import HeroSection from "@/components/home/HomeHero/hero";
import { StructuredData, generateFAQSchema } from "@/components/SEO/StructuredData";
import { bannerApi } from "@/lib/api";

// Dynamic imports for below-the-fold components
const AboutSection = dynamic(() => import("@/components/home/HomeCenter/centerSection"), {
  loading: () => <div className="min-h-screen bg-slate-950" />
});

const HomecardSection = dynamic(() => import("@/components/home/HomeCards/homeCard"));

const Testimonial = dynamic(() => import("@/components/home/HomeTestimonial/Testimonial"));

const FAQ = dynamic(() => import("@/components/home/HomeFAQ/FAQ"));

export const metadata = {
  title: "SoftStack Agency | #1 AI & Software Development Solutions",
  description: "SoftStack Agency is your trusted partner for premium software development, AI agents, mobile apps, and e-commerce solutions. We transform businesses with cutting-edge technology and expert engineering.",
  keywords: ["software development agency", "AI solutions", "web development services", "mobile app development", "e-commerce development", "custom software", "digital transformation", "enterprise software", "technology consulting", "MVP development", "startup solutions"],
  openGraph: {
    title: "SoftStack Agency | Leading Software Development & AI Solutions",
    description: "Transform your business with cutting-edge software development, AI agents, and digital solutions. Expert team for your next big project.",
    images: [{
      url: '/banner1.jpg',
      width: 1200,
      height: 630,
      alt: 'SoftStack Agency - Software Development & AI Solutions'
    }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "SoftStack Agency | Software Development & AI",
    description: "Expert software development, AI agents, and digital solutions.",
    images: ['/banner1.jpg']
  },
  alternates: {
    canonical: '/'
  }
};

async function getFaqs() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000/api'}/faqs`, {
      next: { revalidate: 3600 }
    });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data || json || [];
  } catch (err) {
    return [];
  }
}

async function getBannerData() {
  try {
    // We use a regular fetch here for SSR benefits
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000/api'}/banner/all`, {
      next: { revalidate: 3600 }
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data?.[0] || json?.[0] || null;
  } catch (err) {
    return null;
  }
}

export default async function Home() {
  const [faqs, bannerData] = await Promise.all([
    getFaqs(),
    getBannerData()
  ]);

  return (
    <div>
      {faqs.length > 0 && (
        <StructuredData data={generateFAQSchema(faqs)} />
      )}
      <HeroSection initialData={bannerData} />
      <AboutSection />
      <HomecardSection />
      <Testimonial />
      <FAQ initialFaqs={faqs} />
    </div>
  );
}