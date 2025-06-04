import Link from 'next/link';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <div className="bg-white p-8 rounded-xl shadow-lg">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Terms of Service</h1>
            <p className="text-gray-600">Last updated: {new Date().toLocaleDateString()}</p>
          </div>

          <div className="space-y-6 text-gray-700">
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Acceptance of Terms</h2>
              <p>
                By accessing and using Gamefordge, you agree to be bound by these Terms of Service. 
                If you do not agree to these terms, please do not use our services.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">2. Description of Service</h2>
              <p>
                Gamefordge is a platform that allows users to build, play, and share games. 
                We provide tools and services for game development, testing, and distribution.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">3. User Accounts</h2>
              <p>
                You must create an account to use certain features of Gamefordge. You are responsible 
                for maintaining the security of your account and any activities that occur under it.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Content Guidelines</h2>
              <p>
                Users are responsible for the content they create and share on Gamefordge. Content 
                must not violate any applicable laws or infringe on others&apos; rights.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">5. Intellectual Property</h2>
              <p>
                Users retain ownership of their original content. By using Gamefordge, you grant us 
                a license to host and share your content on our platform.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">6. Termination</h2>
              <p>
                We reserve the right to terminate or suspend accounts that violate these terms or 
                engage in harmful behavior.
              </p>
            </section>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-200">
            <p className="text-gray-600 text-sm">
              For questions about these terms, please contact us at support@gamefordge.com
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