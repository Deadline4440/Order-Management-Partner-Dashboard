'use client';

import { useCart } from "@/context/cart-context";
import { SheetHeader, SheetTitle, SheetFooter, SheetClose } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CartItem } from "./cart-item";
import { formatPrice } from "@/lib/utils";
import { Badge } from "../ui/badge";
import Link from "next/link";

export function Cart() {
    const { cart, subtotal, appliedSchemes, total, totalWeightKg } = useCart();

    return (
        <>
            <SheetHeader>
                <SheetTitle>Your Cart</SheetTitle>
            </SheetHeader>
            <Separator className="my-4" />
            {cart.length > 0 ? (
                <>
                <ScrollArea className="flex-grow pr-4 h-[calc(100vh-22rem)]">
                    <div className="flex flex-col gap-4">
                        {cart.map(item => <CartItem key={item.product.id} item={item} />)}
                    </div>
                </ScrollArea>
                <SheetFooter className="mt-auto">
                    <div className="flex flex-col gap-4 w-full text-sm mt-6">
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Subtotal</span>
                            <span>{formatPrice(subtotal)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Total weight</span>
                            <span>{totalWeightKg.toFixed(2)} kg</span>
                        </div>
                         {appliedSchemes.length > 0 && (
                            <div className="flex flex-col gap-2">
                                {appliedSchemes.map(scheme => (
                                    <div key={scheme.title} className="flex justify-between items-center text-green-600">
                                        <div className="flex items-center gap-2">
                                            <Badge variant="secondary" className="text-nowrap">{scheme.title}</Badge>
                                            <span className="text-xs text-muted-foreground">{scheme.description}</span>
                                        </div>
                                        <span>- {formatPrice(scheme.discount)}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                        <Separator />
                        <div className="flex justify-between font-bold text-base">
                            <span>Total</span>
                            <span>{formatPrice(total)}</span>
                        </div>
                        <SheetClose asChild>
                            <Button asChild className="w-full">
                                <Link href="/checkout">Proceed to Checkout</Link>
                            </Button>
                        </SheetClose>
                    </div>
                </SheetFooter>
                </>
            ) : (
                <div className="flex h-full flex-col items-center justify-center">
                    <p className="text-lg font-semibold">Your cart is empty</p>
                    <p className="text-sm text-muted-foreground">Add some products to get started!</p>
                </div>
            )}
        </>
    );
}
