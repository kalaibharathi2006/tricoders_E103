import { useState } from 'react';
import { ArrowLeft, ChevronDown, ChevronUp, Search, BookOpen, Lightbulb, Zap, MessageCircle } from 'lucide-react';

interface HelpSectionProps {
    onBack: () => void;
    onOpenFeedback?: () => void;
}

interface FAQItem {
    question: string;
    answer: string;
    category: string;
}

const faqs: FAQItem[] = [
    {
        category: 'Getting Started',
        question: 'How do I add apps to my dashboard?',
        answer: 'Click on the "Add App" button in your dashboard, select the apps you want to add from the available list, and they will appear in your workspace. You can rearrange them by dragging and dropping.',
    },
    {
        category: 'Getting Started',
        question: 'How does the AI task prioritization work?',
        answer: 'Our AI analyzes your tasks based on deadlines, importance, dependencies, and your work patterns to suggest the optimal order for completing them. The priority score ranges from 0-100.',
    },
    {
        category: 'Tasks',
        question: 'Can I create manual tasks?',
        answer: 'Yes! Click the "Add Task" button to create manual tasks. You can set the title, description, deadline, priority, and assign it to specific apps or workspaces.',
    },
    {
        category: 'Tasks',
        question: 'What do the urgency levels mean?',
        answer: 'Tasks are categorized as Low, Medium, High, or Critical based on their deadlines and importance. Critical tasks require immediate attention, while Low priority tasks can be scheduled for later.',
    },
    {
        category: 'Notifications',
        question: 'How do I manage notifications?',
        answer: 'Go to Settings > Notifications to control email and push notifications. You can enable or disable each type based on your preferences.',
    },
    {
        category: 'Workspaces',
        question: 'What are workspaces?',
        answer: 'Workspaces help you organize your apps and tasks by context (e.g., Personal, Work, Projects). You can create multiple workspaces and switch between them easily.',
    },
    {
        category: 'Privacy',
        question: 'Is my data secure?',
        answer: 'Yes! We use industry-standard encryption and security practices. Your data is stored securely, and we never share it with third parties without your consent.',
    },
    {
        category: 'AI Features',
        question: 'How can I improve AI recommendations?',
        answer: 'The AI learns from your behavior over time. Provide feedback on task priorities, complete tasks regularly, and the system will adapt to your work style for better recommendations.',
    },
];

export function HelpSection({ onBack, onOpenFeedback }: HelpSectionProps) {
    const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    const filteredFAQs = faqs.filter(
        (faq) =>
            faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
            faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
            faq.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const categories = Array.from(new Set(faqs.map((faq) => faq.category)));

    return (
        <div className="p-6">
            <div className="flex items-center gap-3 mb-6">
                <button
                    onClick={onBack}
                    className="text-gray-600 hover:text-gray-800 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <h3 className="text-xl font-semibold text-gray-800">Help & Support</h3>
            </div>

            {/* Search Bar */}
            <div className="mb-6">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search for help..."
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                </div>
            </div>

            {/* Quick Links */}
            <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
                    <BookOpen className="w-6 h-6 text-blue-600 mb-2" />
                    <h4 className="font-semibold text-gray-800 text-sm mb-1">Documentation</h4>
                    <p className="text-xs text-gray-600">Complete user guide</p>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
                    <Lightbulb className="w-6 h-6 text-purple-600 mb-2" />
                    <h4 className="font-semibold text-gray-800 text-sm mb-1">Tips & Tricks</h4>
                    <p className="text-xs text-gray-600">Maximize productivity</p>
                </div>
            </div>

            {/* FAQ Section */}
            <div className="space-y-4 mb-6">
                <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                    Frequently Asked Questions
                </h4>

                {categories.map((category) => {
                    const categoryFAQs = filteredFAQs.filter((faq) => faq.category === category);
                    if (categoryFAQs.length === 0) return null;

                    return (
                        <div key={category} className="space-y-2">
                            <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 uppercase tracking-wide">
                                <Zap className="w-3 h-3" />
                                {category}
                            </div>
                            {categoryFAQs.map((faq) => {
                                const globalIndex = faqs.indexOf(faq);
                                const isExpanded = expandedFAQ === globalIndex;

                                return (
                                    <div
                                        key={globalIndex}
                                        className="border border-gray-200 rounded-lg overflow-hidden"
                                    >
                                        <button
                                            onClick={() => setExpandedFAQ(isExpanded ? null : globalIndex)}
                                            className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
                                        >
                                            <span className="font-medium text-gray-800 text-sm pr-4">
                                                {faq.question}
                                            </span>
                                            {isExpanded ? (
                                                <ChevronUp className="w-5 h-5 text-gray-500 flex-shrink-0" />
                                            ) : (
                                                <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
                                            )}
                                        </button>
                                        {isExpanded && (
                                            <div className="px-4 pb-4 text-sm text-gray-600 border-t border-gray-100 pt-3">
                                                {faq.answer}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    );
                })}

                {filteredFAQs.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                        No results found for "{searchQuery}"
                    </div>
                )}
            </div>

            {/* Contact Support */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-5 text-white">
                <div className="flex items-start gap-3">
                    <MessageCircle className="w-6 h-6 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                        <h4 className="font-semibold mb-1">Still need help?</h4>
                        <p className="text-sm text-blue-100 mb-3">
                            Can't find what you're looking for? Send us your question and we'll get back to you.
                        </p>
                        <button
                            onClick={() => {
                                onBack();
                                onOpenFeedback?.();
                            }}
                            className="px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium text-sm"
                        >
                            Contact Support
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
