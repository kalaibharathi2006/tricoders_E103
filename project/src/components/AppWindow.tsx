import { X, Minus, ExternalLink, RefreshCw } from 'lucide-react';
import { Database } from '../lib/database.types';

type UserApp = Database['public']['Tables']['user_apps']['Row'] & {
    app: Database['public']['Tables']['available_apps']['Row'];
};

interface AppWindowProps {
    userApp: UserApp;
    onClose: () => void;
    onMinimize: () => void;
}

export function AppWindow({ userApp, onClose, onMinimize }: AppWindowProps) {
    return (
        <div className="fixed left-4 top-4 right-28 bottom-24 bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-200 flex flex-col z-40 animate-in fade-in zoom-in duration-200">
            {/* Window Header */}
            <div className="h-10 bg-gray-50 border-b border-gray-200 flex items-center justify-between px-4 select-none">
                <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        {/* We could render the icon here if we passed it or fetched it, roughly matching design */}
                        {userApp.app.name}
                    </span>
                </div>

                <div className="flex items-center gap-1">
                    <button
                        onClick={() => window.open(userApp.app.redirect_url || '#', '_blank')}
                        className="p-1.5 hover:bg-gray-200 rounded-md text-gray-500 transition-colors"
                        title="Open in new tab"
                    >
                        <ExternalLink className="w-4 h-4" />
                    </button>
                    <button
                        onClick={onMinimize}
                        className="p-1.5 hover:bg-gray-200 rounded-md text-gray-500 transition-colors"
                        title="Minimize"
                    >
                        <Minus className="w-4 h-4" />
                    </button>
                    <button
                        onClick={onClose}
                        className="p-1.5 hover:bg-red-100 hover:text-red-600 rounded-md text-gray-500 transition-colors"
                        title="Close"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* App Content (Iframe) */}
            <div className="flex-1 bg-white relative">
                {userApp.app.redirect_url ? (
                    <iframe
                        src={userApp.app.redirect_url}
                        className="w-full h-full border-none"
                        title={userApp.app.name}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                        No URL configured for this app
                    </div>
                )}
            </div>
        </div>
    );
}
