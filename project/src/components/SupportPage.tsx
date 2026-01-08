import { ArrowLeft, HelpCircle, Book, MessageCircle } from 'lucide-react';

interface SupportPageProps {
    onBack: () => void;
}

export function SupportPage({ onBack }: SupportPageProps) {
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
                    <h1 className="text-3xl font-bold text-gray-800 mb-6">Support Center</h1>

                    <div className="space-y-8">
                        <div>
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">How can we help you?</h2>
                            <div className="grid md:grid-cols-3 gap-4">
                                <div className="bg-blue-50 p-6 rounded-lg text-center">
                                    <HelpCircle className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                                    <h3 className="font-semibold text-gray-800 mb-2">FAQs</h3>
                                    <p className="text-sm text-gray-600">Find answers to common questions</p>
                                </div>
                                <div className="bg-green-50 p-6 rounded-lg text-center">
                                    <Book className="w-8 h-8 text-green-600 mx-auto mb-3" />
                                    <h3 className="font-semibold text-gray-800 mb-2">Documentation</h3>
                                    <p className="text-sm text-gray-600">Learn how to use TriCoders</p>
                                </div>
                                <div className="bg-purple-50 p-6 rounded-lg text-center">
                                    <MessageCircle className="w-8 h-8 text-purple-600 mx-auto mb-3" />
                                    <h3 className="font-semibold text-gray-800 mb-2">Live Chat</h3>
                                    <p className="text-sm text-gray-600">Chat with our support team</p>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">Frequently Asked Questions</h2>
                            <div className="space-y-4">
                                <div className="border border-gray-200 rounded-lg p-4">
                                    <h3 className="font-semibold text-gray-800 mb-2">How do I add a new workspace?</h3>
                                    <p className="text-gray-600">Click on the Workspace dropdown in the top navigation and select "+ Add Workspace". You can create up to 5 workspaces.</p>
                                </div>
                                <div className="border border-gray-200 rounded-lg p-4">
                                    <h3 className="font-semibold text-gray-800 mb-2">How do I enroll in new apps?</h3>
                                    <p className="text-gray-600">Click on the "Enrolled" dropdown in the top navigation and check the apps you want to add to your dashboard.</p>
                                </div>
                                <div className="border border-gray-200 rounded-lg p-4">
                                    <h3 className="font-semibold text-gray-800 mb-2">Can I use apps offline?</h3>
                                    <p className="text-gray-600">Most apps require an internet connection as they are web-based. However, your tasks and workspace data are synced when you're online.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
