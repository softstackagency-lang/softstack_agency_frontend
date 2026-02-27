import AppDevelopment from '@/components/Services/AppDevelopment/AppDevelopment';

export const metadata = {
  title: 'Mobile App Development Services - iOS & Android Apps',
  description: 'Professional mobile app development services for iOS, Android, and cross-platform solutions. Flutter, React Native, Swift, Kotlin development. Custom mobile applications, enterprise apps, consumer apps, and progressive web apps with native performance and seamless user experience.',
  keywords: ["mobile app development", "iOS app development", "android app development", "cross-platform apps", "flutter development", "react native development", "swift development", "kotlin development", "native app development", "hybrid apps", "mobile application", "app design", "enterprise mobile apps", "consumer apps"],
  openGraph: {
    title: 'Mobile App Development Services | SoftStack Agency',
    description: 'Custom iOS and Android mobile app development using Flutter, React Native. Build cross-platform apps with native performance and great UX.',
    images: [{
      url: '/rendering-smart-home-device (1).jpg',
      width: 1200,
      height: 630,
      alt: 'Mobile App Development Services'
    }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mobile App Development | SoftStack',
    description: 'iOS and Android app development with Flutter and React Native.',
    images: ['/rendering-smart-home-device (1).jpg']
  },
  alternates: {
    canonical: '/app-development'
  }
};

export default function AppDevelopmentPage() {
  return <AppDevelopment />;
}