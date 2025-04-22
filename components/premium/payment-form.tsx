"use client"

import React, { useState } from 'react'
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { 
  CreditCard, 
  CheckCircle2,
  Shield,
  CreditCard as CreditCardIcon,
  Calendar,
  User,
  LockKeyhole,
  Check
} from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'
import { Checkbox } from "@/components/ui/checkbox"

// Custom PayPal icon
function PaypalIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M7 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" />
      <path d="M11 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" />
      <path d="M9 20a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" />
      <path d="M13 20a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" />
    </svg>
  )
}

// Custom Apple Pay icon
function AppleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12 20.94c1.5 0 2.75 1.06 4 1.06 3 0 6-8 6-12.22A4.91 4.91 0 0 0 17 5c-2.22 0-4 1.44-5 2-1-.56-2.78-2-5-2a4.9 4.9 0 0 0-5 4.78C2 14 5 22 8 22c1.25 0 2.5-1.06 4-1.06Z" />
      <path d="M10 2c1 .5 2 2 2 5" />
    </svg>
  )
}

// Custom Google Pay icon
function GooglePayIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h10" />
      <path d="M12 2v10" />
      <path d="m4.93 4.93 4.24 4.24" />
      <path d="m14.83 9.17 4.24 4.24" />
      <path d="m14.83 14.83-4.24 4.24" />
    </svg>
  )
}

// Plan details for subscription options
const plans = [
  {
    id: 'monthly',
    name: 'Monthly',
    price: '$9.99',
    description: 'Billed monthly',
    billingCycle: 'Monthly',
    features: [
      'All premium features',
      'Cancel anytime',
      'Basic support',
    ]
  },
  {
    id: 'quarterly',
    name: 'Quarterly',
    price: '$24.99',
    originalPrice: '$29.97',
    description: 'Billed every 3 months',
    billingCycle: 'Every 3 months',
    savings: 'Save 16%',
    features: [
      'All premium features',
      'Cancel anytime',
      'Priority support',
      '1 free personal training session',
    ]
  },
  {
    id: 'annual',
    name: 'Annual',
    price: '$89.99',
    originalPrice: '$119.88',
    description: 'Billed annually',
    billingCycle: 'Yearly',
    savings: 'Save 25%',
    features: [
      'All premium features',
      'Cancel anytime',
      'Premium support',
      '4 free personal training sessions',
      'Exclusive content',
    ],
    recommended: true
  }
]

interface PaymentFormProps {
  onSuccess: (plan: string, paymentMethod: string) => void
}

export function PaymentForm({ onSuccess }: PaymentFormProps) {
  const [selectedPlan, setSelectedPlan] = useState(plans[2].id)
  const [paymentMethod, setPaymentMethod] = useState('credit-card')
  const [cardDetails, setCardDetails] = useState({
    number: '',
    name: '',
    expiry: '',
    cvc: ''
  })
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const [loading, setLoading] = useState(false)

  // Generate year options for expiry date
  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 10 }, (_, i) => currentYear + i)
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!agreedToTerms) {
      alert("Please agree to the terms and conditions")
      return
    }
    
    if (cardDetails.number.length < 16 || !cardDetails.expiry || cardDetails.cvc.length < 3 || !cardDetails.name) {
      alert("Please fill out all payment details")
      return
    }
    
    setLoading(true)
    
    // Simulate payment processing
    setTimeout(() => {
      // Call the success callback with the selected plan and payment method
      onSuccess(selectedPlan, paymentMethod)
      setLoading(false)
    }, 2000)
  }
  
  // Format credit card number with spaces
  const formatCardNumber = (value: string) => {
    const val = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
    const matches = val.match(/\d{4,16}/g)
    const match = matches && matches[0] || ""
    const parts = []
    
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }
    
    if (parts.length) {
      return parts.join(" ")
    } else {
      return value
    }
  }
  
  // Handle card number input change with formatting
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^\d]/g, '')
    setCardDetails({
      ...cardDetails,
      number: formatCardNumber(value)
    })
  }
  
  // Format expiry date with slash
  const formatExpiryDate = (value: string) => {
    const val = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
    
    if (val.length > 2) {
      return val.slice(0, 2) + "/" + val.slice(2, 4)
    }
    
    return val
  }
  
  // Handle expiry date input change with formatting
  const handleExpiryDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
    setCardDetails({
      ...cardDetails,
      expiry: formatExpiryDate(value)
    })
  }
  
  // Handle security code input change
  const handleSecurityCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow numbers and limit to 4 digits
    const val = e.target.value.replace(/\D/g, "").substring(0, 4)
    setCardDetails({
      ...cardDetails,
      cvc: val
    })
  }
  
  // Get the selected plan details
  const selectedPlanDetails = plans.find(plan => plan.id === selectedPlan) || plans[0]

  return (
    <div className="space-y-6">
      {/* Plan Selection */}
      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle>Choose your subscription plan</CardTitle>
          <CardDescription>Select the plan that works best for you</CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup 
            value={selectedPlan} 
            onValueChange={setSelectedPlan}
            className="grid gap-4 md:grid-cols-3"
          >
            {plans.map((plan) => (
              <div key={plan.id} className="relative">
                <RadioGroupItem
                  value={plan.id}
                  id={plan.id}
                  className="peer sr-only"
                />
                <Label
                  htmlFor={plan.id}
                  className={`
                    flex flex-col h-full p-4 rounded-lg border-2 hover:border-primary cursor-pointer
                    ${plan.recommended ? 'border-primary bg-primary/5' : 'border-muted peer-checked:border-primary'}
                  `}
                >
                  {plan.recommended && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground text-xs py-1 px-3 rounded-full">
                      Best Value
                    </div>
                  )}
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="font-semibold">{plan.name}</div>
                      <div className="text-sm text-muted-foreground">{plan.description}</div>
                    </div>
                    {plan.savings && (
                      <span className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 text-xs px-2 py-1 rounded">
                        {plan.savings}
                      </span>
                    )}
                  </div>
                  <div className="mb-4 font-bold text-xl flex items-baseline">
                    {plan.price}
                    {plan.originalPrice && (
                      <span className="ml-2 text-sm line-through text-muted-foreground">
                        {plan.originalPrice}
                      </span>
                    )}
                  </div>
                  <ul className="space-y-1 text-sm flex-grow mb-4">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </Label>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Payment Method Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Method</CardTitle>
          <CardDescription>Choose how you'd like to pay</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="credit-card" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="credit-card" onClick={() => setPaymentMethod('credit-card')}>
                <CreditCard className="mr-2 h-4 w-4" /> Card
              </TabsTrigger>
              <TabsTrigger value="paypal" onClick={() => setPaymentMethod('paypal')}>
                <PaypalIcon className="mr-2 h-4 w-4" /> PayPal
              </TabsTrigger>
              <TabsTrigger value="apple-pay" onClick={() => setPaymentMethod('apple-pay')}>
                <AppleIcon className="mr-2 h-4 w-4" /> Apple Pay
              </TabsTrigger>
              <TabsTrigger value="google-pay" onClick={() => setPaymentMethod('google-pay')}>
                <GooglePayIcon className="mr-2 h-4 w-4" /> Google Pay
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="credit-card" className="space-y-4 mt-4">
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="card-number" className="flex items-center">
                        <CreditCardIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                        Card Number
                      </Label>
                      <Input
                        id="card-number"
                        placeholder="1234 5678 9012 3456"
                        value={cardDetails.number}
                        onChange={handleCardNumberChange}
                        required
                        maxLength={19}
                        className="font-mono"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="name" className="flex items-center">
                        <User className="mr-2 h-4 w-4 text-muted-foreground" />
                        Name on Card
                      </Label>
                      <Input 
                        id="name" 
                        placeholder="John Smith" 
                        value={cardDetails.name}
                        onChange={(e) => setCardDetails({...cardDetails, name: e.target.value})}
                        required
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="expiry" className="flex items-center">
                          <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                          Expiry Date
                        </Label>
                        <div className="grid grid-cols-2 gap-2">
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="MM" />
                            </SelectTrigger>
                            <SelectContent>
                              {Array.from({ length: 12 }, (_, i) => {
                                const month = i + 1
                                return (
                                  <SelectItem key={month} value={month.toString().padStart(2, '0')}>
                                    {month.toString().padStart(2, '0')}
                                  </SelectItem>
                                )
                              })}
                            </SelectContent>
                          </Select>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="YY" />
                            </SelectTrigger>
                            <SelectContent>
                              {years.map(year => (
                                <SelectItem key={year} value={year.toString().slice(-2)}>
                                  {year}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="cvc" className="flex items-center">
                          <LockKeyhole className="mr-2 h-4 w-4 text-muted-foreground" />
                          CVC
                        </Label>
                        <Input 
                          id="cvc" 
                          placeholder="123" 
                          maxLength={4}
                          value={cardDetails.cvc}
                          onChange={handleSecurityCodeChange}
                          required
                          className="font-mono"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </TabsContent>
            
            <TabsContent value="paypal" className="mt-4">
              <div className="flex flex-col items-center justify-center py-8 border-2 border-dashed rounded-lg">
                <PaypalIcon className="h-16 w-16 text-blue-500 mb-4" />
                <p className="text-center">Continue with PayPal to complete your purchase securely.</p>
                <Button className="mt-4 bg-blue-600 hover:bg-blue-700">
                  Continue with PayPal
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="apple-pay" className="mt-4">
              <div className="flex flex-col items-center justify-center py-8 border-2 border-dashed rounded-lg">
                <AppleIcon className="h-16 w-16 mb-4" />
                <p className="text-center">Pay quickly and securely with Apple Pay.</p>
                <Button className="mt-4 bg-black hover:bg-gray-800 text-white">
                  Pay with Apple Pay
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="google-pay" className="mt-4">
              <div className="flex flex-col items-center justify-center py-8 border-2 border-dashed rounded-lg">
                <GooglePayIcon className="h-16 w-16 text-primary mb-4" />
                <p className="text-center">Pay quickly and securely with Google Pay.</p>
                <Button className="mt-4">
                  Pay with Google Pay
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="flex justify-between items-center w-full p-4 bg-muted/50 rounded-lg">
            <div>
              <div className="font-medium">Total amount</div>
              <div className="text-sm text-muted-foreground">{selectedPlanDetails.billingCycle} payment</div>
            </div>
            <div className="text-xl font-bold">{selectedPlanDetails.price}</div>
          </div>
          
          <div className="text-sm text-muted-foreground flex items-center">
            <Shield className="h-4 w-4 mr-2" />
            Your payment information is secure and encrypted
          </div>
          
          <div className="flex items-center space-x-2 pt-2">
            <Checkbox 
              id="terms" 
              checked={agreedToTerms}
              onCheckedChange={(checked) => setAgreedToTerms(checked === true)}
            />
            <label
              htmlFor="terms"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              I agree to the{" "}
              <a href="#" className="text-primary underline">
                terms and conditions
              </a>
            </label>
          </div>
          
          <Button 
            className="w-full bg-primary hover:bg-primary/90" 
            size="lg"
            onClick={handleSubmit}
            disabled={loading || !agreedToTerms}
          >
            {loading ? (
              <>Processing...</>
            ) : (
              <>
                Subscribe Now - {selectedPlanDetails.price}
                <Check className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
          
          <div className="text-center text-xs text-muted-foreground">
            By clicking "Subscribe Now", you agree to our Terms of Service and Privacy Policy.
            You can cancel your subscription anytime.
          </div>
        </CardFooter>
      </Card>
    </div>
  )
} 