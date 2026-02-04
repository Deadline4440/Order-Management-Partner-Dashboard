'use client';

import Image from "next/image";
import { useCart } from "@/context/cart-context";
import { PageHeader } from "@/components/page-header";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { formatPrice } from "@/lib/utils";
import { user } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { PlaceHolderImages } from "@/lib/placeholder-images";

export default function CheckoutPage() {
  const { cart, subtotal, appliedSchemes, total, clearCart } = useCart();

  const handlePlaceOrder = () => {
    alert("Order placed successfully!");
    clearCart();
  };

  return (
    <div>
      <PageHeader
        title="Checkout"
        description="Review your order and place it."
      />

      {cart.length > 0 ? (
        <div className="grid gap-8 md:grid-cols-3">
          {/* LEFT SIDE */}
          <div className="md:col-span-2 grid gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Order Items</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                {cart.map((item) => {
                  const placeholder = PlaceHolderImages.find(
                    (p) => p.id === item.product.image.id
                  );

                  return (
                    <div
                      key={item.product.id}
                      className="flex items-center gap-4"
                    >
                      <div className="relative h-16 w-16 rounded-md overflow-hidden bg-muted">
                        {placeholder && (
                          <Image
                            src={placeholder.imageUrl}
                            alt={item.product.name}
                            fill
                            className="object-cover"
                          />
                        )}
                      </div>

                      <div className="flex-grow">
                        <p className="font-semibold">
                          {item.product.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {item.quantity} ×{" "}
                          {formatPrice(item.product.price)}
                        </p>
                      </div>

                      <p className="font-semibold">
                        {formatPrice(
                          item.product.price * item.quantity
                        )}
                      </p>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Shipping Details</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-2 text-sm">
                <p className="font-medium">{user.name}</p>
                <p className="text-muted-foreground">
                  Near Station Road, Lucknow, Uttar Pradesh, 226001
                </p>
              </CardContent>
            </Card>
          </div>

          {/* RIGHT SIDE */}
          <div className="grid gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>

              <CardContent className="flex flex-col gap-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>

                {appliedSchemes.length > 0 && (
                  <div className="flex flex-col gap-2">
                    {appliedSchemes.map((scheme) => (
                      <div
                        key={scheme.title}
                        className="flex justify-between items-center text-green-600"
                      >
                        <div className="flex items-center gap-2">
                          <Badge
                            variant="secondary"
                            className="text-nowrap"
                          >
                            {scheme.title}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {scheme.description}
                          </span>
                        </div>
                        <span>
                          - {formatPrice(scheme.discount)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                <Separator />

                <div className="flex justify-between font-bold text-base">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </CardContent>

              <CardFooter>
                <Button
                  className="w-full"
                  onClick={handlePlaceOrder}
                >
                  Place Order
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      ) : (
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-lg font-semibold">
              Your cart is empty.
            </p>
            <p className="text-muted-foreground">
              You can&apos;t proceed to checkout without any items.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
