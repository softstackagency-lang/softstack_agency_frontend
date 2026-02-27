import TrackOrderComponent from "@/components/order/TrackOrderComponent";

export const metadata = {
  title: "Track Your Order - Order Status & Tracking",
  description: "Track your software development project, service order, or product delivery status in real-time. Monitor project progress, milestones, and get updates on your SoftStack Agency order. Secure order tracking system.",
  keywords: ["track order", "order tracking", "project tracking", "order status", "delivery tracking", "project progress", "order updates"],
  openGraph: {
    title: "Track Your Order | SoftStack Agency",
    description: "Track your project or order status in real-time. Monitor progress and get updates.",
    images: [{
      url: '/banner1.jpg',
      width: 1200,
      height: 630,
      alt: 'Track Your Order'
    }]
  },
  robots: {
    index: false,
    follow: false
  },
  alternates: {
    canonical: '/track-order'
  }
};

export default function TrackOrderPage() {
  return <TrackOrderComponent />;
}

