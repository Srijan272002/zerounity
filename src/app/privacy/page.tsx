import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <div className="bg-white p-8 rounded-xl shadow-lg">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
            <p className="text-gray-600">Last updated: {new Date().toLocaleDateString()}</p>
          </div>

          <div className="space-y-6 text-gray-700">
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Information We Collect</h2>
              <p>
                We collect information you provide directly to us, including but not limited to:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-2">
                <li>Account information (name, email, profile picture)</li>
                <li>Game content and related materials</li>
                <li>Usage data and analytics</li>
                <li>Communications with us</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">2. How We Use Your Information</h2>
              <p>
                We use the information we collect to:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-2">
                <li>Provide and improve our services</li>
                <li>Personalize your experience</li>
                <li>Communicate with you</li>
                <li>Ensure platform security</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">3. Information Sharing</h2>
              <p>
                We do not sell your personal information. We may share your information in the 
                following circumstances:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-2">
                <li>With your consent</li>
                <li>For legal compliance</li>
                <li>To protect rights and safety</li>
                <li>With service providers</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Data Security</h2>
              <p>
                We implement appropriate security measures to protect your personal information. 
                However, no method of transmission over the internet is 100% secure.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">5. Your Rights</h2>
              <p>
                You have the right to:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-2">
                <li>Access your personal information</li>
                <li>Update or correct your information</li>
                <li>Request deletion of your information</li>
                <li>Opt-out of marketing communications</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">6. Children&apos;s Privacy</h2>
              <p>
                Our services are not intended for children under 13. We do not knowingly collect 
                information from children under 13.
              </p>
            </section>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-200">
            <p className="text-gray-600 text-sm">
              For privacy-related questions, please contact us at privacy@gamefordge.com
            </p>
            <Link 
              href="/" 
              className="mt-4 inline-block text-blue-600 hover:text-blue-500"
            >
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 