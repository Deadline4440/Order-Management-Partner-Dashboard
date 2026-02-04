import { generateProductRecommendations } from "@/ai/flows/personalized-product-recommendations";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { aiPartnerData } from "@/lib/data";
import { Lightbulb, CheckCircle2 } from "lucide-react";

export async function AiRecommendations() {
  const { recommendations, reasoning } = await generateProductRecommendations(aiPartnerData);

  return (
    <Card className="bg-primary/5 border-primary/20">
      <CardHeader>
        <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Lightbulb className="h-6 w-6 text-primary" />
            </div>
            <div>
                <CardTitle className="text-xl text-primary">UCW-Powered Schemes</CardTitle>
                <CardDescription>New schemes to grow your business</CardDescription>
            </div>
        </div>
      </CardHeader>
      <CardContent className="grid gap-6">
        <div>
          <h3 className="font-semibold mb-2">Recommended Schemes:</h3>
          <ul className="grid gap-2">
            {recommendations.map((rec, index) => (
              <li key={index} className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 mt-0.5 text-green-600 flex-shrink-0" />
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="font-semibold mb-2">Reasoning:</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">{reasoning}</p>
        </div>
      </CardContent>
    </Card>
  );
}
