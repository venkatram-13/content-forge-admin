
import { Card, CardContent } from '@/components/ui/card';
import { FileText, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Terms = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-lg border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Terms & Conditions
                </h1>
                <p className="text-gray-600">Terms of service and usage</p>
              </div>
            </div>
            <Link to="/">
              <Button variant="outline" className="flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
          <CardContent className="p-12">
            <div className="prose prose-lg max-w-none">
              <div className="text-center mb-8">
                <p className="text-gray-600">Last updated: December 2024</p>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mb-6">Terms and Conditions</h2>
              <p className="text-gray-700 mb-6">
                Welcome to AI Blog Hub. These Terms and Conditions ("Terms") govern your use of our website 
                and services. By accessing or using our platform, you agree to be bound by these Terms.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-4">1. Acceptance of Terms</h3>
              <p className="text-gray-700 mb-6">
                By accessing and using AI Blog Hub, you accept and agree to be bound by the terms and provision 
                of this agreement. If you do not agree to abide by the above, please do not use this service.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-4">2. Description of Service</h3>
              <p className="text-gray-700 mb-6">
                AI Blog Hub is an AI-powered content creation and blogging platform that allows administrators 
                to create, edit, and publish blog content enhanced by artificial intelligence. The service includes 
                content rewriting, blog management tools, and a public reading interface.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-4">3. User Accounts and Registration</h3>
              <p className="text-gray-700 mb-4">
                To access certain features of our service, you may be required to create an admin account. When creating an account, you agree to:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-6">
                <li>Provide accurate, current, and complete information</li>
                <li>Maintain and update your account information</li>
                <li>Keep your password secure and confidential</li>
                <li>Accept responsibility for all activities under your account</li>
                <li>Notify us immediately of any unauthorized use</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-4">4. Content and Intellectual Property</h3>
              
              <h4 className="text-lg font-medium text-gray-900 mb-3">Your Content</h4>
              <p className="text-gray-700 mb-4">
                You retain ownership of content you create and submit through our platform. However, by submitting content, you grant us:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-6">
                <li>A non-exclusive license to host, display, and distribute your content</li>
                <li>The right to process your content through AI services for enhancement</li>
                <li>Permission to make technical modifications necessary for platform operation</li>
              </ul>

              <h4 className="text-lg font-medium text-gray-900 mb-3">AI-Generated Content</h4>
              <p className="text-gray-700 mb-6">
                Content generated or enhanced by our AI services becomes available for your use. However, you are 
                responsible for reviewing and ensuring the accuracy, appropriateness, and legal compliance of all 
                AI-generated content before publication.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-4">5. Acceptable Use Policy</h3>
              <p className="text-gray-700 mb-4">You agree not to use our service to:</p>
              <ul className="list-disc pl-6 text-gray-700 mb-6">
                <li>Create or distribute illegal, harmful, or offensive content</li>
                <li>Infringe on intellectual property rights of others</li>
                <li>Engage in spam, phishing, or fraudulent activities</li>
                <li>Attempt to gain unauthorized access to our systems</li>
                <li>Distribute malware or malicious code</li>
                <li>Violate any applicable laws or regulations</li>
                <li>Impersonate others or misrepresent your affiliation</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-4">6. AI Services and Limitations</h3>
              <p className="text-gray-700 mb-6">
                Our AI-powered features are provided "as is" and may not always produce perfect results. You acknowledge that:
                AI-generated content may contain errors or inaccuracies; You are responsible for reviewing and editing 
                all AI-generated content; AI services may be temporarily unavailable; We do not guarantee the quality 
                or suitability of AI-generated content for any specific purpose.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-4">7. Privacy and Data Protection</h3>
              <p className="text-gray-700 mb-6">
                Your privacy is important to us. Please review our Privacy Policy, which governs how we collect, 
                use, and protect your personal information. By using our service, you consent to our data practices 
                as described in the Privacy Policy.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-4">8. Disclaimers and Limitations of Liability</h3>
              <p className="text-gray-700 mb-6">
                OUR SERVICE IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND. WE DISCLAIM ALL WARRANTIES, 
                EXPRESS OR IMPLIED, INCLUDING MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT. 
                WE SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-4">9. Service Availability</h3>
              <p className="text-gray-700 mb-6">
                We strive to maintain service availability but do not guarantee uninterrupted access. We reserve 
                the right to modify, suspend, or discontinue any part of our service with or without notice.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-4">10. Termination</h3>
              <p className="text-gray-700 mb-6">
                We may terminate or suspend your account and access to our service immediately, without prior notice, 
                for conduct that we believe violates these Terms or is harmful to other users, us, or third parties.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-4">11. Changes to Terms</h3>
              <p className="text-gray-700 mb-6">
                We reserve the right to modify these Terms at any time. We will notify users of significant changes 
                by posting the updated Terms on our website. Your continued use of the service after changes 
                constitutes acceptance of the new Terms.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-4">12. Governing Law</h3>
              <p className="text-gray-700 mb-6">
                These Terms shall be governed by and construed in accordance with applicable laws, without regard 
                to conflict of law principles.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-4">13. Contact Information</h3>
              <p className="text-gray-700 mb-6">
                If you have any questions about these Terms and Conditions, please contact us at:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700">
                  <strong>AI Blog Hub</strong><br />
                  Email: legal@aibloghub.com<br />
                  Subject: Terms and Conditions Inquiry
                </p>
              </div>

              <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-blue-800 text-sm">
                  <strong>Note:</strong> By using AI Blog Hub, you acknowledge that you have read, understood, 
                  and agree to be bound by these Terms and Conditions.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Terms;
