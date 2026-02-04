'use client';

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { PlusCircle } from "lucide-react";
import { useCart } from "@/context/cart-context";
import type { Product } from "@/lib/data";

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  const placeholder = PlaceHolderImages.find(p => p.id === product.image.id);
  const { addToCart } = useCart();

  return (
    <Card className="overflow-hidden">
      <CardHeader className="p-0">
        <div className="relative aspect-square w-full">
            {placeholder && (
                <Image
                    src={placeholder.imageUrl}
                    alt={product.name}
                    fill
                    className="object-cover"
                    data-ai-hint={placeholder.imageHint}
                />
            )}
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <CardTitle className="text-lg font-semibold mb-1 truncate">{product.name}</CardTitle>
        <CardDescription className="text-xl font-bold text-primary">
          ₹{product.price.toFixed(2)}
        </CardDescription>
        <p className="text-xs text-muted-foreground mt-1">
          {product.soldBy === 'bag' ? `Per bag — ${(product as any).bagWeightKg?.toFixed?.(2) ?? '—'} kg` : `Weight — ${(product as any).weightKg?.toFixed?.(2) ?? '—'} kg`}
        </p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button className="w-full" variant="outline" onClick={() => addToCart(product.id)}>
          <PlusCircle className="mr-2 h-4 w-4" /> Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
}
