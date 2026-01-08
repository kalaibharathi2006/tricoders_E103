import { ArrowRight, Sparkles, Command, AppWindow } from 'lucide-react';
import { Database } from '../lib/database.types';

type App = Database['public']['Tables']['available_apps']['Row'];

interface SearchResult {
    type: 'app' | 'action' | 'navigation';
    id: string;
    title: string;
    subtitle?: string;
    icon?: any;
    action?: () => void;
}

interface SearchResultsProps {
    query: string;
    results: SearchResult[];
    aiInsight: {
        type: 'insight' | 'suggestion' | 'action';
        text: string;
        confidence: number;
    } | null;
    isVisible: boolean;
    onSelect: (result: SearchResult) => void;
}

export function SearchResults({ query, results, aiInsight, isVisible, onSelect }: SearchResultsProps) {
    if (!isVisible || !query) return null;

    return (
        <div className="absolute top-full mt-2 left-0 w-96 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden z-50">
            {/* AI Insight Section */}
            {aiInsight && (
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 border-b border-blue-100">
                    <div className="flex items-start gap-3">
                        <div className="p-2 bg-white rounded-lg shadow-sm">
                            <Sparkles className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-xs font-semibold text-blue-600 mb-1 uppercase tracking-wide">
                                TriCoders AI Intelligence
                            </p>
                            <p className="text-sm text-gray-700 leading-relaxed">
                                {aiInsight.text}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Results List */}
            <div className="max-h-[400px] overflow-y-auto py-2">
                {results.length > 0 ? (
                    <>
                        <div className="px-3 py-1.5 text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Best Matches
                        </div>
                        {results.map((result) => (
                            <button
                                key={`${result.type}-${result.id}`}
                                onClick={() => onSelect(result)}
                                className="w-full px-4 py-3 hover:bg-gray-50 flex items-center gap-3 transition-colors group"
                            >
                                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-white group-hover:shadow-sm transition-all">
                                    {result.icon ? (
                                        <result.icon className="w-5 h-5 text-gray-600" />
                                    ) : (
                                        <Command className="w-5 h-5 text-gray-400" />
                                    )}
                                </div>
                                <div className="flex-1 text-left">
                                    <p className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                                        {result.title}
                                    </p>
                                    {result.subtitle && (
                                        <p className="text-xs text-gray-500">
                                            {result.subtitle}
                                        </p>
                                    )}
                                </div>
                                <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-blue-600 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                            </button>
                        ))}
                    </>
                ) : (
                    !aiInsight && (
                        <div className="p-8 text-center">
                            <p className="text-gray-500 text-sm">No direct matches found</p>
                        </div>
                    )
                )}
            </div>

            {/* Footer */}
            <div className="px-4 py-2 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400">
                <span>Use arrow keys to navigate</span>
                <span>Enter to select</span>
            </div>
        </div>
    );
}
