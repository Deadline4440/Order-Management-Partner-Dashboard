// src/ai/flows/personalized-product-recommendations.ts
'use server';

/**
 * @fileOverview An AI agent that generates personalized product recommendations for UCW partners.
 *
 * - generateProductRecommendations - A function that generates personalized product recommendations.
 * - ProductRecommendationsInput - The input type for the generateProductRecommendations function.
 * - ProductRecommendationsOutput - The return type for the generateProductRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ProductRecommendationsInputSchema = z.object({
  partnerId: z.string().describe('The ID of the UCW partner.'),
  customerDemographics: z.string().describe('Demographic information about the partner customer base.'),
  orderHistory: z.string().describe('The order history of the UCW partner.'),
  marketTrends: z.string().describe('Current market trends in the UCW partner region.'),
});
export type ProductRecommendationsInput = z.infer<typeof ProductRecommendationsInputSchema>;

const ProductRecommendationsOutputSchema = z.object({
  recommendations: z.array(z.string()).describe('A list of personalized product recommendations for the UCW partner.'),
  reasoning: z.string().describe('The reasoning behind the product recommendations.'),
});
export type ProductRecommendationsOutput = z.infer<typeof ProductRecommendationsOutputSchema>;

export async function generateProductRecommendations(input: ProductRecommendationsInput): Promise<ProductRecommendationsOutput> {
  return personalizedProductRecommendationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'personalizedProductRecommendationsPrompt',
  input: {schema: ProductRecommendationsInputSchema},
  output: {schema: ProductRecommendationsOutputSchema},
  prompt: `You are an AI assistant specializing in generating personalized product recommendations for UCW partners.

  Based on the partner's customer demographics, order history, and current market trends, provide a list of product recommendations that are likely to be successful for the partner.

  Customer Demographics: {{{customerDemographics}}}
  Order History: {{{orderHistory}}}
  Market Trends: {{{marketTrends}}}

  Partner ID: {{{partnerId}}}

  Format your response as a list of product recommendations, followed by a brief explanation of the reasoning behind the recommendations.
  `,
});

const personalizedProductRecommendationsFlow = ai.defineFlow(
  {
    name: 'personalizedProductRecommendationsFlow',
    inputSchema: ProductRecommendationsInputSchema,
    outputSchema: ProductRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
