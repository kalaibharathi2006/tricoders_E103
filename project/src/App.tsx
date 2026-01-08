import { useState, useEffect } from 'react';
import { useAuth } from './contexts/AuthContext';
import { AuthPage } from './components/AuthPage';
import { AppSelectionModal } from './components/AppSelectionModal';
import { Dashboard } from './components/Dashboard';
import { supabase } from './lib/supabase';

interface Workspace {
  id: string;
  user_id: string;
  name: string;
  is_default: boolean;
}

function App() {
  const { user, loading } = useAuth();
  const [showAppSelection, setShowAppSelection] = useState(false);

  useEffect(() => {
    if (user) {
      checkUserApps();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const checkUserApps = async () => {
    if (!user) return;

    const { data } = await supabase
      .from('user_apps')
      .select('id')
      .eq('user_id', user.id)
      .eq('is_active', true)
      .limit(1);

    if (!data || data.length === 0) {
      setShowAppSelection(true);
    } else {
      setShowAppSelection(false);
    }
  };

  const handleAppSelectionComplete = async (selectedAppIds: string[]) => {
    if (!user) return;

    const { data: workspace } = await supabase
      .from('workspaces')
      .select('id')
      .eq('user_id', user.id)
      .eq('is_default', true)
      .maybeSingle<Pick<Workspace, 'id'>>();

    const workspaceId = workspace?.id || null;

    const userApps = selectedAppIds.map((appId, index) => ({
      user_id: user.id,
      app_id: appId,
      workspace_id: workspaceId,
      is_active: true,
      display_order: index,
    }));

    await supabase.from('user_apps').insert(userApps as any);

    await generateSampleData(user.id, workspaceId);

    setShowAppSelection(false);
  };

  const handleAppSelectionCancel = () => {
    window.close();
  };

  const generateSampleData = async (userId: string, workspaceId: string | null) => {
    const sampleTasks = [
      {
        user_id: userId,
        workspace_id: workspaceId,
        title: 'Review project proposal',
        description: 'Review the Q1 project proposal and provide feedback',
        status: 'pending',
        priority_score: 85,
        urgency_level: 'high',
        deadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
        completion_percentage: 0,
        is_ai_generated: true,
        source_type: 'email',
      },
      {
        user_id: userId,
        workspace_id: workspaceId,
        title: 'Prepare presentation slides',
        description: 'Create slides for the upcoming client meeting',
        status: 'in_progress',
        priority_score: 90,
        urgency_level: 'critical',
        deadline: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
        completion_percentage: 45,
        is_ai_generated: true,
        source_type: 'meeting',
      },
      {
        user_id: userId,
        workspace_id: workspaceId,
        title: 'Update documentation',
        description: 'Update the API documentation with new endpoints',
        status: 'pending',
        priority_score: 60,
        urgency_level: 'medium',
        deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        completion_percentage: 0,
        is_ai_generated: true,
        source_type: 'document',
      },
    ];

    await supabase.from('tasks').insert(sampleTasks as any);

    const sampleNotification = {
      user_id: userId,
      notification_type: 'type2_reminder',
      title: 'Upcoming Meeting',
      message: 'You have a team meeting in 30 minutes',
      priority: 'medium',
      status: 'pending',
    };

    await supabase.from('notifications').insert(sampleNotification as any);

    const workHabit = {
      user_id: userId,
      analysis_date: new Date().toISOString().split('T')[0],
      total_tasks: 12,
      completed_tasks: 9,
      productivity_score: 85,
      context_switches: 15,
      avg_working_hours: 7.5,
      overload_indicator: false,
      ignored_priorities_count: 2,
      insights: {
        summary: 'Great productivity today! You completed most of your high-priority tasks.',
        suggestions: ['Consider taking breaks between tasks', 'Focus time between 9-11 AM is optimal'],
      },
    };

    await supabase.from('work_habits').insert(workHabit as any);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <AuthPage />;
  }

  return (
    <>
      {showAppSelection && (
        <AppSelectionModal
          userId={user.id}
          onComplete={handleAppSelectionComplete}
          onCancel={handleAppSelectionCancel}
        />
      )}
      <Dashboard userId={user.id} />
    </>
  );
}

export default App;
