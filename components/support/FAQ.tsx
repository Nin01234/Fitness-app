"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"

// Define types for FAQ items
interface FAQItem {
  question: string;
  answer: string;
  category?: string; // Add optional category property to FAQItem
}

// For the filtered FAQ items, create an extended interface
interface FilteredFAQItem extends FAQItem {
  category: string; // Category is required in filtered items
}

// Define type for FAQ categories
interface FAQCategories {
  account: FAQItem[];
  workouts: FAQItem[];
  nutrition: FAQItem[];
  premium: FAQItem[];
  technical: FAQItem[];
  [key: string]: FAQItem[]; // Add index signature to allow string indexing
}

// FAQ data with categories
const faqData: FAQCategories = {
  account: [
    {
      question: "How do I reset my password?",
      answer: "Go to the login page and click 'Forgot Password'. Enter your email address and follow the instructions sent to your email to reset your password."
    },
    {
      question: "Can I change my email address?",
      answer: "Yes. Go to Profile Settings, select 'Account Details', and update your email. You'll need to verify the new email address before the change takes effect."
    },
    {
      question: "How do I delete my account?",
      answer: "To delete your account, go to Profile Settings, scroll down to 'Account Management', and select 'Delete Account'. Please note this action is permanent and will remove all your data."
    }
  ],
  workouts: [
    {
      question: "How do I create a custom workout plan?",
      answer: "Navigate to the Workouts tab, click 'Create New Plan', select your fitness goals, preferred workout frequency, and available equipment. Our algorithm will generate a personalized plan that you can further customize."
    },
    {
      question: "Can I track workouts without internet connection?",
      answer: "Yes, FitLife works in offline mode. Your workout data will be stored locally and synced with our servers once you're connected to the internet again."
    },
    {
      question: "How do I share my workout progress?",
      answer: "After completing a workout, tap the share icon on the workout summary screen. You can share your achievements to social media or directly with friends who use FitLife."
    }
  ],
  nutrition: [
    {
      question: "How accurate is the calorie tracking?",
      answer: "Our calorie database is updated regularly and contains over 1 million food items. The accuracy depends on correct portion sizes and honest logging. For packaged foods, you can scan barcodes for precise nutritional information."
    },
    {
      question: "Can I set custom macronutrient goals?",
      answer: "Absolutely. Go to Nutrition > Goals > Custom Macros to set specific targets for proteins, carbs, and fats based on your dietary preferences and fitness goals."
    },
    {
      question: "Does the app support different diets?",
      answer: "Yes, FitLife supports various dietary preferences including keto, paleo, vegetarian, vegan, and more. Configure your diet type in Profile Settings > Nutrition Preferences."
    }
  ],
  premium: [
    {
      question: "What features are included in Premium?",
      answer: "Premium includes advanced analytics, personalized coaching, exclusive workout plans, meal planning tools, priority support, ad-free experience, and unlimited workout history."
    },
    {
      question: "How do I cancel my Premium subscription?",
      answer: "Go to Profile Settings > Subscription Management > Cancel Subscription. Your premium features will remain active until the end of your current billing period."
    },
    {
      question: "Is there a refund policy for Premium?",
      answer: "We offer a 14-day money-back guarantee for new Premium subscribers. Contact our support team within 14 days of purchase if you're not satisfied for a full refund."
    }
  ],
  technical: [
    {
      question: "Which fitness trackers are compatible with FitLife?",
      answer: "FitLife integrates with most major fitness trackers including Fitbit, Garmin, Apple Watch, Samsung Galaxy Watch, and devices using Google Fit or Apple Health."
    },
    {
      question: "My workout isn't syncing correctly, what should I do?",
      answer: "First, ensure both devices have an internet connection. Go to Settings > Connections and try disconnecting and reconnecting your tracker. If problems persist, try reinstalling the app or contact our support team."
    },
    {
      question: "How can I export my fitness data?",
      answer: "Go to Profile Settings > Data Management > Export Data. You can choose to export your data in CSV or JSON format, and select which data types to include (workouts, nutrition, body measurements, etc.)."
    }
  ]
}

export function FAQ() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState<keyof FAQCategories | null>(null)
  
  // Filter FAQ items based on search query
  const filteredFAQs: FilteredFAQItem[] = Object.entries(faqData)
    .flatMap(([category, items]) => 
      items
        .filter(item => 
          item.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
          item.answer.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .map(item => ({ ...item, category })) // Add category property to each item
    )
  
  // Group FAQ items by category after filtering
  const groupedFilteredFAQs = filteredFAQs.reduce<Record<string, typeof filteredFAQs>>((acc, item) => {
    const category = item.category as string
    if (!acc[category]) {
      acc[category] = []
    }
    acc[category].push(item)
    return acc
  }, {})
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Frequently Asked Questions</CardTitle>
          <CardDescription>Find answers to common questions about FitLife</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative mb-6">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search for answers..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          {/* Category filters */}
          {!searchQuery && (
            <div className="flex flex-wrap gap-2 mb-6">
              <Button
                variant={activeCategory === null ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveCategory(null)}
              >
                All
              </Button>
              {Object.keys(faqData).map((category) => (
                <Button
                  key={category}
                  variant={activeCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveCategory(category as keyof FAQCategories)}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </Button>
              ))}
            </div>
          )}
          
          {/* Display FAQs */}
          {searchQuery ? (
            // Display search results
            filteredFAQs.length > 0 ? (
              <Accordion type="single" collapsible className="w-full">
                {filteredFAQs.map((item: FilteredFAQItem, index: number) => (
                  <AccordionItem key={`search-${index}`} value={`search-${index}`}>
                    <AccordionTrigger>
                      <div className="text-left">
                        <span className="font-medium">{item.question}</span>
                        <div className="text-xs text-muted-foreground mt-1">
                          Category: {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <p className="text-muted-foreground">{item.answer}</p>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            ) : (
              <div className="text-center py-6">
                <p className="text-muted-foreground">No results found for "{searchQuery}"</p>
                <Button
                  variant="link"
                  onClick={() => setSearchQuery("")}
                  className="mt-2"
                >
                  Clear search
                </Button>
              </div>
            )
          ) : (
            // Display categorized FAQs
            Object.entries(
              activeCategory !== null 
                ? { [activeCategory]: faqData[activeCategory] } 
                : faqData
            ).map(([category, items]) => (
              <div key={category} className="mb-6">
                <h3 className="text-lg font-semibold mb-3 capitalize">
                  {category}
                </h3>
                <Accordion type="single" collapsible className="w-full">
                  {items.map((item: FAQItem, index: number) => (
                    <AccordionItem key={`${category}-${index}`} value={`${category}-${index}`}>
                      <AccordionTrigger>
                        <span className="font-medium">{item.question}</span>
                      </AccordionTrigger>
                      <AccordionContent>
                        <p className="text-muted-foreground">{item.answer}</p>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            ))
          )}
        </CardContent>
      </Card>
      
      <div className="text-center">
        <p className="text-muted-foreground mb-2">Can't find what you're looking for?</p>
        <Button variant="default">Contact Support</Button>
      </div>
    </div>
  )
} 