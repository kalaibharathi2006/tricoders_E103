import { X, User, Settings, HelpCircle, MessageSquare, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { EditProfileSection } from './profile/EditProfileSection';
import { SettingsSection } from './profile/SettingsSection';
import { HelpSection } from './profile/HelpSection';
import { FeedbackSection } from './profile/FeedbackSection';

interface ProfileMenuProps {
  onClose: () => void;
}

type Section = 'main' | 'edit' | 'settings' | 'help' | 'feedback';

export function ProfileMenu({ onClose }: ProfileMenuProps) {
  const { user, signOut } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [activeSection, setActiveSection] = useState<Section>('main');

  useEffect(() => {
    if (user) {
      loadProfile();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const loadProfile = async () => {
    if (!user) return;

    const { data } = await supabase
      .from('users_profile')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();

    if (data) {
      setProfile(data);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    onClose();
  };

  const handleBackToMain = () => {
    setActiveSection('main');
    loadProfile(); // Reload profile data when returning to main
  };

  // Render section based on active state
  if (activeSection === 'edit') {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
          <EditProfileSection onBack={handleBackToMain} />
        </div>
      </div>
    );
  }

  if (activeSection === 'settings') {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
          <SettingsSection onBack={handleBackToMain} />
        </div>
      </div>
    );
  }

  if (activeSection === 'help') {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
          <HelpSection
            onBack={handleBackToMain}
            onOpenFeedback={() => setActiveSection('feedback')}
          />
        </div>
      </div>
    );
  }

  if (activeSection === 'feedback') {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
          <FeedbackSection onBack={handleBackToMain} />
        </div>
      </div>
    );
  }

  // Main profile menu
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-white">Profile</h2>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center">
              <User className="w-10 h-10 text-blue-600" />
            </div>
            <div>
              <p className="text-white font-semibold text-lg">
                {profile?.full_name || 'User'}
              </p>
              <p className="text-blue-100 text-sm">{user?.email}</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <button
            onClick={() => setActiveSection('edit')}
            className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <User className="w-5 h-5 text-gray-600" />
            <span className="font-medium">Edit Profile</span>
          </button>

          <button
            onClick={() => setActiveSection('settings')}
            className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <Settings className="w-5 h-5 text-gray-600" />
            <span className="font-medium">Settings</span>
          </button>

          <button
            onClick={() => setActiveSection('help')}
            className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <HelpCircle className="w-5 h-5 text-gray-600" />
            <span className="font-medium">Help</span>
          </button>

          <button
            onClick={() => setActiveSection('feedback')}
            className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <MessageSquare className="w-5 h-5 text-gray-600" />
            <span className="font-medium">Feedback</span>
          </button>

          <div className="pt-4 border-t border-gray-200">
            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
