import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

interface ActivityData {
  user_id: string;
  activities: Array<{
    activity_type: string;
    activity_data: any;
    app_id?: string;
  }>;
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

    const { user_id, activities }: ActivityData = await req.json();

    const inferredTasks = [];

    for (const activity of activities) {
      let taskTitle = '';
      let taskDescription = '';
      let urgencyLevel = 'medium';
      let priorityScore = 50;

      switch (activity.activity_type) {
        case 'email_received':
          taskTitle = `Follow up on: ${activity.activity_data.subject || 'Email'}`;
          taskDescription = `Respond to email from ${activity.activity_data.sender || 'sender'}`;
          urgencyLevel = activity.activity_data.urgent ? 'high' : 'medium';
          priorityScore = activity.activity_data.urgent ? 80 : 60;
          break;

        case 'meeting_scheduled':
          taskTitle = `Prepare for: ${activity.activity_data.title || 'Meeting'}`;
          taskDescription = `Meeting scheduled at ${activity.activity_data.time || 'TBD'}`;
          urgencyLevel = 'high';
          priorityScore = 85;
          break;

        case 'document_edited':
          taskTitle = `Complete: ${activity.activity_data.document_name || 'Document'}`;
          taskDescription = `Continue working on document`;
          urgencyLevel = 'medium';
          priorityScore = 70;
          break;

        case 'task_mentioned':
          taskTitle = activity.activity_data.task_name || 'New task';
          taskDescription = activity.activity_data.description || 'Task mentioned in conversation';
          urgencyLevel = activity.activity_data.priority || 'medium';
          priorityScore = 65;
          break;

        default:
          continue;
      }

      const deadline = activity.activity_data.deadline
        ? new Date(activity.activity_data.deadline).toISOString()
        : null;

      inferredTasks.push({
        user_id,
        title: taskTitle,
        description: taskDescription,
        status: 'pending',
        priority_score: priorityScore,
        urgency_level: urgencyLevel,
        deadline,
        completion_percentage: 0,
        is_ai_generated: true,
        source_type: activity.activity_type,
        source_reference: activity.activity_data.id || null,
        app_id: activity.app_id || null,
      });
    }

    if (inferredTasks.length > 0) {
      const { data, error } = await supabase.from('tasks').insert(inferredTasks).select();

      if (error) throw error;

      return new Response(
        JSON.stringify({
          success: true,
          tasks: data,
          count: data.length,
        }),
        {
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        tasks: [],
        count: 0,
        message: 'No tasks inferred from activities',
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