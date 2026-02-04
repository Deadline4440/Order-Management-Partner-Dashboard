import { PageHeader } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { schemeRewards } from "@/lib/data";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import Image from "next/image";

export default function SchemesPage() {
  return (
    <div>
      <PageHeader
        title="Scheme Details"
      />
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {schemeRewards.map(reward => {
          const placeholder = PlaceHolderImages.find(p => p.id === reward.imageId);
          return (
            <Card key={reward.name}>
              <CardContent className="p-4 flex items-center gap-4">
                <div className="relative h-20 w-20 rounded-md overflow-hidden flex-shrink-0 bg-muted">
                  {placeholder && (
                    <Image
                      src={placeholder.imageUrl}
                      alt={reward.name}
                      fill
                      className="object-contain p-2"
                      data-ai-hint={placeholder.imageHint}
                    />
                  )}
                </div>
                <div>
                  <p className="font-semibold text-lg">{reward.name}</p>
                  <p className="text-muted-foreground font-bold">{reward.points} MT</p>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  );
}
