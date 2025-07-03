
import { Card, CardContent } from '@/components/ui/card';
import { FileText } from 'lucide-react';
import Navigation from '@/components/Navigation';
import { Footer } from '@/components/Footer';

const Terms = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900">
      <Navigation />

      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/50 dark:to-purple-900/50 px-4 py-2 rounded-full mb-6">
            <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span className="text-blue-700 dark:text-blue-300 font-medium">Legal Terms</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Terms & <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Conditions</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">Terms of service and usage</p>
        </div>

        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-xl">
          <CardContent className="p-12">
            <div className="prose prose-lg max-w-none dark:prose-invert">
              <div className="text-center mb-8">
                <p className="text-gray-600 dark:text-gray-400">Last updated: December 2024</p>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Terms and Conditions</h2>
              <p className="text-gray-700 dark:text-gray-300 mb-6">
                Welcome to TalentSpur. These Terms and Conditions ("Terms") govern your use of our website 
                and services. By accessing or using our platform, you agree to be bound by these Terms.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">1. Acceptance of Terms</h3>
              <p className="text-gray-700 dark:text-gray-300 mb-6">
                By accessing and using TalentSpur, you accept and agree to be bound by the terms and provision 
                of this agreement. If you do not agree to abide by the above, please do not use this service.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">2. Description of Service</h3>
              <p className="text-gray-700 dark:text-gray-300 mb-6">
                TalentSpur is a career platform that connects job seekers with employment opportunities. 
                The service includes job listings, application tools, career resources, and newsletter subscriptions.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">3. User Accounts and Registration</h3>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                To access certain features of our service, you may be required to create an account. When creating an account, you agree to:
              </p>
              <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-6">
                <li>Provide accurate, current, and complete information</li>
                <li>Maintain and update your account information</li>
                <li>Keep your password secure and confidential</li>
                <li>Accept responsibility for all activities under your account</li>
                <li>Notify us immediately of any unauthorized use</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">4. Content and Intellectual Property</h3>
              
              <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Your Content</h4>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                You retain ownership of content you create and submit through our platform. However, by submitting content, you grant us:
              </p>
              <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-6">
                <li>A non-exclusive license to host, display, and distribute your content</li>
                <li>The right to share your profile with potential employers</li>
                <li>Permission to make technical modifications necessary for platform operation</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">5. Acceptable Use Policy</h3>
              <p className="text-gray-700 dark:text-gray-300 mb-4">You agree not to use our service to:</p>
              <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-6">
                <li>Create or distribute illegal, harmful, or offensive content</li>
                <li>Infringe on intellectual property rights of others</li>
                <li>Engage in spam, phishing, or fraudulent activities</li>
                <li>Attempt to gain unauthorized access to our systems</li>
                <li>Distribute malware or malicious code</li>
                <li>Violate any applicable laws or regulations</li>
                <li>Impersonate others or misrepresent your qualifications</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">6. Job Applications and Employment</h3>
              <p className="text-gray-700 dark:text-gray-300 mb-6">
                TalentSpur facilitates connections between job seekers and employers but is not responsible for 
                hiring decisions, employment terms, or workplace conditions. All employment relationships are 
                between you and the employer directly.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">7. Newsletter and Communications</h3>
              <p className="text-gray-700 dark:text-gray-300 mb-6">
                By subscribing to our newsletter, you consent to receive career-related emails and job opportunities. 
                You may unsubscribe at any time through the provided unsubscribe mechanisms.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">8. Disclaimers and Limitations of Liability</h3>
              <p className="text-gray-700 dark:text-gray-300 mb-6">
                OUR SERVICE IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND. WE DISCLAIM ALL WARRANTIES, 
                EXPRESS OR IMPLIED, INCLUDING MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT. 
                WE SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">9. Service Availability</h3>
              <p className="text-gray-700 dark:text-gray-300 mb-6">
                We strive to maintain service availability but do not guarantee uninterrupted access. We reserve 
                the right to modify, suspend, or discontinue any part of our service with or without notice.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">10. Termination</h3>
              <p className="text-gray-700 dark:text-gray-300 mb-6">
                We may terminate or suspend your account and access to our service immediately, without prior notice, 
                for conduct that we believe violates these Terms or is harmful to other users, us, or third parties.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">11. Contact Information</h3>
              <p className="text-gray-700 dark:text-gray-300 mb-6">
                If you have any questions about these Terms and Conditions, please contact us at:
              </p>
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <p className="text-gray-700 dark:text-gray-300">
                  <strong>TalentSpur</strong><br />
                  Email: legal@talentspur.com<br />
                  Subject: Terms and Conditions Inquiry
                </p>
              </div>

              <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg border border-blue-200 dark:border-blue-700">
                <p className="text-blue-800 dark:text-blue-200 text-sm">
                  <strong>Note:</strong> By using TalentSpur, you acknowledge that you have read, understood, 
                  and agree to be bound by these Terms and Conditions.
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

export default Terms;
