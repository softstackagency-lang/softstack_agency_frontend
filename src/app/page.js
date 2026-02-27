import AboutSection from "@/components/home/HomeCenter/centerSection";
import FAQ from "@/components/home/HomeFAQ/FAQ";
import HeroSection from "@/components/home/HomeHero/hero";
import HomecardSection from "@/components/home/HomeCards/homeCard";
import Testimonial from "@/components/home/HomeTestimonial/Testimonial";

export const metadata = {
  title: "Home",
  description: "SoftStack Agency - Your trusted partner for innovative software development, AI agents, mobile apps, web development, and e-commerce solutions. Transform your business with cutting-edge technology. Expert team delivering custom software, digital transformation, and enterprise solutions.",
  keywords: ["software development agency", "AI solutions", "web development services", "mobile app development", "e-commerce development", "custom software", "digital transformation", "enterprise software", "technology consulting", "MVP development", "startup solutions"],
  openGraph: {
    title: "SoftStack Agency | Leading Software Development & AI Solutions Company",
    description: "Transform your business with cutting-edge software development, AI agents, web apps, mobile solutions, and e-commerce platforms. Expert development team for digital transformation.",
    images: [{
      url: '/banner1.jpg',
      width: 1200,
      height: 630,
      alt: 'SoftStack Agency - Software Development & AI Solutions'
    }]
  },
  twitter: {
    card: 'summary_large_image',
    title: "SoftStack Agency | Leading Software Development",
    description: "Expert software development, AI agents, and digital solutions.",
    images: ['/banner1.jpg']
  },
  alternates: {
    canonical: '/'
  }
};

export default function Home() {
  return (
    <div >
     
      <HeroSection/>
      <AboutSection/>
      <HomecardSection/>
      <Testimonial/>
      <FAQ/>
    
      
    </div>
  );
}