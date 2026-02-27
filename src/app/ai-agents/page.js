import AiAgent from '@/components/Services/Aiagent/AiAgent'

export const metadata = {
  title: "AI Agents & Machine Learning Solutions",
  description: "Transform your business with intelligent AI agents, machine learning solutions, natural language processing, computer vision, and automation. Custom AI development, chatbots, predictive analytics, and AI integration services by expert developers at SoftStack Agency.",
  keywords: ["AI agents", "artificial intelligence development", "machine learning solutions", "AI automation", "chatbot development", "NLP solutions", "computer vision", "AI integration", "intelligent agents", "conversational AI", "predictive analytics", "deep learning", "neural networks", "AI consulting"],
  openGraph: {
    title: "AI Agents & Machine Learning Solutions | SoftStack Agency",
    description: "Build intelligent AI agents and machine learning solutions. Custom AI development, automation, chatbots, and predictive analytics for business transformation.",
    images: [{
      url: '/app.jpg',
      width: 1200,
      height: 630,
      alt: 'AI Agents and Machine Learning Development'
    }]
  },
  twitter: {
    card: 'summary_large_image',
    title: "AI Agents & ML Solutions | SoftStack",
    description: "Intelligent AI agents and machine learning solutions for business automation.",
    images: ['/app.jpg']
  },
  alternates: {
    canonical: '/ai-agents'
  }
};

function page() {
  return (
    <div>
       <AiAgent />
        

    </div>
  )
}

export default page