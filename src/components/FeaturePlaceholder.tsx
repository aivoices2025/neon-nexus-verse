
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LucideIcon } from "lucide-react";

interface FeaturePlaceholderProps {
  title: string;
  description: string;
  icon: LucideIcon;
  status: "coming-soon" | "beta" | "active";
  features: string[];
  onLearnMore?: () => void;
}

export const FeaturePlaceholder = ({ 
  title, 
  description, 
  icon: Icon, 
  status, 
  features,
  onLearnMore 
}: FeaturePlaceholderProps) => {
  const statusColors = {
    "coming-soon": "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    "beta": "bg-blue-500/20 text-blue-400 border-blue-500/30",
    "active": "bg-green-500/20 text-green-400 border-green-500/30"
  };

  return (
    <Card className="bg-card/50 border-border/30 hover:neon-glow transition-all duration-300">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-primary/20">
              <Icon className="w-6 h-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">{title}</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">{description}</p>
            </div>
          </div>
          <Badge variant="outline" className={statusColors[status]}>
            {status.replace("-", " ").toUpperCase()}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-3">
          <div>
            <h4 className="text-sm font-medium mb-2">Key Features:</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              {features.map((feature, index) => (
                <li key={index} className="flex items-center">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full mr-2"></span>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
          
          {onLearnMore && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onLearnMore}
              className="w-full border-border/30 hover:neon-glow"
            >
              Learn More
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
