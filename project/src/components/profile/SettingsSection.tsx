import { useState, useEffect } from 'react';
import { ArrowLeft, Moon, Sun, Monitor, Bell, BellOff, Globe, Clock, Save } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

interface SettingsSectionProps {
    onBack: () => void;
}

export function SettingsSection({ onBack }: SettingsSectionProps) {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const [settings, setSettings] = useState({
        theme_preference: 'system' as 'light' | 'dark' | 'system',
        notification_email: true,
        notification_push: true,
        language: 'en',
        timezone: 'UTC',
    });

    useEffect(() => {
        loadSettings();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    const loadSettings = async () => {
        if (!user) return;

        setLoading(true);
        setError(null);

        try {
            const { data, error: fetchError } = await (supabase
                .from('users_profile')
                .select('*')
                .eq('id', user.id)
                .maybeSingle() as any);

            if (fetchError) throw fetchError;

            if (data) {
                setSettings({
                    theme_preference: (data.theme_preference as any) || 'system',
                    notification_email: data.notification_email ?? true,
                    notification_push: data.notification_push ?? true,
                    language: data.language || 'en',
                    timezone: data.timezone || 'UTC',
                });
            }
        } catch (err: any) {
            console.error('Failed to load settings:', err);
            setError(err.message || 'Failed to load settings');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!user) return;

        setSaving(true);
        setError(null);
        setSuccess(false);

        try {
            const { error: updateError } = await (supabase.from('users_profile') as any)
                .update({
                    theme_preference: settings.theme_preference,
                    notification_email: settings.notification_email,
                    notification_push: settings.notification_push,
                    language: settings.language,
                    timezone: settings.timezone,
                    updated_at: new Date().toISOString(),
                } as any)
                .eq('id', user.id);

            if (updateError) throw updateError;

            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        } catch (err: any) {
            setError(err.message || 'Failed to save settings');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="p-6">
                <div className="flex items-center gap-3 mb-6">
                    <button onClick={onBack} className="text-gray-600 hover:text-gray-800">
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <h3 className="text-xl font-semibold text-gray-800">Settings</h3>
                </div>
                <div className="flex items-center justify-center py-12">
                    <div className="text-gray-500">Loading settings...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="flex items-center gap-3 mb-6">
                <button
                    onClick={onBack}
                    className="text-gray-600 hover:text-gray-800 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <h3 className="text-xl font-semibold text-gray-800">Settings</h3>
            </div>

            {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                    {error}
                </div>
            )}

            {success && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
                    Settings saved successfully!
                </div>
            )}

            <div className="space-y-6">
                {/* Appearance Section */}
                <div className="space-y-3">
                    <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                        Appearance
                    </h4>
                    <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Theme Preference
                        </label>
                        <div className="grid grid-cols-3 gap-3">
                            <button
                                onClick={() => setSettings({ ...settings, theme_preference: 'light' })}
                                className={`flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all ${settings.theme_preference === 'light'
                                    ? 'border-blue-500 bg-blue-50'
                                    : 'border-gray-200 hover:border-gray-300'
                                    }`}
                            >
                                <Sun className="w-5 h-5 text-gray-700" />
                                <span className="text-xs font-medium">Light</span>
                            </button>
                            <button
                                onClick={() => setSettings({ ...settings, theme_preference: 'dark' })}
                                className={`flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all ${settings.theme_preference === 'dark'
                                    ? 'border-blue-500 bg-blue-50'
                                    : 'border-gray-200 hover:border-gray-300'
                                    }`}
                            >
                                <Moon className="w-5 h-5 text-gray-700" />
                                <span className="text-xs font-medium">Dark</span>
                            </button>
                            <button
                                onClick={() => setSettings({ ...settings, theme_preference: 'system' })}
                                className={`flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all ${settings.theme_preference === 'system'
                                    ? 'border-blue-500 bg-blue-50'
                                    : 'border-gray-200 hover:border-gray-300'
                                    }`}
                            >
                                <Monitor className="w-5 h-5 text-gray-700" />
                                <span className="text-xs font-medium">System</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Notifications Section */}
                <div className="space-y-3">
                    <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                        Notifications
                    </h4>
                    <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                {settings.notification_email ? (
                                    <Bell className="w-5 h-5 text-blue-600" />
                                ) : (
                                    <BellOff className="w-5 h-5 text-gray-400" />
                                )}
                                <div>
                                    <p className="text-sm font-medium text-gray-700">Email Notifications</p>
                                    <p className="text-xs text-gray-500">Receive updates via email</p>
                                </div>
                            </div>
                            <button
                                onClick={() =>
                                    setSettings({ ...settings, notification_email: !settings.notification_email })
                                }
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.notification_email ? 'bg-blue-600' : 'bg-gray-300'
                                    }`}
                            >
                                <span
                                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.notification_email ? 'translate-x-6' : 'translate-x-1'
                                        }`}
                                />
                            </button>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                {settings.notification_push ? (
                                    <Bell className="w-5 h-5 text-blue-600" />
                                ) : (
                                    <BellOff className="w-5 h-5 text-gray-400" />
                                )}
                                <div>
                                    <p className="text-sm font-medium text-gray-700">Push Notifications</p>
                                    <p className="text-xs text-gray-500">Receive browser notifications</p>
                                </div>
                            </div>
                            <button
                                onClick={() =>
                                    setSettings({ ...settings, notification_push: !settings.notification_push })
                                }
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.notification_push ? 'bg-blue-600' : 'bg-gray-300'
                                    }`}
                            >
                                <span
                                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.notification_push ? 'translate-x-6' : 'translate-x-1'
                                        }`}
                                />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Language & Region Section */}
                <div className="space-y-3">
                    <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                        Language & Region
                    </h4>
                    <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                <Globe className="w-4 h-4" />
                                Language
                            </label>
                            <select
                                value={settings.language}
                                onChange={(e) => setSettings({ ...settings, language: e.target.value })}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            >
                                <option value="en">English</option>
                                <option value="es">Spanish</option>
                                <option value="fr">French</option>
                                <option value="de">German</option>
                                <option value="zh">Chinese</option>
                                <option value="ja">Japanese</option>
                            </select>
                        </div>

                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                <Clock className="w-4 h-4" />
                                Timezone
                            </label>
                            <select
                                value={settings.timezone}
                                onChange={(e) => setSettings({ ...settings, timezone: e.target.value })}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            >
                                <option value="UTC">UTC (Coordinated Universal Time)</option>
                                <option value="America/New_York">Eastern Time (ET)</option>
                                <option value="America/Chicago">Central Time (CT)</option>
                                <option value="America/Denver">Mountain Time (MT)</option>
                                <option value="America/Los_Angeles">Pacific Time (PT)</option>
                                <option value="Europe/London">London (GMT)</option>
                                <option value="Europe/Paris">Paris (CET)</option>
                                <option value="Asia/Tokyo">Tokyo (JST)</option>
                                <option value="Asia/Shanghai">Shanghai (CST)</option>
                                <option value="Asia/Kolkata">India (IST)</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
                    >
                        <Save className="w-4 h-4" />
                        {saving ? 'Saving...' : 'Save Settings'}
                    </button>
                    <button
                        onClick={onBack}
                        disabled={saving}
                        className="px-4 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors font-medium"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}
