import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function PremiumFaq() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold">Frequently Asked Questions</h2>
        <p className="mt-2 text-muted-foreground">Find answers to common questions about FitLife Premium</p>
      </div>

      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-1">
          <AccordionTrigger>What is FitLife Premium?</AccordionTrigger>
          <AccordionContent>
            FitLife Premium is our subscription service that unlocks advanced features to enhance your fitness journey.
            It includes advanced analytics, custom workout plans, nutrition meal planning, AI workout recommendations,
            priority support, and an ad-free experience.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-2">
          <AccordionTrigger>How much does Premium cost?</AccordionTrigger>
          <AccordionContent>
            FitLife Premium costs $9.99 per month with our monthly plan. You can save 20% by subscribing to our annual
            plan at $95.88 per year (equivalent to $7.99 per month).
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-3">
          <AccordionTrigger>Can I cancel my subscription anytime?</AccordionTrigger>
          <AccordionContent>
            Yes, you can cancel your Premium subscription at any time. If you cancel, you'll continue to have access to
            Premium features until the end of your current billing period. We don't provide partial refunds for unused
            periods.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-4">
          <AccordionTrigger>Is there a free trial?</AccordionTrigger>
          <AccordionContent>
            Yes, we offer a 14-day free trial of FitLife Premium. You can explore all Premium features during this
            period. We'll send you a reminder before your trial ends, and you won't be charged if you cancel before the
            trial period is over.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-5">
          <AccordionTrigger>What payment methods do you accept?</AccordionTrigger>
          <AccordionContent>
            We accept all major credit cards (Visa, Mastercard, American Express, Discover), PayPal, and Apple Pay. For
            annual subscriptions, we also offer payment via bank transfer in select countries.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-6">
          <AccordionTrigger>How do I upgrade to Premium?</AccordionTrigger>
          <AccordionContent>
            You can upgrade to Premium by clicking the "Upgrade Now" button on this page. You'll be guided through the
            subscription process, including selecting your preferred plan and entering your payment information.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-7">
          <AccordionTrigger>What happens to my data if I cancel Premium?</AccordionTrigger>
          <AccordionContent>
            If you cancel your Premium subscription, you'll still have access to all your data. However, you'll lose
            access to Premium features and analytics. Your workout history, progress photos, and basic tracking will
            remain available in the free version.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-8">
          <AccordionTrigger>Is there a family or group plan available?</AccordionTrigger>
          <AccordionContent>
            Yes, we offer a Family Plan that allows up to 5 family members to enjoy Premium benefits at a discounted
            rate of $19.99 per month. We also offer special rates for fitness professionals and gym owners. Please
            contact our sales team for more information.
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <div className="mt-8 text-center">
        <p className="mb-4">Still have questions?</p>
        <Button variant="outline" asChild>
          <Link href="/help/contact">Contact Support</Link>
        </Button>
      </div>
    </div>
  )
}

