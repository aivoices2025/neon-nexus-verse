
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Calendar, Video, TrendingUp } from "lucide-react";

const stats = [
  {
    title: "Total Users",
    value: "12,847",
    change: "+12%",
    icon: Users,
    color: "text-blue-400"
  },
  {
    title: "Live Events",
    value: "24",
    change: "+3",
    icon: Video,
    color: "text-green-400"
  },
  {
    title: "This Month",
    value: "156",
    change: "+23%",
    icon: Calendar,
    color: "text-purple-400"
  },
  {
    title: "Engagement",
    value: "89%",
    change: "+7%",
    icon: TrendingUp,
    color: "text-cyan-400"
  }
];

export const DashboardStats = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        <Card key={index} className="bg-card/50 border-border/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className={`h-4 w-4 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-400">{stat.change}</span> from last month
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
