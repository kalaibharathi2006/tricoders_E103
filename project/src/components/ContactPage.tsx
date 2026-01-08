import { ArrowLeft } from 'lucide-react';

interface ContactPageProps {
    onBack: () => void;
}

export function ContactPage({ onBack }: ContactPageProps) {
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
                    <h1 className="text-3xl font-bold text-gray-800 mb-6">Contact Us</h1>

                    <div className="space-y-6">
                        <div>
                            <h2 className="text-xl font-semibold text-gray-800 mb-3">Get in Touch</h2>
                            <p className="text-gray-600 mb-4">
                                We'd love to hear from you! Whether you have questions, feedback, or need assistance, our team is here to help.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="bg-gray-50 p-6 rounded-lg">
                                <h3 className="font-semibold text-gray-800 mb-2">Email</h3>
                                <p className="text-gray-600">support@tricoders.com</p>
                            </div>

                            <div className="bg-gray-50 p-6 rounded-lg">
                                <h3 className="font-semibold text-gray-800 mb-2">Response Time</h3>
                                <p className="text-gray-600">Within 24 hours</p>
                            </div>
                        </div>

                        <div>
                            <h2 className="text-xl font-semibold text-gray-800 mb-3">Send us a Message</h2>
                            <form className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Your name"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                    <input
                                        type="email"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="your.email@example.com"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                                    <textarea
                                        rows={5}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="How can we help you?"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    Send Message
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
