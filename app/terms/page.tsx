import React from "react"
import Link from "next/link"
import { Metadata } from "next"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChevronRight, FileText, Shield, Info, Lock, UserPlus, AlertTriangle, Database, Eye, HelpCircle } from "lucide-react"

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
        <TabsList className="grid w-full grid-cols-5 mb-8">
          <TabsTrigger value="terms">Terms of Service</TabsTrigger>
          <TabsTrigger value="privacy">Privacy Policy</TabsTrigger>
          <TabsTrigger value="data">Data Processing</TabsTrigger>
          <TabsTrigger value="precautions">Precautions</TabsTrigger>
          <TabsTrigger value="information">Information</TabsTrigger>
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
              
              <h3>13. Acceptable Use and Abuse Prevention</h3>
              <p>
                You agree not to misuse the Service or help anyone else do so. Misuse includes but is not limited to:
              </p>
              <ul>
                <li>Attempting to gain unauthorized access to the Service or other users' accounts</li>
                <li>Using automated methods to access the Service in a manner that sends more requests than a human could reasonably produce</li>
                <li>Interfering with the proper working of the Service</li>
                <li>Bypassing measures designed to prevent or restrict access to the Service</li>
                <li>Distributing harmful software or engaging in activities that compromise the security of the Service</li>
                <li>Creating multiple accounts for abusive purposes or to circumvent restrictions</li>
              </ul>
              <p>
                Violation of these abuse prevention measures may result in immediate account termination and potential legal action.
              </p>
              
              <h3>14. Contact Us</h3>
              <p>
                If you have any questions about these Terms, please contact us at:
              </p>
              <p>
                <strong>Email:</strong> innocentgh10@gmail.com<br />
                <strong>Address:</strong> 419 university of ghana, 123
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
                If you have any questions about this Privacy Policy, please contact us at innocentgh10@gmail.com.
              </p>

              <h3>14. User Content License</h3>
              <p>
                When you upload or share content on our platform (such as profile pictures, progress photos, workout videos, etc.), you grant FitLife Pro a non-exclusive, royalty-free, transferable, sub-licensable, worldwide license to host, use, distribute, modify, run, copy, publicly perform or display, translate, and create derivative works of your content.
              </p>

              <h3>15. Third-Party Integrations</h3>
              <p>
                Our Service may integrate with third-party fitness devices, apps, and services to enhance functionality. By connecting these third-party services, you authorize us to exchange data with these services according to your privacy settings. These third-party services have their own terms and privacy policies, and we are not responsible for their practices.
              </p>

              <h3>16. Dispute Resolution</h3>
              <p>
                Any dispute arising from these Terms shall first be resolved through good-faith negotiations. If negotiations fail, both parties agree to resolve the dispute through arbitration rather than court proceedings. The arbitration shall be conducted in accordance with the rules of the International Arbitration Association in Ghana.
              </p>

              <h3>17. Force Majeure</h3>
              <p>
                Neither party shall be liable for any failure or delay in performance due to circumstances beyond their reasonable control, including but not limited to acts of God, natural disasters, pandemic, epidemic, war, terrorism, riots, civil disorder, governmental actions, or internet disturbance.
              </p>

              <h3>18. Severability</h3>
              <p>
                If any provision of these Terms is found to be unenforceable or invalid, that provision will be limited or eliminated to the minimum extent necessary so that the Terms will otherwise remain in full effect and enforceable.
              </p>

              <h3>19. Assignment</h3>
              <p>
                You may not assign or transfer these Terms, by operation of law or otherwise, without our prior written consent. Any attempt to assign or transfer these Terms without such consent will be null and void. We may freely assign or transfer these Terms without restriction.
              </p>

              <h3>20. Entire Agreement</h3>
              <p>
                These Terms, including our Privacy Policy, constitute the entire agreement between you and FitLife Pro regarding our Service and supersede any prior agreements or understandings, whether written or oral.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="data">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Database className="h-5 w-5 text-primary" />
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
                We process your data for the following purposes:
              </p>
              <ul>
                <li>Account creation and authentication</li>
                <li>Providing personalized fitness and nutrition recommendations</li>
                <li>Progress tracking and goal management</li>
                <li>Communication about your account, updates, and features</li>
                <li>Payment processing for premium subscriptions</li>
                <li>Improving our services through analytics and research</li>
                <li>Complying with legal obligations</li>
              </ul>
              
              <h3>3. Data Retention</h3>
              <p>
                We retain your personal data for as long as your account is active or as needed to provide you with our services. We may retain certain information for legitimate business purposes or as required by law. When we no longer need your data, we will securely delete or anonymize it.
              </p>
              
              <h3>4. Data Subject Rights</h3>
              <p>
                As a data subject, you have the right to:
              </p>
              <ul>
                <li>Access your personal data</li>
                <li>Rectify inaccurate data</li>
                <li>Request erasure of your data</li>
                <li>Restrict or object to processing</li>
                <li>Data portability</li>
                <li>Lodge a complaint with a supervisory authority</li>
              </ul>
              <p>
                To exercise these rights, please contact our Data Protection Officer at dpo@fitlifepro.com.
              </p>
              
              <h3>5. Data Security Measures</h3>
              <p>
                We implement appropriate technical and organizational measures to ensure the security of your data, including:
              </p>
              <ul>
                <li>Encryption of personal data</li>
                <li>Regular security assessments and penetration testing</li>
                <li>Access controls and authentication measures</li>
                <li>Staff training on data protection and security</li>
                <li>Incident response procedures</li>
                <li>Regular backups and disaster recovery planning</li>
              </ul>
              
              <h3>6. International Data Transfers</h3>
              <p>
                Your data may be transferred to and processed in countries outside your country of residence. We ensure that any such transfers comply with applicable data protection laws and that appropriate safeguards are in place to protect your personal data.
              </p>
              
              <h3>7. Subprocessors</h3>
              <p>
                We may use third-party service providers to process personal data on our behalf. All our subprocessors are bound by data processing agreements that require them to process data in accordance with our instructions and implement appropriate security measures.
              </p>
              
              <h3>8. Data Breach Notification</h3>
              <p>
                In the event of a personal data breach, we will notify the relevant supervisory authority without undue delay and, where feasible, within 72 hours after becoming aware of the breach. We will also notify affected users when the breach is likely to result in a high risk to their rights and freedoms.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="precautions">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-primary" />
                <CardTitle>Precautions and Warnings</CardTitle>
              </div>
              <CardDescription>
                Important safety information about using FitLife Pro
              </CardDescription>
            </CardHeader>
            <CardContent className="prose prose-sm dark:prose-invert max-w-none">
              <h3>1. Health and Medical Precautions</h3>
              <p>
                <strong>Consult a Healthcare Professional:</strong> Before starting any exercise program or making significant changes to your diet, consult with a qualified healthcare professional, especially if you have any pre-existing health conditions, injuries, or concerns.
              </p>
              <p>
                <strong>Not a Medical Device:</strong> FitLife Pro is not a medical device and is not intended to diagnose, treat, cure, or prevent any disease or health condition. The app should not be used as a substitute for professional medical advice, diagnosis, or treatment.
              </p>
              <p>
                <strong>Pregnancy and Special Conditions:</strong> If you are pregnant, nursing, have a medical condition, or are taking medications, consult your healthcare provider before using any fitness or nutrition features within the app.
              </p>
              
              <h3>2. Exercise Warnings</h3>
              <p>
                <strong>Proper Form and Technique:</strong> Always ensure you are using proper form and technique when performing exercises. Incorrect form can lead to injury. If you are unsure, seek guidance from a certified fitness professional.
              </p>
              <p>
                <strong>Listen to Your Body:</strong> Pay attention to your body's signals during exercise. Stop immediately if you experience pain, dizziness, shortness of breath, chest pain, or any unusual discomfort, and seek medical attention if necessary.
              </p>
              <p>
                <strong>Gradual Progression:</strong> Increase the intensity, duration, or difficulty of your workouts gradually. Sudden changes in exercise volume can increase the risk of injury.
              </p>
              <p>
                <strong>Warm-Up and Cool-Down:</strong> Always include appropriate warm-up and cool-down periods in your workouts to prepare your body and reduce the risk of injury.
              </p>
              
              <h3>3. Nutrition Precautions</h3>
              <p>
                <strong>Individual Nutritional Needs:</strong> Nutritional recommendations provided in the app are generalized and may not account for your specific allergies, intolerances, or medical conditions. Consult with a registered dietitian for personalized nutrition advice.
              </p>
              <p>
                <strong>Extreme Diet Changes:</strong> Avoid extreme or rapid changes to your diet. Sustainable, gradual changes are generally safer and more effective for long-term health.
              </p>
              <p>
                <strong>Caloric Restrictions:</strong> Very low-calorie diets can be harmful. The app's minimum calorie recommendations are set to maintain safety, and going below these limits is not recommended without medical supervision.
              </p>
              
              <h3>4. Technical Warnings</h3>
              <p>
                <strong>Data Accuracy:</strong> While we strive for accuracy, the measurements, calculations, and recommendations provided by the app may have limitations. Use the information as a guide rather than absolute truth.
              </p>
              <p>
                <strong>Device Compatibility:</strong> The app may function differently on various devices and operating systems. Ensure your device meets the minimum requirements for optimal performance.
              </p>
              <p>
                <strong>Battery Usage:</strong> Fitness tracking features, especially those using GPS or continuous heart rate monitoring, may significantly impact your device's battery life.
              </p>
              
              <h3>5. Third-Party Integration Warnings</h3>
              <p>
                <strong>Connected Devices:</strong> When using connected fitness devices (heart rate monitors, activity trackers, etc.), follow the manufacturer's instructions and safety guidelines. Improper use may lead to inaccurate readings or potential safety hazards.
              </p>
              <p>
                <strong>Third-Party Services:</strong> When you connect our app with third-party services, your data may be shared according to the privacy policies of those services. Review their terms before connecting.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="information">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Info className="h-5 w-5 text-primary" />
                <CardTitle>General Information</CardTitle>
              </div>
              <CardDescription>
                Additional details about FitLife Pro
              </CardDescription>
            </CardHeader>
            <CardContent className="prose prose-sm dark:prose-invert max-w-none">
              <h3>1. App Information</h3>
              <p>
                <strong>App Version:</strong> 2.1.0
              </p>
              <p>
                <strong>Compatible Devices:</strong> iOS 14.0 or later, Android 9.0 or later
              </p>
              <p>
                <strong>Languages Supported:</strong> English, Spanish, French, German, Italian, Portuguese, Japanese
              </p>
              <p>
                <strong>App Size:</strong> Approximately 75MB (may vary by device)
              </p>
              
              <h3>2. Support Information</h3>
              <p>
                <strong>Customer Support:</strong> innocentgh10@gmail.com
              </p>
              <p>
                <strong>Technical Support:</strong> innocentgh10@gmail.com
              </p>
              <p>
                <strong>Phone Support:</strong> +233550477759
              </p>
              <p>
                <strong>Response Time:</strong> We aim to respond to all inquiries as soon as possible
              </p>
              <p>
                <strong>Knowledge Base:</strong> Available in the Support section
              </p>
              
              <h3>3. Development Team</h3>
              <p>
                FitLife Pro is developed by a dedicated team of fitness enthusiasts and technology experts committed to helping you achieve your health and fitness goals.
              </p>
              <p>
                <strong>Key Team Members:</strong>
              </p>
              <ul>
                <li><strong>Godfred Osei</strong> - Backend Developer</li>
                <li><strong>Beatrice Nettey</strong> - UX/UI Designer</li>
                <li>Certified fitness professionals and nutritionists who review and validate content</li>
                <li>Data scientists who develop and refine our recommendation algorithms</li>
                <li>Security experts who ensure your data remains private and protected</li>
              </ul>
              
              <h3>4. Subscription Information</h3>
              <p>
                <strong>Free Features:</strong> Basic workout tracking, step counting, water intake tracking, and weight logging
              </p>
              <p>
                <strong>Premium Features:</strong> Advanced analytics, personalized workout plans, custom meal planning, premium content, priority support
              </p>
              <p>
                <strong>Pricing:</strong>
              </p>
              <ul>
                <li>Monthly: $9.99 per month</li>
                <li>Quarterly: $24.99 (equivalent to $8.33 per month)</li>
                <li>Annual: $89.99 (equivalent to $7.50 per month)</li>
              </ul>
              <p>
                <strong>Free Trial:</strong> All new users are eligible for a 14-day free trial of Premium features
              </p>
              
              <h3>5. App Permissions</h3>
              <p>
                FitLife Pro may request the following permissions to provide its full functionality:
              </p>
              <ul>
                <li><strong>Physical Activity:</strong> To track workouts, steps, and movement</li>
                <li><strong>Location:</strong> To map runs/walks and provide location-based features</li>
                <li><strong>Camera:</strong> To scan food barcodes and take progress photos</li>
                <li><strong>Photos:</strong> To store and display progress photos</li>
                <li><strong>Notifications:</strong> To send workout reminders and motivational alerts</li>
                <li><strong>Bluetooth:</strong> To connect with fitness devices and heart rate monitors</li>
                <li><strong>Health Data:</strong> To read/write health information from your device's health app</li>
              </ul>
              <p>
                You can manage all permissions in your device settings at any time.
              </p>
              
              <h3>6. App Usage</h3>
              <p>
                For optimal experience and results with FitLife Pro:
              </p>
              <ul>
                <li>Complete your profile with accurate information for more personalized recommendations</li>
                <li>Log your workouts consistently to track progress and receive tailored guidance</li>
                <li>Set realistic goals that align with your fitness level and available time</li>
                <li>Enable notifications for reminders about workouts, water intake, and other healthy habits</li>
                <li>Sync with wearable devices when possible for more accurate tracking</li>
                <li>Update the app regularly to access new features and improvements</li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="mt-16 text-center text-muted-foreground text-sm">
        <p>
          <strong>FitLife Pro</strong> • Developed with ❤️ by our amazing team
        </p>
        <p className="mt-2">
          <Link href="/about/acknowledgments" className="text-primary hover:underline">Acknowledging our development team</Link>
        </p>
      </div>
    </div>
  )
} 