import { ArrowLeft } from 'lucide-react';

interface PrivacyPolicyPageProps {
    onBack: () => void;
}

export function PrivacyPolicyPage({ onBack }: PrivacyPolicyPageProps) {
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
                    <h1 className="text-3xl font-bold text-gray-800 mb-6">Privacy Policy</h1>

                    <div className="prose max-w-none space-y-6 text-gray-600">
                        <p className="text-sm text-gray-500">Last updated: January 8, 2026</p>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-800 mb-3">1. Information We Collect</h2>
                            <p>We collect information you provide directly to us, including:</p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Account information (name, email address)</li>
                                <li>Workspace and task data</li>
                                <li>App usage and preferences</li>
                                <li>Communication data when you contact support</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-800 mb-3">2. How We Use Your Information</h2>
                            <p>We use the information we collect to:</p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Provide, maintain, and improve our services</li>
                                <li>Personalize your experience</li>
                                <li>Send you technical notices and support messages</li>
                                <li>Respond to your comments and questions</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-800 mb-3">3. Data Security</h2>
                            <p>
                                We implement appropriate technical and organizational measures to protect your personal data against unauthorized or unlawful processing, accidental loss, destruction, or damage.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-800 mb-3">4. Your Rights</h2>
                            <p>You have the right to:</p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Access your personal data</li>
                                <li>Correct inaccurate data</li>
                                <li>Request deletion of your data</li>
                                <li>Export your data</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-800 mb-3">5. Contact Us</h2>
                            <p>
                                If you have any questions about this Privacy Policy, please contact us at privacy@tricoders.com
                            </p>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
}
