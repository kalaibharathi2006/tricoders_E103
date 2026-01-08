import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

interface TaskScoreRequest {
  user_id: string;
  task_id?: string;
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

    const { user_id, task_id }: TaskScoreRequest = await req.json();

    let query = supabase
      .from('tasks')
      .select('*')
      .eq('user_id', user_id)
      .in('status', ['pending', 'in_progress']);

    if (task_id) {
      query = query.eq('id', task_id);
    }

    const { data: tasks, error } = await query;

    if (error) throw error;

    const scoredTasks = tasks.map((task) => {
      let priorityScore = 50;
      let urgencyLevel = 'medium';

      const hasDeadline = !!task.deadline;
      const daysUntilDeadline = hasDeadline
        ? Math.ceil(
            (new Date(task.deadline).getTime() - new Date().getTime()) /
              (1000 * 60 * 60 * 24)
          )
        : null;

      if (daysUntilDeadline !== null) {
        if (daysUntilDeadline < 0) {
          priorityScore = 100;
          urgencyLevel = 'critical';
        } else if (daysUntilDeadline === 0) {
          priorityScore = 95;
          urgencyLevel = 'critical';
        } else if (daysUntilDeadline === 1) {
          priorityScore = 90;
          urgencyLevel = 'high';
        } else if (daysUntilDeadline <= 3) {
          priorityScore = 80;
          urgencyLevel = 'high';
        } else if (daysUntilDeadline <= 7) {
          priorityScore = 70;
          urgencyLevel = 'medium';
        } else {
          priorityScore = 50;
          urgencyLevel = 'low';
        }
      }

      if (task.source_type === 'email' && task.urgency_level === 'high') {
        priorityScore = Math.min(100, priorityScore + 10);
      }

      if (task.source_type === 'meeting') {
        priorityScore = Math.min(100, priorityScore + 15);
      }

      if (task.status === 'in_progress') {
        priorityScore = Math.min(100, priorityScore + 5);
      }

      const explanation = `Priority calculated based on: ${
        hasDeadline ? `deadline in ${daysUntilDeadline} days` : 'no deadline'
      }, source: ${task.source_type || 'unknown'}, current status: ${task.status}`;

      return {
        task_id: task.id,
        priority_score: priorityScore,
        urgency_level: urgencyLevel,
        explanation,
      };
    });

    for (const scored of scoredTasks) {
      await supabase
        .from('tasks')
        .update({
          priority_score: scored.priority_score,
          urgency_level: scored.urgency_level,
          updated_at: new Date().toISOString(),
        })
        .eq('id', scored.task_id);

      await supabase.from('ai_explanations').insert({
        user_id,
        entity_type: 'task',
        entity_id: scored.task_id,
        explanation: scored.explanation,
        factors: {
          priority_score: scored.priority_score,
          urgency_level: scored.urgency_level,
        },
      });
    }

    return new Response(
      JSON.stringify({
        success: true,
        scored_tasks: scoredTasks,
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