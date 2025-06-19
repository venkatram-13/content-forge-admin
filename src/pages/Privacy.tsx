
import { Card, CardContent } from '@/components/ui/card';
import { Shield, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Privacy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-lg border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Privacy Policy
                </h1>
                <p className="text-gray-600">Your privacy and data protection</p>
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

              <h2 className="text-2xl font-bold text-gray-900 mb-6">Introduction</h2>
              <p className="text-gray-700 mb-6">
                At AI Blog Hub ("we," "our," or "us"), we are committed to protecting your privacy and ensuring 
                the security of your personal information. This Privacy Policy explains how we collect, use, 
                disclose, and safeguard your information when you visit our website and use our services.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-4">Information We Collect</h3>
              
              <h4 className="text-lg font-medium text-gray-900 mb-3">Personal Information</h4>
              <p className="text-gray-700 mb-4">
                We may collect personal information that you voluntarily provide to us, including:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-6">
                <li>Email address (for admin account creation)</li>
                <li>Name and contact information (if provided)</li>
                <li>Content you create or submit through our platform</li>
              </ul>

              <h4 className="text-lg font-medium text-gray-900 mb-3">Automatically Collected Information</h4>
              <p className="text-gray-700 mb-4">
                When you visit our website, we may automatically collect certain information, including:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-6">
                <li>IP address and location data</li>
                <li>Browser type and version</li>
                <li>Pages visited and time spent on our site</li>
                <li>Referring website addresses</li>
                <li>Device information and operating system</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-4">How We Use Your Information</h3>
              <p className="text-gray-700 mb-4">We use the information we collect to:</p>
              <ul className="list-disc pl-6 text-gray-700 mb-6">
                <li>Provide, operate, and maintain our services</li>
                <li>Improve and personalize user experience</li>
                <li>Process and manage admin accounts</li>
                <li>Generate AI-enhanced content through our services</li>
                <li>Communicate with you about our services</li>
                <li>Monitor and analyze usage patterns</li>
                <li>Detect and prevent fraudulent activities</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-4">AI and Third-Party Services</h3>
              <p className="text-gray-700 mb-6">
                Our platform uses artificial intelligence services (including Google's Gemini API) to enhance 
                content creation. When you use our AI features, your content may be processed by these third-party 
                AI services. We ensure that all AI processing complies with our privacy standards and the respective 
                service providers' privacy policies.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-4">Information Sharing and Disclosure</h3>
              <p className="text-gray-700 mb-4">
                We do not sell, trade, or otherwise transfer your personal information to third parties except in the following circumstances:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-6">
                <li>With your explicit consent</li>
                <li>To comply with legal obligations</li>
                <li>To protect our rights and prevent fraud</li>
                <li>In connection with AI service providers for content processing</li>
                <li>With trusted service providers who assist in our operations</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-4">Data Security</h3>
              <p className="text-gray-700 mb-6">
                We implement appropriate technical and organizational security measures to protect your personal 
                information against unauthorized access, alteration, disclosure, or destruction. However, no method 
                of transmission over the internet is 100% secure, and we cannot guarantee absolute security.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-4">Data Retention</h3>
              <p className="text-gray-700 mb-6">
                We retain your personal information only for as long as necessary to fulfill the purposes outlined 
                in this Privacy Policy, unless a longer retention period is required by law.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-4">Your Rights</h3>
              <p className="text-gray-700 mb-4">Depending on your location, you may have the following rights:</p>
              <ul className="list-disc pl-6 text-gray-700 mb-6">
                <li>Access to your personal information</li>
                <li>Correction of inaccurate personal information</li>
                <li>Deletion of your personal information</li>
                <li>Restriction of processing</li>
                <li>Data portability</li>
                <li>Objection to processing</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-4">Cookies and Tracking Technologies</h3>
              <p className="text-gray-700 mb-6">
                Our website may use cookies and similar tracking technologies to enhance user experience and 
                analyze site usage. You can control cookie settings through your browser preferences.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-4">Children's Privacy</h3>
              <p className="text-gray-700 mb-6">
                Our services are not intended for children under 13 years of age. We do not knowingly collect 
                personal information from children under 13.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-4">Changes to This Privacy Policy</h3>
              <p className="text-gray-700 mb-6">
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting 
                the new Privacy Policy on this page and updating the "Last updated" date.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-4">Contact Us</h3>
              <p className="text-gray-700 mb-6">
                If you have any questions about this Privacy Policy or our privacy practices, please contact us at:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700">
                  <strong>AI Blog Hub</strong><br />
                  Email: privacy@aibloghub.com<br />
                  Subject: Privacy Policy Inquiry
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Privacy;
