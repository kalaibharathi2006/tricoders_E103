import { useState, useEffect } from 'react';
import { ArrowLeft, User, Camera, Save } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

interface EditProfileSectionProps {
    onBack: () => void;
}

export function EditProfileSection({ onBack }: EditProfileSectionProps) {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const [formData, setFormData] = useState({
        full_name: '',
        phone_number: '',
        bio: '',
        avatar_url: '',
    });

    useEffect(() => {
        loadProfile();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    const loadProfile = async () => {
        if (!user) return;

        setLoading(true);
        setError(null);

        try {
            const { data, error: fetchError } = await supabase
                .from('users_profile')
                .select('full_name, phone_number, bio, avatar_url')
                .eq('id', user.id)
                .maybeSingle<any>();

            if (fetchError) throw fetchError;

            if (data) {
                setFormData({
                    full_name: data.full_name || '',
                    phone_number: data.phone_number || '',
                    bio: data.bio || '',
                    avatar_url: data.avatar_url || '',
                });
            }
        } catch (err: any) {
            setError(err.message || 'Failed to load profile');
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
            const { error: updateError } = await (supabase
                .from('users_profile') as any)
                .update({
                    full_name: formData.full_name,
                    phone_number: formData.phone_number,
                    bio: formData.bio,
                    avatar_url: formData.avatar_url,
                    updated_at: new Date().toISOString(),
                } as any)
                .eq('id', user.id);

            if (updateError) throw updateError;

            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        } catch (err: any) {
            setError(err.message || 'Failed to save profile');
        } finally {
            setSaving(false);
        }
    };

    const handleInputChange = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        setError(null);
        setSuccess(false);
    };

    if (loading) {
        return (
            <div className="p-6">
                <div className="flex items-center gap-3 mb-6">
                    <button onClick={onBack} className="text-gray-600 hover:text-gray-800">
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <h3 className="text-xl font-semibold text-gray-800">Edit Profile</h3>
                </div>
                <div className="flex items-center justify-center py-12">
                    <div className="text-gray-500">Loading profile...</div>
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
                <h3 className="text-xl font-semibold text-gray-800">Edit Profile</h3>
            </div>

            {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                    {error}
                </div>
            )}

            {success && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
                    Profile updated successfully!
                </div>
            )}

            <div className="space-y-5">
                {/* Avatar Section */}
                <div className="flex flex-col items-center gap-3 pb-5 border-b border-gray-200">
                    <div className="relative">
                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-3xl font-semibold shadow-lg">
                            {formData.avatar_url ? (
                                <img
                                    src={formData.avatar_url}
                                    alt="Avatar"
                                    className="w-full h-full rounded-full object-cover"
                                />
                            ) : (
                                <User className="w-12 h-12" />
                            )}
                        </div>
                        <button className="absolute bottom-0 right-0 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center border-2 border-gray-200 hover:bg-gray-50 transition-colors">
                            <Camera className="w-4 h-4 text-gray-600" />
                        </button>
                    </div>
                    <p className="text-xs text-gray-500">Click camera icon to change avatar</p>
                </div>

                {/* Email (Read-only) */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                    </label>
                    <input
                        type="email"
                        value={user?.email || ''}
                        disabled
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                    />
                    <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                </div>

                {/* Full Name */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        value={formData.full_name}
                        onChange={(e) => handleInputChange('full_name', e.target.value)}
                        placeholder="Enter your full name"
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                </div>

                {/* Phone Number */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                    </label>
                    <input
                        type="tel"
                        value={formData.phone_number}
                        onChange={(e) => handleInputChange('phone_number', e.target.value)}
                        placeholder="+1 (555) 000-0000"
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                </div>

                {/* Bio */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Bio
                    </label>
                    <textarea
                        value={formData.bio}
                        onChange={(e) => handleInputChange('bio', e.target.value)}
                        placeholder="Tell us about yourself..."
                        rows={4}
                        maxLength={500}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                        {formData.bio.length}/500 characters
                    </p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                    <button
                        onClick={handleSave}
                        disabled={saving || !formData.full_name}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
                    >
                        <Save className="w-4 h-4" />
                        {saving ? 'Saving...' : 'Save Changes'}
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
