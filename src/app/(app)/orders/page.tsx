import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { OrdersTable } from "@/components/orders/orders-table";

export default function OrdersPage() {
  return (
    <div>
      <PageHeader
        title="My Orders"
        description="Track and manage all your orders in one place."
      >
        <Button asChild className="bg-accent hover:bg-accent/90">
            <Link href="/products">
                <PlusCircle className="mr-2 h-4 w-4" />
                Place New Order
            </Link>
        </Button>
      </PageHeader>
      
      <OrdersTable />
    </div>
  );
}
