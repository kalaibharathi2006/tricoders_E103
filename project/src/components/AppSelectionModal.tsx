import { useState, useEffect } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Database } from '../lib/database.types';

type AvailableApp = Database['public']['Tables']['available_apps']['Row'];

interface AppSelectionModalProps {
  onComplete: (selectedAppIds: string[]) => void;
  onCancel: () => void;
  userId: string;
}

export function AppSelectionModal({ onComplete, onCancel, userId }: AppSelectionModalProps) {
  const [apps, setApps] = useState<AvailableApp[]>([]);
  const [selectedApps, setSelectedApps] = useState<Set<string>>(new Set());
  const [showMoreApps, setShowMoreApps] = useState(false);
  const [newAppName, setNewAppName] = useState('');
  const [newAppIcon, setNewAppIcon] = useState('Package');
  const [newAppUrl, setNewAppUrl] = useState('');

  useEffect(() => {
    loadApps();
  }, []);

  const loadApps = async () => {
    const { data, error } = await supabase
      .from('available_apps')
      .select('*')
      .order('name');

    if (!error && data) {
      setApps(data);
    }
  };

  const toggleApp = (appId: string) => {
    const newSelected = new Set(selectedApps);
    if (newSelected.has(appId)) {
      newSelected.delete(appId);
    } else {
      newSelected.add(appId);
    }
    setSelectedApps(newSelected);
  };

  const handleAddCustomApp = async () => {
    if (!newAppName.trim()) return;

    const { data, error } = await supabase
      .from('available_apps')
      .insert({
        name: newAppName,
        icon: newAppIcon,
        category: 'custom',
        is_default: false,
        redirect_url: newAppUrl || null,
      })
      .select()
      .single();

    if (!error && data) {
      setApps([...apps, data]);
      setNewAppName('');
      setNewAppIcon('Package');
      setNewAppUrl('');
    }
  };

  const handleRemoveApp = async (appId: string) => {
    const { error } = await supabase
      .from('available_apps')
      .delete()
      .eq('id', appId);

    if (!error) {
      setApps(apps.filter(app => app.id !== appId));
      selectedApps.delete(appId);
      setSelectedApps(new Set(selectedApps));
    }
  };

  const handleOk = () => {
    if (selectedApps.size === 0) {
      window.close();
      return;
    }
    onComplete(Array.from(selectedApps));
  };

  const getIconComponent = (iconName: string) => {
    const Icon = (LucideIcons as any)[iconName] || LucideIcons.Package;
    return Icon;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-end p-6 border-b border-gray-200">
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {showMoreApps ? (
            <div className="space-y-6">
              <div className="border-b border-gray-200 pb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Add Custom App</h3>
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="App Name"
                    value={newAppName}
                    onChange={(e) => setNewAppName(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <input
                    type="text"
                    placeholder="Icon Name (Lucide React)"
                    value={newAppIcon}
                    onChange={(e) => setNewAppIcon(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <input
                    type="text"
                    placeholder="URL (optional)"
                    value={newAppUrl}
                    onChange={(e) => setNewAppUrl(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    onClick={handleAddCustomApp}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Add App
                  </button>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Manage Apps</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {apps.map((app) => {
                    const Icon = getIconComponent(app.icon);
                    return (
                      <div
                        key={app.id}
                        className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <Icon className="w-5 h-5 text-gray-600" />
                          <span className="text-gray-800">{app.name}</span>
                        </div>
                        <button
                          onClick={() => handleRemoveApp(app.id)}
                          className="text-red-600 hover:text-red-700 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {apps.map((app) => {
                const Icon = getIconComponent(app.icon);
                const isSelected = selectedApps.has(app.id);
                return (
                  <div
                    key={app.id}
                    onClick={() => toggleApp(app.id)}
                    className={`flex flex-col items-center gap-3 p-6 border-2 rounded-lg cursor-pointer transition-all ${isSelected
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                      }`}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => { }}
                      className="w-5 h-5"
                    />
                    <Icon className={`w-10 h-10 ${isSelected ? 'text-blue-600' : 'text-gray-600'}`} />
                    <span className={`text-sm font-medium ${isSelected ? 'text-blue-600' : 'text-gray-700'}`}>
                      {app.name}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onCancel}
            className="px-6 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleOk}
            className="px-6 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
}
