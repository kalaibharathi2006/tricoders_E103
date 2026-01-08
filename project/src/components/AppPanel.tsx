import { X, ListTodo, ExternalLink } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { Database } from '../lib/database.types';

type AvailableApp = Database['public']['Tables']['available_apps']['Row'];

interface AppPanelProps {
  app: AvailableApp;
  taskCount: number;
  onUnenroll: () => void;
  onShowTasks: () => void;
  onRedirect: () => void;
}

export function AppPanel({ app, taskCount, onUnenroll, onShowTasks, onRedirect }: AppPanelProps) {
  const getIconComponent = (iconName: string) => {
    const Icon = (LucideIcons as any)[iconName] || LucideIcons.Package;
    return Icon;
  };

  const Icon = getIconComponent(app.icon);

  return (
    <div
      onClick={onRedirect}
      className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow cursor-pointer group"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
            <Icon className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">{app.name}</h3>
            <p className="text-sm text-gray-500">{taskCount} tasks</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onUnenroll();
            }}
            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Unenroll"
          >
            <X className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onShowTasks();
            }}
            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="Show tasks"
          >
            <ListTodo className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRedirect();
            }}
            className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
            title="Open app"
          >
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Category</span>
          <span className="text-gray-800 font-medium capitalize">{app.category}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Status</span>
          <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
            Active
          </span>
        </div>
      </div>
    </div>
  );
}
