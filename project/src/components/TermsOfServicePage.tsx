import { ArrowLeft } from 'lucide-react';

interface TermsOfServicePageProps {
    onBack: () => void;
}

export function TermsOfServicePage({ onBack }: TermsOfServicePageProps) {
    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-4xl mx-auto">
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Dashboard
                </button>

                <div className="bg-white rounded-xl p-8 shadow-sm">
                    <h1 className="text-3xl font-bold text-gray-800 mb-6">Terms of Service</h1>

                    <div className="prose max-w-none space-y-6 text-gray-600">
                        <p className="text-sm text-gray-500">Last updated: January 8, 2026</p>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-800 mb-3">1. Acceptance of Terms</h2>
                            <p>
                                By accessing and using TriCoders, you accept and agree to be bound by the terms and provision of this agreement.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-800 mb-3">2. Use License</h2>
                            <p>
                                Permission is granted to temporarily use TriCoders for personal, non-commercial use only. This is the grant of a license, not a transfer of title.
                            </p>
                            <p className="mt-2">Under this license you may not:</p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Modify or copy the materials</li>
                                <li>Use the materials for any commercial purpose</li>
                                <li>Attempt to decompile or reverse engineer any software</li>
                                <li>Remove any copyright or proprietary notations</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-800 mb-3">3. User Accounts</h2>
                            <p>
                                You are responsible for maintaining the confidentiality of your account and password. You agree to accept responsibility for all activities that occur under your account.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-800 mb-3">4. Service Availability</h2>
                            <p>
                                We strive to provide continuous service but do not guarantee that TriCoders will be available at all times. We may experience hardware, software, or other problems that could lead to interruptions or delays.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-800 mb-3">5. Limitation of Liability</h2>
                            <p>
                                TriCoders shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use the service.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-800 mb-3">6. Changes to Terms</h2>
                            <p>
                                We reserve the right to modify these terms at any time. We will notify users of any material changes via email or through the service.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-800 mb-3">7. Contact Information</h2>
                            <p>
                                Questions about the Terms of Service should be sent to us at legal@tricoders.com
                            </p>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
}
