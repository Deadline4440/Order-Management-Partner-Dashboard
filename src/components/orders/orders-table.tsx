"use client"
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { orders } from "@/lib/data"
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function OrdersTable() {
  return (
    <div className="border shadow-sm rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[180px]">Order ID</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead className="w-[100px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell className="font-medium">{order.id}</TableCell>
              <TableCell>{order.date}</TableCell>
              <TableCell>
                 <Badge variant={
                    order.status === 'Delivered' ? 'default' : 
                    order.status === 'Dispatched' ? 'secondary' : 'outline'
                 }
                 className={
                    order.status === 'Delivered' ? 'bg-green-600/80 text-white' : 
                    order.status === 'Placed' ? 'bg-blue-500/20 text-blue-700 border-blue-300' :
                    order.status === 'Packed' ? 'bg-yellow-500/20 text-yellow-700 border-yellow-300' : ''
                 }
                 >
                    {order.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right">₹{order.amount.toFixed(2)}</TableCell>
              <TableCell className="text-right">
                <Button asChild variant="ghost" size="icon">
                  <Link href={`/orders/${order.id}`}>
                    <ArrowRight className="h-4 w-4" />
                    <span className="sr-only">View Order</span>
                  </Link>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
