import { cn } from "@/lib/utils";
import { CheckCircle, Circle, Package, Truck } from "lucide-react";

type OrderStatusProps = {
  status: 'Placed' | 'Packed' | 'Dispatched' | 'Delivered';
  className?: string;
};

const statusSteps = [
  { name: 'Placed', icon: CheckCircle },
  { name: 'Packed', icon: Package },
  { name: 'Dispatched', icon: Truck },
  { name: 'Delivered', icon: CheckCircle },
];

export function OrderStatus({ status, className }: OrderStatusProps) {
  const currentStatusIndex = statusSteps.findIndex(step => step.name === status);

  return (
    <div className={cn("flex items-center", className)}>
      {statusSteps.map((step, index) => {
        const isActive = index <= currentStatusIndex;
        const isCompleted = index < currentStatusIndex;
        const Icon = step.icon;

        return (
          <React.Fragment key={step.name}>
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-full border-2",
                  isActive ? "bg-primary border-primary text-primary-foreground" : "bg-muted border-border"
                )}
              >
                <Icon className="h-5 w-5" />
              </div>
              <p className={cn("mt-2 text-xs", isActive ? "font-semibold text-foreground" : "text-muted-foreground")}>
                {step.name}
              </p>
            </div>
            {index < statusSteps.length - 1 && (
              <div
                className={cn(
                  "flex-1 h-1 mx-2",
                  isCompleted ? "bg-primary" : "bg-border"
                )}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
