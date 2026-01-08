import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

interface WorkAnalysisRequest {
  user_id: string;
  date?: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { user_id, date }: WorkAnalysisRequest = await req.json();
    const analysisDate = date || new Date().toISOString().split('T')[0];

    const startOfDay = new Date(analysisDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(analysisDate);
    endOfDay.setHours(23, 59, 59, 999);

    const { data: activities } = await supabase
      .from('activities')
      .select('*')
      .eq('user_id', user_id)
      .gte('timestamp', startOfDay.toISOString())
      .lte('timestamp', endOfDay.toISOString());

    const { data: tasks } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', user_id)
      .gte('created_at', startOfDay.toISOString())
      .lte('created_at', endOfDay.toISOString());

    const { data: completedTasks } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', user_id)
      .eq('status', 'completed')
      .gte('completed_at', startOfDay.toISOString())
      .lte('completed_at', endOfDay.toISOString());

    const totalTasks = tasks?.length || 0;
    const completed = completedTasks?.length || 0;
    const completionRate = totalTasks > 0 ? (completed / totalTasks) * 100 : 0;

    const contextSwitches = activities?.filter(
      (a) => a.activity_type === 'task_switched'
    ).length || 0;

    const workingHours = activities
      ? activities.reduce((sum, a) => sum + (a.duration_seconds || 0), 0) / 3600
      : 0;

    const highPriorityTasks = tasks?.filter(
      (t) => t.urgency_level === 'high' || t.urgency_level === 'critical'
    ) || [];
    const completedHighPriority = completedTasks?.filter(
      (t) => t.urgency_level === 'high' || t.urgency_level === 'critical'
    ) || [];
    const ignoredPriorities = highPriorityTasks.length - completedHighPriority.length;

    let productivityScore = 50;
    if (completionRate >= 80) productivityScore += 30;
    else if (completionRate >= 60) productivityScore += 20;
    else if (completionRate >= 40) productivityScore += 10;

    if (contextSwitches < 10) productivityScore += 10;
    else if (contextSwitches > 30) productivityScore -= 10;

    if (workingHours >= 6 && workingHours <= 9) productivityScore += 10;
    else if (workingHours > 10) productivityScore -= 15;

    productivityScore = Math.max(0, Math.min(100, productivityScore));

    const overloadIndicator = workingHours > 10 || contextSwitches > 40 || ignoredPriorities > 5;

    const insights: any = {
      summary: '',
      patterns: [],
      suggestions: [],
      concerns: [],
    };

    if (completionRate >= 80) {
      insights.summary = 'Excellent productivity today! You completed most of your tasks.';
      insights.patterns.push('High task completion rate');
    } else if (completionRate >= 60) {
      insights.summary = 'Good productivity today with room for improvement.';
      insights.patterns.push('Moderate task completion rate');
    } else {
      insights.summary = 'Focus and prioritization could be improved.';
      insights.patterns.push('Low task completion rate');
      insights.concerns.push('Many tasks remain incomplete');
    }

    if (contextSwitches > 30) {
      insights.concerns.push('Frequent context switching detected');
      insights.suggestions.push('Try time-blocking to reduce context switches');
    }

    if (workingHours > 10) {
      insights.concerns.push('Long working hours detected');
      insights.suggestions.push('Consider taking regular breaks to avoid burnout');
    }

    if (ignoredPriorities > 3) {
      insights.concerns.push('High-priority tasks being ignored');
      insights.suggestions.push('Focus on urgent and important tasks first');
    }

    if (workingHours >= 6 && workingHours <= 8 && contextSwitches < 15) {
      insights.patterns.push('Healthy work patterns observed');
      insights.suggestions.push('Keep maintaining your current work rhythm');
    }

    const workHabitData = {
      user_id,
      analysis_date: analysisDate,
      total_tasks: totalTasks,
      completed_tasks: completed,
      productivity_score: productivityScore,
      context_switches: contextSwitches,
      avg_working_hours: workingHours,
      overload_indicator: overloadIndicator,
      ignored_priorities_count: ignoredPriorities,
      insights,
    };

    const { data: existingHabit } = await supabase
      .from('work_habits')
      .select('id')
      .eq('user_id', user_id)
      .eq('analysis_date', analysisDate)
      .maybeSingle();

    if (existingHabit) {
      await supabase
        .from('work_habits')
        .update(workHabitData)
        .eq('id', existingHabit.id);
    } else {
      await supabase.from('work_habits').insert(workHabitData);
    }

    return new Response(
      JSON.stringify({
        success: true,
        analysis: workHabitData,
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  }
});