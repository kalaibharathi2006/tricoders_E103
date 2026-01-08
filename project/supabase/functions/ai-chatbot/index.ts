import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

interface ChatRequest {
  user_id: string;
  message: string;
  context?: string;
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

    const { user_id, message, context }: ChatRequest = await req.json();

    const messageLower = message.toLowerCase();

    let response = '';

    const { data: tasks } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', user_id)
      .in('status', ['pending', 'in_progress'])
      .order('priority_score', { ascending: false })
      .limit(5);

    const { data: workHabits } = await supabase
      .from('work_habits')
      .select('*')
      .eq('user_id', user_id)
      .order('analysis_date', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (
      messageLower.includes('task') ||
      messageLower.includes('todo') ||
      messageLower.includes('priority')
    ) {
      if (tasks && tasks.length > 0) {
        response = `You currently have ${tasks.length} pending tasks. Here are your top priorities:\n\n`;
        tasks.slice(0, 3).forEach((task, i) => {
          response += `${i + 1}. ${task.title} (Priority: ${task.priority_score}, Urgency: ${
            task.urgency_level
          })\n`;
        });
        response += `\nI recommend focusing on "${tasks[0].title}" first as it has the highest priority.`;
      } else {
        response = "Great job! You don't have any pending tasks at the moment. You're all caught up!";
      }
    } else if (
      messageLower.includes('productiv') ||
      messageLower.includes('performance') ||
      messageLower.includes('how am i doing')
    ) {
      if (workHabits) {
        response = `Your productivity score today is ${workHabits.productivity_score}%. `;
        response += `You've completed ${workHabits.completed_tasks} out of ${workHabits.total_tasks} tasks. `;

        if (workHabits.overload_indicator) {
          response += `\n\nI've noticed signs of potential overload. `;
        }

        if (workHabits.context_switches > 20) {
          response += `You've switched contexts ${workHabits.context_switches} times today. Consider using time-blocking to reduce interruptions. `;
        }

        if (workHabits.avg_working_hours > 9) {
          response += `You've worked ${workHabits.avg_working_hours.toFixed(
            1
          )} hours today. Remember to take breaks to maintain productivity. `;
        }
      } else {
        response =
          "I don't have enough data yet to provide productivity insights. Keep using the platform and I'll analyze your work patterns!";
      }
    } else if (
      messageLower.includes('deadline') ||
      messageLower.includes('due') ||
      messageLower.includes('urgent')
    ) {
      const urgentTasks = tasks?.filter(
        (t) => t.deadline && new Date(t.deadline) <= new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
      );

      if (urgentTasks && urgentTasks.length > 0) {
        response = `You have ${urgentTasks.length} tasks with upcoming deadlines:\n\n`;
        urgentTasks.forEach((task, i) => {
          const daysUntil = Math.ceil(
            (new Date(task.deadline!).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
          );
          response += `${i + 1}. ${task.title} - Due in ${
            daysUntil <= 0 ? 'overdue' : `${daysUntil} days`
          }\n`;
        });
      } else {
        response = "You don't have any tasks with urgent deadlines in the next 3 days.";
      }
    } else if (
      messageLower.includes('help') ||
      messageLower.includes('what can you do') ||
      messageLower.includes('how')
    ) {
      response = `I'm your AI productivity assistant! I can help you with:\n\n`;
      response += `• Viewing and prioritizing your tasks\n`;
      response += `• Understanding your productivity patterns\n`;
      response += `• Tracking upcoming deadlines\n`;
      response += `• Analyzing your work habits\n`;
      response += `• Providing suggestions to improve focus\n\n`;
      response += `Just ask me about your tasks, productivity, deadlines, or work patterns!`;
    } else if (messageLower.includes('suggest') || messageLower.includes('recommend')) {
      if (workHabits && workHabits.insights) {
        const insights = workHabits.insights as any;
        if (insights.suggestions && insights.suggestions.length > 0) {
          response = `Based on your work patterns, here are my suggestions:\n\n`;
          insights.suggestions.forEach((suggestion: string, i: number) => {
            response += `${i + 1}. ${suggestion}\n`;
          });
        } else {
          response = "You're doing great! Keep up your current work habits.";
        }
      } else {
        response = "I need more data to provide personalized suggestions. Keep working and I'll learn your patterns!";
      }
    } else {
      response = `I understand you're asking about "${message}". `;
      response += `I can help you with tasks, productivity analysis, deadlines, and work patterns. `;
      response += `Could you be more specific about what you'd like to know?`;
    }

    return new Response(
      JSON.stringify({
        success: true,
        response,
        timestamp: new Date().toISOString(),
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