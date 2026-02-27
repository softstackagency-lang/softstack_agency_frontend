import TeamSection from '@/components/team/TeamSection';

export const metadata = {
  title: 'Our Expert Development Team | Meet Our Professionals',
  description: 'Meet the talented software engineers, AI specialists, designers, and developers behind SoftStack Agency. Our expert team of full-stack developers, mobile app developers, UI/UX designers, and AI engineers delivers innovative solutions in web development, artificial intelligence, mobile applications, and digital transformation.',
  keywords: ["development team", "software engineers", "expert developers", "AI specialists", "full-stack developers", "mobile developers", "UI/UX designers", "tech team", "engineering team", "development professionals", "expert programmers"],
  openGraph: {
    title: 'Our Expert Team | SoftStack Agency',
    description: 'Meet our talented team of software engineers, AI specialists, and designers delivering innovative digital solutions.',
    images: [{
      url: '/image-1.jpg',
      width: 1200,
      height: 630,
      alt: 'SoftStack Agency Development Team'
    }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Our Team | SoftStack',
    description: 'Expert developers, designers, and AI specialists building innovative solutions.',
    images: ['/image-1.jpg']
  },
  alternates: {
    canonical: '/team'
  }
};

export default function TeamPage() {
  return (
    <div className="min-h-screen bg-slate-900">
      <TeamSection />
    </div>
  );
}