
import { Card, CardContent } from '@/components/ui/card';
import { Shield } from 'lucide-react';
import Navigation from '@/components/Navigation';
import { Footer } from '@/components/Footer';

const Privacy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900">
      <Navigation />

      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/50 dark:to-purple-900/50 px-4 py-2 rounded-full mb-6">
            <Shield className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span className="text-blue-700 dark:text-blue-300 font-medium">Privacy & Security</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Privacy <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Policy</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">Your privacy and data protection</p>
        </div>

        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-xl">
          <CardContent className="p-12">
            <div className="prose prose-lg max-w-none dark:prose-invert">
              <div className="text-center mb-8">
                <p className="text-gray-600 dark:text-gray-400">Last updated: December 2024</p>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Introduction</h2>
              <p className="text-gray-700 dark:text-gray-300 mb-6">
                At TalentSpur ("we," "our," or "us"), we are committed to protecting your privacy and ensuring 
                the security of your personal information. This Privacy Policy explains how we collect, use, 
                disclose, and safeguard your information when you visit our website and use our services.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Information We Collect</h3>
              
              <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Personal Information</h4>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                We may collect personal information that you voluntarily provide to us, including:
              </p>
              <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-6">
                <li>Email address (for newsletter subscriptions and account creation)</li>
                <li>Name and contact information (if provided)</li>
                <li>Resume and professional information</li>
                <li>Job application data</li>
              </ul>

              <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Automatically Collected Information</h4>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                When you visit our website, we may automatically collect certain information, including:
              </p>
              <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-6">
                <li>IP address and location data</li>
                <li>Browser type and version</li>
                <li>Pages visited and time spent on our site</li>
                <li>Referring website addresses</li>
                <li>Device information and operating system</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">How We Use Your Information</h3>
              <p className="text-gray-700 dark:text-gray-300 mb-4">We use the information we collect to:</p>
              <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-6">
                <li>Provide, operate, and maintain our services</li>
                <li>Improve and personalize user experience</li>
                <li>Process job applications and match candidates with opportunities</li>
                <li>Send newsletters and career-related communications</li>
                <li>Communicate with you about our services</li>
                <li>Monitor and analyze usage patterns</li>
                <li>Detect and prevent fraudulent activities</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Information Sharing and Disclosure</h3>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                We do not sell, trade, or otherwise transfer your personal information to third parties except in the following circumstances:
              </p>
              <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-6">
                <li>With your explicit consent</li>
                <li>To comply with legal obligations</li>
                <li>To protect our rights and prevent fraud</li>
                <li>With potential employers when you apply for jobs</li>
                <li>With trusted service providers who assist in our operations</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Data Security</h3>
              <p className="text-gray-700 dark:text-gray-300 mb-6">
                We implement appropriate technical and organizational security measures to protect your personal 
                information against unauthorized access, alteration, disclosure, or destruction. However, no method 
                of transmission over the internet is 100% secure, and we cannot guarantee absolute security.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Newsletter Subscriptions</h3>
              <p className="text-gray-700 dark:text-gray-300 mb-6">
                When you subscribe to our newsletter, we collect your email address to send you career-related 
                content and job opportunities. You can unsubscribe at any time by contacting us or using the 
                unsubscribe link in our emails.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Your Rights</h3>
              <p className="text-gray-700 dark:text-gray-300 mb-4">Depending on your location, you may have the following rights:</p>
              <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-6">
                <li>Access to your personal information</li>
                <li>Correction of inaccurate personal information</li>
                <li>Deletion of your personal information</li>
                <li>Restriction of processing</li>
                <li>Data portability</li>
                <li>Objection to processing</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Contact Us</h3>
              <p className="text-gray-700 dark:text-gray-300 mb-6">
                If you have any questions about this Privacy Policy or our privacy practices, please contact us at:
              </p>
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <p className="text-gray-700 dark:text-gray-300">
                  <strong>TalentSpur</strong><br />
                  Email: privacy@talentspur.com<br />
                  Subject: Privacy Policy Inquiry
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
};

export default Privacy;
