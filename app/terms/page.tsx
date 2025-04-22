import React from "react"
import Link from "next/link"
import { Metadata } from "next"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChevronRight, FileText, Shield, Info, Lock, UserPlus } from "lucide-react"

export const metadata: Metadata = {
  title: "Terms and Conditions | FitLife Pro",
  description: "Terms and conditions, privacy policy, and legal information for FitLife Pro",
}

export default function TermsPage() {
  return (
    <div className="container max-w-5xl py-10">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Terms and Conditions</h1>
        <p className="text-muted-foreground">
          Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>
      
      <Tabs defaultValue="terms" className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-8">
          <TabsTrigger value="terms">Terms of Service</TabsTrigger>
          <TabsTrigger value="privacy">Privacy Policy</TabsTrigger>
          <TabsTrigger value="data">Data Processing</TabsTrigger>
          <TabsTrigger value="cookies">Cookie Policy</TabsTrigger>
        </TabsList>
        
        <TabsContent value="terms">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                <CardTitle>Terms of Service</CardTitle>
              </div>
              <CardDescription>
                Please read these terms carefully before using FitLife Pro
              </CardDescription>
            </CardHeader>
            <CardContent className="prose prose-sm dark:prose-invert max-w-none">
              <h3>1. Acceptance of Terms</h3>
              <p>
                By accessing or using FitLife Pro ("the Service"), you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you do not have permission to access the Service.
              </p>
              
              <h3>2. Description of Service</h3>
              <p>
                FitLife Pro is a fitness and nutrition tracking application that helps users monitor their workout routines, meal plans, progress, and provides AI-powered recommendations for fitness goals. The Service may include premium features that require a paid subscription.
              </p>
              
              <h3>3. User Accounts</h3>
              <p>
                When you create an account with us, you guarantee that the information you provide is accurate, complete, and current at all times. Inaccurate, incomplete, or obsolete information may result in the immediate termination of your account on the Service.
              </p>
              <p>
                You are responsible for maintaining the confidentiality of your account and password, including but not limited to the restriction of access to your computer and/or account. You agree to accept responsibility for any and all activities or actions that occur under your account and/or password.
              </p>
              
              <h3>4. Subscription Terms</h3>
              <p>
                Certain features of the Service require a subscription. Your subscription will automatically renew unless auto-renew is turned off at least 24 hours before the end of the current period. You can manage your subscription in your account settings.
              </p>
              <p>
                Free trials are offered for a limited time and automatically convert to paid subscriptions unless canceled before the trial period ends. We reserve the right to modify subscription fees with notice to subscribers.
              </p>
              
              <h3>5. Content and Conduct</h3>
              <p>
                You may not use the Service for any purpose that is illegal or prohibited by these Terms. You are solely responsible for all of your activity in connection with the Service.
              </p>
              <p>
                Harassment, abusive language, or inappropriate content may result in immediate account termination. We reserve the right to remove any content that violates these terms or is otherwise objectionable.
              </p>
              
              <h3>6. Intellectual Property</h3>
              <p>
                The Service and its original content, features, and functionality are owned by FitLife Pro and are protected by international copyright, trademark, patent, trade secret, and other intellectual property or proprietary rights laws.
              </p>
              
              <h3>7. Termination</h3>
              <p>
                We may terminate or suspend your account and bar access to the Service immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever and without limitation, including but not limited to a breach of the Terms.
              </p>
              
              <h3>8. Limitation of Liability</h3>
              <p>
                In no event shall FitLife Pro, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.
              </p>
              
              <h3>9. Disclaimer</h3>
              <p>
                The Service is provided on an "AS IS" and "AS AVAILABLE" basis. The Service is provided without warranties of any kind, whether express or implied, including, but not limited to, implied warranties of merchantability, fitness for a particular purpose, non-infringement or course of performance.
              </p>
              <p>
                FitLife Pro does not warrant that a) the Service will function uninterrupted, secure or available at any particular time or location; b) any errors or defects will be corrected; c) the Service is free of viruses or other harmful components; or d) the results of using the Service will meet your requirements.
              </p>
              
              <h3>10. Health Disclaimer</h3>
              <p>
                FitLife Pro provides fitness and nutrition information and is intended for educational purposes only. The information provided is not intended to replace medical advice or treatment. Always consult with a healthcare professional before starting any diet, exercise program, or taking any dietary supplement.
              </p>
              
              <h3>11. Governing Law</h3>
              <p>
                These Terms shall be governed and construed in accordance with the laws of [Your Country/State], without regard to its conflict of law provisions.
              </p>
              
              <h3>12. Changes to Terms</h3>
              <p>
                We reserve the right to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.
              </p>
              
              <h3>13. Contact Us</h3>
              <p>
                If you have any questions about these Terms, please contact us at:
              </p>
              <p>
                <strong>Email:</strong> support@fitlifepro.com<br />
                <strong>Address:</strong> 123 Fitness Avenue, Health City, 98765
              </p>
            </CardContent>
            <CardFooter className="border-t pt-6 flex justify-between">
              <Button variant="outline" asChild>
                <Link href="/privacy">Privacy Policy</Link>
              </Button>
              <Button asChild>
                <Link href="/signup">Accept & Register <ChevronRight className="ml-2 h-4 w-4" /></Link>
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="privacy">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                <CardTitle>Privacy Policy</CardTitle>
              </div>
              <CardDescription>
                How we collect, use, and protect your personal information
              </CardDescription>
            </CardHeader>
            <CardContent className="prose prose-sm dark:prose-invert max-w-none">
              <h3>1. Information We Collect</h3>
              <p>
                <strong>Personal Information:</strong> When you create an account, we collect your name, email address, password, and optionally your physical attributes (height, weight, age, gender) for personalized fitness recommendations.
              </p>
              <p>
                <strong>Usage Data:</strong> We collect information on how you interact with our service, including the features you use, time spent on the app, and workout/nutrition logs.
              </p>
              <p>
                <strong>Device Information:</strong> We collect information about the device you use to access our service, including device type, operating system, and browser type.
              </p>
              <p>
                <strong>Location Data:</strong> With your permission, we may collect your precise location data to provide features like running routes and nearby gym recommendations.
              </p>
              
              <h3>2. How We Use Your Information</h3>
              <p>We use the information we collect to:</p>
              <ul>
                <li>Provide, maintain, and improve our services</li>
                <li>Create personalized workout and nutrition plans</li>
                <li>Process payments for premium subscriptions</li>
                <li>Send you updates, security alerts, and support messages</li>
                <li>Analyze usage patterns to improve user experience</li>
                <li>Develop new features and services</li>
                <li>Detect, investigate, and prevent fraudulent transactions and unauthorized access</li>
              </ul>
              
              <h3>3. Data Sharing and Disclosure</h3>
              <p>
                We do not sell your personal information to third parties. We may share your information in the following circumstances:
              </p>
              <ul>
                <li>With service providers who process data on our behalf</li>
                <li>To comply with legal obligations</li>
                <li>To protect the rights, property, or safety of FitLife Pro, our users, or the public</li>
                <li>In connection with a business transfer, such as a merger or acquisition</li>
                <li>With your consent or at your direction</li>
              </ul>
              
              <h3>4. Data Security</h3>
              <p>
                We implement appropriate technical and organizational measures to protect your personal data against unauthorized or unlawful processing, accidental loss, destruction, or damage. However, no method of transmission over the Internet or electronic storage is 100% secure, so we cannot guarantee absolute security.
              </p>
              
              <h3>5. Your Rights</h3>
              <p>Depending on your location, you may have the following rights:</p>
              <ul>
                <li>Access and receive a copy of your personal data</li>
                <li>Rectify inaccurate or incomplete personal data</li>
                <li>Request deletion of your personal data</li>
                <li>Restrict or object to the processing of your personal data</li>
                <li>Data portability (receiving your data in a structured, commonly used format)</li>
                <li>Withdraw consent at any time (where processing is based on consent)</li>
              </ul>
              
              <h3>6. Children's Privacy</h3>
              <p>
                Our service is not directed to individuals under 16. We do not knowingly collect personal information from children under 16. If we become aware that we have collected personal information from a child under 16, we will take steps to delete that information.
              </p>
              
              <h3>7. International Data Transfers</h3>
              <p>
                Your information may be transferred to — and maintained on — computers located outside of your state, province, country, or other governmental jurisdiction where the data protection laws may differ from those of your jurisdiction.
              </p>
              
              <h3>8. Changes to This Privacy Policy</h3>
              <p>
                We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date at the top of this policy. You are advised to review this Privacy Policy periodically for any changes.
              </p>
              
              <h3>9. Contact Us</h3>
              <p>
                If you have any questions about this Privacy Policy, please contact us at privacy@fitlifepro.com.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="data">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Info className="h-5 w-5 text-primary" />
                <CardTitle>Data Processing Agreement</CardTitle>
              </div>
              <CardDescription>
                How we process and protect your data
              </CardDescription>
            </CardHeader>
            <CardContent className="prose prose-sm dark:prose-invert max-w-none">
              <h3>1. Data Processing Activities</h3>
              <p>
                FitLife Pro acts as a data controller for personal information collected directly from users. We process the following categories of personal data:
              </p>
              <ul>
                <li>Account information (name, email, password)</li>
                <li>Profile information (age, gender, height, weight, fitness goals)</li>
                <li>Health and fitness data (workout logs, nutrition logs, sleep data, heart rate, steps)</li>
                <li>Usage information (features used, time spent, interactions)</li>
                <li>Payment information (for premium subscriptions)</li>
              </ul>
              
              <h3>2. Purpose of Processing</h3>
              <p>
                We process personal data for the following purposes:
              </p>
              <ul>
                <li>To provide personalized fitness and nutrition recommendations</li>
                <li>To track progress toward fitness goals</li>
                <li>To process payments for premium subscriptions</li>
                <li>To improve our services and develop new features</li>
                <li>To communicate with users about their accounts and provide customer support</li>
                <li>To ensure the security of our services</li>
              </ul>
              
              <h3>3. Duration of Processing</h3>
              <p>
                We will process personal data for as long as the user maintains an active account with FitLife Pro. Users can request deletion of their account and associated data at any time through the app settings or by contacting customer support.
              </p>
              <p>
                After account deletion, we may retain certain information in anonymized or aggregated form for analytical purposes or as required by law.
              </p>
              
              <h3>4. Subprocessors</h3>
              <p>
                FitLife Pro uses the following categories of subprocessors to provide our services:
              </p>
              <ul>
                <li>Cloud hosting and storage providers</li>
                <li>Payment processors</li>
                <li>Analytics providers</li>
                <li>Customer support tools</li>
                <li>Communication services</li>
              </ul>
              <p>
                We ensure that all subprocessors provide appropriate technical and organizational measures to protect personal data in accordance with applicable data protection laws.
              </p>
              
              <h3>5. Data Security Measures</h3>
              <p>
                We implement appropriate technical and organizational measures to ensure a level of security appropriate to the risk, including:
              </p>
              <ul>
                <li>Encryption of personal data in transit and at rest</li>
                <li>Regular testing and evaluation of security measures</li>
                <li>Access controls and authentication requirements</li>
                <li>Regular backups and disaster recovery procedures</li>
                <li>Staff training on data protection and security</li>
              </ul>
              
              <h3>6. Data Subject Rights</h3>
              <p>
                We will assist in responding to requests from data subjects to exercise their rights, including:
              </p>
              <ul>
                <li>Right of access</li>
                <li>Right to rectification</li>
                <li>Right to erasure</li>
                <li>Right to restriction of processing</li>
                <li>Right to data portability</li>
                <li>Right to object to processing</li>
              </ul>
              
              <h3>7. Data Breach Notification</h3>
              <p>
                In the event of a personal data breach, we will notify affected users without undue delay after becoming aware of the breach, where feasible within 72 hours, unless the breach is unlikely to result in a risk to the rights and freedoms of natural persons.
              </p>
              
              <h3>8. Cross-Border Data Transfers</h3>
              <p>
                If personal data is transferred outside the European Economic Area (EEA) or the user's country of residence, we ensure that appropriate safeguards are in place in accordance with applicable data protection laws.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="cookies">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Lock className="h-5 w-5 text-primary" />
                <CardTitle>Cookie Policy</CardTitle>
              </div>
              <CardDescription>
                How we use cookies and similar technologies
              </CardDescription>
            </CardHeader>
            <CardContent className="prose prose-sm dark:prose-invert max-w-none">
              <h3>1. What Are Cookies</h3>
              <p>
                Cookies are small text files that are placed on your device when you visit a website. They are widely used to make websites work more efficiently and provide information to the website owners.
              </p>
              
              <h3>2. How We Use Cookies</h3>
              <p>
                FitLife Pro uses cookies and similar technologies for the following purposes:
              </p>
              <ul>
                <li><strong>Essential Cookies:</strong> These cookies are necessary for the website to function properly. They enable core functionality such as security, network management, and account access.</li>
                <li><strong>Functional Cookies:</strong> These cookies enable us to provide enhanced functionality and personalization. They may be set by us or by third-party providers whose services we have added to our pages.</li>
                <li><strong>Analytics Cookies:</strong> These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously. This helps us improve our website and services.</li>
                <li><strong>Marketing Cookies:</strong> These cookies are used to track visitors across websites. The intention is to display ads that are relevant and engaging for the individual user.</li>
                <li><strong>Preference Cookies:</strong> These cookies enable the website to remember information that changes the way the website behaves or looks, such as your preferred language or the region you are in.</li>
              </ul>
              
              <h3>3. Types of Cookies We Use</h3>
              <table className="min-w-full border-collapse border border-muted">
                <thead>
                  <tr>
                    <th className="border border-muted p-2">Cookie Type</th>
                    <th className="border border-muted p-2">Purpose</th>
                    <th className="border border-muted p-2">Duration</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-muted p-2">Session Cookies</td>
                    <td className="border border-muted p-2">These cookies are temporary and expire once you close your browser.</td>
                    <td className="border border-muted p-2">Session</td>
                  </tr>
                  <tr>
                    <td className="border border-muted p-2">Persistent Cookies</td>
                    <td className="border border-muted p-2">These cookies remain on your device until they expire or you delete them.</td>
                    <td className="border border-muted p-2">Up to 2 years</td>
                  </tr>
                  <tr>
                    <td className="border border-muted p-2">Authentication Cookies</td>
                    <td className="border border-muted p-2">These cookies help us identify users and prevent unauthorized access to user accounts.</td>
                    <td className="border border-muted p-2">30 days</td>
                  </tr>
                  <tr>
                    <td className="border border-muted p-2">Preference Cookies</td>
                    <td className="border border-muted p-2">These cookies remember your settings and preferences.</td>
                    <td className="border border-muted p-2">1 year</td>
                  </tr>
                  <tr>
                    <td className="border border-muted p-2">Analytics Cookies</td>
                    <td className="border border-muted p-2">These cookies collect information about how you use our website.</td>
                    <td className="border border-muted p-2">Up to 2 years</td>
                  </tr>
                </tbody>
              </table>
              
              <h3>4. Third-Party Cookies</h3>
              <p>
                Some cookies are placed by third parties on our behalf. These third parties may include:
              </p>
              <ul>
                <li>Google Analytics (analytics)</li>
                <li>Stripe (payment processing)</li>
                <li>Facebook Pixel (marketing)</li>
                <li>Intercom (customer support)</li>
              </ul>
              <p>
                These third parties may use cookies, web beacons, and similar technologies to collect or receive information from our website and elsewhere on the internet and use that information to provide measurement services and target ads.
              </p>
              
              <h3>5. Managing Cookies</h3>
              <p>
                Most web browsers allow you to manage your cookie preferences. You can set your browser to refuse cookies, or to alert you when cookies are being sent. The following links provide information on how to modify your browser's settings to block or delete cookies:
              </p>
              <ul>
                <li><a href="https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noopener noreferrer">Microsoft Edge</a></li>
                <li><a href="https://support.mozilla.org/en-US/kb/enhanced-tracking-protection-firefox-desktop" target="_blank" rel="noopener noreferrer">Mozilla Firefox</a></li>
                <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer">Google Chrome</a></li>
                <li><a href="https://support.apple.com/guide/safari/manage-cookies-and-website-data-sfri11471/mac" target="_blank" rel="noopener noreferrer">Safari</a></li>
              </ul>
              <p>
                Please note that if you choose to block cookies, you may not be able to use all the features of our website.
              </p>
              
              <h3>6. Changes to Our Cookie Policy</h3>
              <p>
                We may update our Cookie Policy from time to time. Any changes will be posted on this page with an updated revision date.
              </p>
              
              <h3>7. Contact Us</h3>
              <p>
                If you have any questions about our Cookie Policy, please contact us at privacy@fitlifepro.com.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 