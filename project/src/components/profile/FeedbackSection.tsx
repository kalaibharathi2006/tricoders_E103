import { useState, useEffect } from 'react';
import { ArrowLeft, Send, CheckCircle, Clock, AlertCircle, MessageSquare } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

interface FeedbackSectionProps {
    onBack: () => void;
    preselectedType?: 'bug' | 'feature_request' | 'general' | 'ai_correction';
}

interface FeedbackItem {
    id: string;
    feedback_type: string;
    message: string;
    status: string;
    created_at: string;
}

export function FeedbackSection({ onBack, preselectedType }: FeedbackSectionProps) {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [feedbackHistory, setFeedbackHistory] = useState<FeedbackItem[]>([]);

    const [formData, setFormData] = useState({
        feedback_type: preselectedType || ('general' as 'bug' | 'feature_request' | 'general' | 'ai_correction'),
        message: '',
    });

    useEffect(() => {
        loadFeedbackHistory();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    const loadFeedbackHistory = async () => {
        if (!user) return;

        setLoading(true);

        try {
            const { data, error: fetchError } = await supabase
                .from('feedback')
                .select('id, feedback_type, message, status, created_at')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false })
                .limit(10);

            if (fetchError) throw fetchError;

            setFeedbackHistory((data as unknown as FeedbackItem[]) || []);
        } catch (err: any) {
            console.error('Failed to load feedback history:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async () => {
        if (!user || !formData.message.trim()) return;

        setSubmitting(true);
        setError(null);
        setSuccess(false);

        try {
            const { error: insertError } = await (supabase.from('feedback') as any).insert({
                user_id: user.id,
                feedback_type: formData.feedback_type,
                message: formData.message.trim(),
                status: 'new',
                context: {},
            });

            if (insertError) throw insertError;

            setSuccess(true);
            setFormData({ ...formData, message: '' });
            loadFeedbackHistory();
            setTimeout(() => setSuccess(false), 3000);
        } catch (err: any) {
            setError(err.message || 'Failed to submit feedback');
        } finally {
            setSubmitting(false);
        }
    };

    const getFeedbackTypeLabel = (type: string) => {
        const labels: Record<string, string> = {
            bug: 'Bug Report',
            feature_request: 'Feature Request',
            general: 'General Feedback',
            ai_correction: 'AI Correction',
        };
        return labels[type] || type;
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'new':
                return <Clock className="w-4 h-4 text-blue-500" />;
            case 'reviewing':
                return <AlertCircle className="w-4 h-4 text-yellow-500" />;
            case 'resolved':
                return <CheckCircle className="w-4 h-4 text-green-500" />;
            default:
                return <MessageSquare className="w-4 h-4 text-gray-500" />;
        }
    };

    const getStatusLabel = (status: string) => {
        return status.charAt(0).toUpperCase() + status.slice(1);
    };

    return (
        <div className="p-6">
            <div className="flex items-center gap-3 mb-6">
                <button
                    onClick={onBack}
                    className="text-gray-600 hover:text-gray-800 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <h3 className="text-xl font-semibold text-gray-800">Feedback</h3>
            </div>

            {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                    {error}
                </div>
            )}

            {success && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    Thank you! Your feedback has been submitted successfully.
                </div>
            )}

            {/* Feedback Form */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-5 mb-6 border border-blue-200">
                <h4 className="font-semibold text-gray-800 mb-4">Share Your Feedback</h4>

                <div className="space-y-4">
                    {/* Feedback Type Selector */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Feedback Type
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                            <button
                                onClick={() => setFormData({ ...formData, feedback_type: 'bug' })}
                                className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${formData.feedback_type === 'bug'
                                    ? 'bg-blue-600 text-white shadow-md'
                                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                                    }`}
                            >
                                🐛 Bug Report
                            </button>
                            <button
                                onClick={() => setFormData({ ...formData, feedback_type: 'feature_request' })}
                                className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${formData.feedback_type === 'feature_request'
                                    ? 'bg-blue-600 text-white shadow-md'
                                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                                    }`}
                            >
                                💡 Feature Request
                            </button>
                            <button
                                onClick={() => setFormData({ ...formData, feedback_type: 'general' })}
                                className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${formData.feedback_type === 'general'
                                    ? 'bg-blue-600 text-white shadow-md'
                                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                                    }`}
                            >
                                💬 General
                            </button>
                            <button
                                onClick={() => setFormData({ ...formData, feedback_type: 'ai_correction' })}
                                className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${formData.feedback_type === 'ai_correction'
                                    ? 'bg-blue-600 text-white shadow-md'
                                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                                    }`}
                            >
                                🤖 AI Correction
                            </button>
                        </div>
                    </div>

                    {/* Message Textarea */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Your Message <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            value={formData.message}
                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                            placeholder="Tell us what's on your mind..."
                            rows={5}
                            maxLength={1000}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            {formData.message.length}/1000 characters
                        </p>
                    </div>

                    {/* Submit Button */}
                    <button
                        onClick={handleSubmit}
                        disabled={submitting || !formData.message.trim()}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
                    >
                        <Send className="w-4 h-4" />
                        {submitting ? 'Submitting...' : 'Submit Feedback'}
                    </button>
                </div>
            </div>

            {/* Feedback History */}
            <div>
                <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
                    Your Feedback History
                </h4>

                {loading ? (
                    <div className="text-center py-8 text-gray-500">Loading history...</div>
                ) : feedbackHistory.length === 0 ? (
                    <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
                        No feedback submitted yet
                    </div>
                ) : (
                    <div className="space-y-3">
                        {feedbackHistory.map((item) => (
                            <div
                                key={item.id}
                                className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                            >
                                <div className="flex items-start justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded">
                                            {getFeedbackTypeLabel(item.feedback_type)}
                                        </span>
                                        <div className="flex items-center gap-1">
                                            {getStatusIcon(item.status)}
                                            <span className="text-xs text-gray-600">
                                                {getStatusLabel(item.status)}
                                            </span>
                                        </div>
                                    </div>
                                    <span className="text-xs text-gray-500">
                                        {new Date(item.created_at).toLocaleDateString()}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-700 line-clamp-2">{item.message}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
