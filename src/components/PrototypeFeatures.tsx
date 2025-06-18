
import { FeaturePlaceholder } from "./FeaturePlaceholder";
import { 
  Headphones, 
  Users, 
  Smartphone, 
  MessageCircle, 
  Share2, 
  Shield,
  Zap,
  Globe
} from "lucide-react";

export const PrototypeFeatures = () => {
  const features = [
    {
      title: "VR Audio System",
      description: "Spatial audio with real-time voice processing",
      icon: Headphones,
      status: "beta" as const,
      features: [
        "3D spatial audio positioning",
        "Noise cancellation",
        "Voice effects & filters",
        "Multi-language support"
      ]
    },
    {
      title: "Avatar System",
      description: "Customizable 3D avatars with expressions",
      icon: Users,
      status: "coming-soon" as const,
      features: [
        "Custom avatar creation",
        "Facial expression tracking",
        "Gesture recognition",
        "Outfit customization"
      ]
    },
    {
      title: "Mobile VR Support",
      description: "Optimized experience for mobile devices",
      icon: Smartphone,
      status: "active" as const,
      features: [
        "WebXR mobile compatibility",
        "Touch gesture controls",
        "Battery optimization",
        "Adaptive quality settings"
      ]
    },
    {
      title: "AI Chat Moderation",
      description: "Smart content filtering and community management",
      icon: MessageCircle,
      status: "beta" as const,
      features: [
        "Real-time content filtering",
        "Sentiment analysis",
        "Automatic translations",
        "Community guidelines enforcement"
      ]
    },
    {
      title: "Social Sharing",
      description: "Share moments and invite friends",
      icon: Share2,
      status: "coming-soon" as const,
      features: [
        "Screenshot & video capture",
        "Social media integration",
        "Friend invitation system",
        "Event highlights reel"
      ]
    },
    {
      title: "Security & Privacy",
      description: "End-to-end encryption and privacy controls",
      icon: Shield,
      status: "active" as const,
      features: [
        "End-to-end encryption",
        "Privacy settings",
        "Secure payment processing",
        "Data anonymization"
      ]
    },
    {
      title: "Performance Analytics",
      description: "Real-time metrics and optimization",
      icon: Zap,
      status: "beta" as const,
      features: [
        "Real-time performance monitoring",
        "Bandwidth optimization",
        "Device compatibility checks",
        "Quality adaptation"
      ]
    },
    {
      title: "Global CDN",
      description: "Worldwide content delivery network",
      icon: Globe,
      status: "active" as const,
      features: [
        "Global server network",
        "Low-latency streaming",
        "Regional content caching",
        "Automatic failover"
      ]
    }
  ];

  return (
    <section className="mb-12">
      <div className="text-center mb-8">
        <h3 className="text-3xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
          Platform Features
        </h3>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Explore the cutting-edge features that make MetaVerse Live the ultimate platform for virtual events and social experiences.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {features.map((feature, index) => (
          <FeaturePlaceholder
            key={index}
            {...feature}
            onLearnMore={() => console.log(`Learn more about ${feature.title}`)}
          />
        ))}
      </div>
    </section>
  );
};
