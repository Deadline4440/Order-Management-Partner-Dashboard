'use client';
import Image from "next/image";
import { useCart } from "@/context/cart-context";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@/lib/data";

type CartItemProps = {
    item: {
        product: Product;
        quantity: number;
    }
}

export function CartItem({ item }: CartItemProps) {
    const { removeFromCart, updateQuantity } = useCart();
    const placeholder = PlaceHolderImages.find(p => p.id === item.product.image.id);

    return (
        <div className="flex items-start gap-4">
            <div className="relative h-20 w-20 rounded-md overflow-hidden flex-shrink-0 bg-muted">
                {placeholder && (
                    <Image 
                        src={placeholder.imageUrl}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                    />
                )}
            </div>
            <div className="flex-grow grid gap-1 text-sm">
                <p className="font-semibold">{item.product.name}</p>
                <p className="text-muted-foreground">{formatPrice(item.product.price)}</p>
                {/* Weight info */}
                <p className="text-xs text-muted-foreground">
                    {(() => {
                        const perUnit = item.product.soldBy === 'bag' ? (item.product as any).bagWeightKg ?? 0 : (item.product as any).weightKg ?? 0;
                        const line = perUnit * item.quantity;
                        const label = item.product.soldBy === 'bag' ? 'bag' : 'unit';
                        return `${item.quantity} ${label}${item.quantity>1? 's':''} × ${perUnit.toFixed(2)} kg = ${line.toFixed(2)} kg`;
                    })()}
                </p>
                <div className="flex items-center gap-2 mt-2">
                    <Button 
                        variant="outline"
                        size="icon" 
                        className="h-7 w-7"
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        >
                            -
                    </Button>
                    <Input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => updateQuantity(item.product.id, parseInt(e.target.value, 10) || 0)}
                        className="h-7 w-12 text-center p-0"
                    />
                     <Button 
                        variant="outline" 
                        size="icon" 
                        className="h-7 w-7"
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        >
                            +
                    </Button>
                </div>
            </div>
            <div className="flex flex-col items-end gap-1 text-sm">
                 <p className="font-semibold">{formatPrice(item.product.price * item.quantity)}</p>
                 <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground" onClick={() => removeFromCart(item.product.id)}>
                    <X className="h-4 w-4" />
                    <span className="sr-only">Remove item</span>
                </Button>
            </div>
        </div>
    )
}
