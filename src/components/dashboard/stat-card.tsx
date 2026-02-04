import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  IndianRupee,
  TrendingUp,
  BookText,
  AlertTriangle ,
  type LucideIcon,
} from "lucide-react";

const iconMap: { [key: string]: LucideIcon } = {
  IndianRupee,
  TrendingUp,
  BookText,
  AlertTriangle,
};

type StatCardProps = {
  title: string;
  value: string;
  change: string;
  icon: string;
};

export function StatCard({ title, value, change, icon }: StatCardProps) {
  const IconComponent = iconMap[icon];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {IconComponent && <IconComponent className="h-4 w-4 text-muted-foreground" />}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{change}</p>
      </CardContent>
    </Card>
  );
}
