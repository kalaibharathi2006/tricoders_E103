# TriCoders - Personal Productivity Intelligence Platform

A comprehensive AI-powered productivity platform that helps users manage their work across multiple applications, understand priorities, and maintain healthy work patterns.

## Features

### Core Functionality

#### 1. Unified Work Dashboard
- **Single View**: Consolidates information from emails, messages, documents, calendar events, and tasks
- **App Integration**: Connect and manage multiple productivity apps from one place
- **Real-time Updates**: Live updates of tasks and priorities

#### 2. AI-Powered Task Management
- **Automatic Task Inference**: AI automatically identifies tasks from user activities
- **Smart Prioritization**: Tasks are prioritized based on deadlines, urgency, and context
- **Progress Tracking**: Visual progress indicators for all tasks
- **AI Explanations**: Transparent reasoning for priority scores and recommendations

#### 3. Intelligent Notifications
- **Type 1 (Important)**: Full-screen alerts for critical items with detailed information
- **Type 2 (Reminder)**: Compact corner notifications for routine updates
- **Smart Scheduling**: Schedule notifications for later with custom date/time picker
- **Action Buttons**: Quick actions (Go To, Schedule, Close) for efficient workflow

#### 4. Work Pattern Analysis
- **Productivity Scoring**: Daily productivity score based on task completion and work patterns
- **Context Switch Detection**: Identifies excessive task switching
- **Overload Indicators**: Early warning signs of burnout or overwork
- **Personalized Insights**: AI-generated suggestions for improving work habits

#### 5. AI Assistant Chatbot
- **Natural Language Queries**: Ask about tasks, priorities, and productivity in plain English
- **Context-Aware Responses**: Uses your actual work data to provide relevant insights
- **Always Available**: Accessible from any screen via floating button
- **Smart Suggestions**: Proactive recommendations based on work patterns

### User Interface

#### Main Dashboard Layout
- **Left Sidebar**: Collapsible to-do list with AI-prioritized tasks
- **Top Navigation**: Home, Workspace switcher, Enrolled apps, History, Search
- **Center Panel**: Productivity metrics, urgent tasks, upcoming deadlines, app panels
- **Right Sidebar**: Quick access to enrolled apps with icons
- **Bottom Bar**: Minimized apps for quick switching
- **Profile Menu**: Settings, support, feedback, and account management

#### App Selection Modal
- **Initial Setup**: Choose apps on first login
- **Customizable**: Add or remove apps anytime
- **More Apps**: Manage custom app integrations
- **Visual Interface**: Icon-based selection with checkboxes

#### Workspace Management
- **Multiple Workspaces**: Separate Personal, Work, and custom workspaces
- **Color Coding**: Visual distinction between workspaces
- **Easy Switching**: Quick workspace switcher in top navigation

## Technical Architecture

### Frontend Stack
- **React 18** with TypeScript
- **Vite** for blazing-fast development
- **Tailwind CSS** for modern, responsive design
- **Lucide React** for beautiful icons

### Backend Infrastructure
- **Supabase** for:
  - PostgreSQL database
  - Authentication and user management
  - Row Level Security (RLS) for data protection
  - Edge Functions for AI processing

### Database Schema
Comprehensive schema with 10+ tables:
- `users_profile`: Extended user information
- `workspaces`: User workspace management
- `available_apps`: Catalog of supported applications
- `user_apps`: User's enrolled applications
- `tasks`: All tasks (AI-generated and manual)
- `activities`: User activity logs for AI analysis
- `notifications`: System alerts and reminders
- `work_habits`: AI-analyzed work patterns
- `feedback`: User feedback and improvements
- `ai_explanations`: Transparent AI reasoning

### AI Edge Functions

#### 1. ai-task-inference
Automatically infers tasks from user activities:
- Email received → Follow-up tasks
- Meeting scheduled → Preparation tasks
- Document edited → Completion tasks
- Mentions in chat → Action items

#### 2. ai-priority-scoring
Calculates priority scores for tasks:
- Considers deadlines and urgency
- Weighs source type (email, meeting, document)
- Factors in current status
- Provides transparent explanations

#### 3. ai-work-analysis
Analyzes daily work patterns:
- Productivity scoring (0-100)
- Context switch detection
- Working hours tracking
- Overload indicators
- Personalized insights and suggestions

#### 4. ai-chatbot
Intelligent conversational assistant:
- Natural language understanding
- Context-aware responses
- Task and productivity queries
- Deadline tracking
- Work pattern insights

## Getting Started

### Prerequisites
- Node.js 18+ installed
- Supabase account (database already configured)

### Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Environment variables are pre-configured in `.env`:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Run the development server:
```bash
npm run dev
```

5. Build for production:
```bash
npm run build
```

### First-Time Setup

1. **Sign Up**: Create an account with email and password
2. **Select Apps**: Choose the apps you want to integrate
3. **Start Working**: The platform will begin learning your patterns

## User Guide

### Initial Setup Flow

1. **Authentication Page**
   - Sign up with email, password, and full name
   - Or log in if you have an account

2. **App Selection Modal**
   - Select apps from the list (Gmail, Drive, Meet, etc.)
   - Click "More Apps" to add custom applications
   - Click OK to continue (Cancel exits)

3. **Dashboard**
   - Sample data is generated automatically
   - Start exploring the features

### Daily Workflow

1. **Check To-Do List**
   - Click the arrow on the left to open prioritized tasks
   - View upcoming events and deadlines
   - See completion percentages

2. **Monitor Productivity**
   - View your productivity score at the top
   - Check pending and urgent task counts
   - Review upcoming deadlines

3. **Manage Notifications**
   - Important notifications appear full-screen
   - Reminders show in the corner
   - Schedule or act on notifications immediately

4. **Use AI Assistant**
   - Click the chatbot button (bottom right)
   - Ask about tasks, priorities, or productivity
   - Get personalized suggestions

5. **Switch Workspaces**
   - Use the workspace dropdown in top navigation
   - Organize tasks by context (Personal, Work)

### Managing Apps

1. **Enroll New Apps**
   - Go to app selection modal
   - Check the apps you want to add

2. **Unenroll Apps**
   - Click the X icon on any app panel
   - Or use the "Enrolled" dropdown to toggle apps

3. **Access Apps**
   - Click app icons in the right sidebar
   - Or use minimized icons in the bottom bar
   - Click the external link icon on app panels

### Profile Management

- **Edit Profile**: Update your full name
- **Settings**: Configure preferences (coming soon)
- **Help**: Access documentation
- **Feedback**: Submit suggestions or report issues
- **Sign Out**: Safely log out

## AI Capabilities

### Task Inference
The AI observes your activities and automatically creates tasks:
- Email received from manager → "Follow up on email"
- Meeting scheduled → "Prepare for meeting"
- Document shared → "Review document"

### Priority Calculation
Tasks are scored 0-100 based on:
- **Deadline proximity**: Closer deadlines = higher priority
- **Source importance**: Meetings > Emails > Documents
- **Current status**: In-progress tasks get a boost
- **Urgency level**: Critical, High, Medium, Low

### Work Pattern Analysis
Daily analysis includes:
- **Completion rate**: Tasks completed vs. created
- **Context switches**: Frequency of task changes
- **Working hours**: Time spent on activities
- **Overload detection**: Multiple indicators combined

### Insights & Suggestions
AI provides actionable recommendations:
- "Try time-blocking to reduce context switches"
- "Consider taking breaks to avoid burnout"
- "Focus on urgent and important tasks first"
- "Keep maintaining your current work rhythm"

## Security & Privacy

### Row Level Security (RLS)
All database tables have RLS enabled:
- Users can only access their own data
- Policies enforce ownership checks
- Authentication required for all operations

### Data Protection
- Passwords hashed with bcrypt
- JWT tokens for session management
- HTTPS for all communications
- No data sharing with third parties

## Development

### Project Structure
```
src/
├── components/          # React components
│   ├── AIChatbot.tsx   # AI assistant interface
│   ├── AppPanel.tsx    # App display cards
│   ├── AppSelectionModal.tsx
│   ├── AuthPage.tsx    # Login/signup
│   ├── Dashboard.tsx   # Main dashboard
│   ├── NotificationPopup.tsx
│   ├── ProfileMenu.tsx
│   ├── TodoSidebar.tsx
│   └── TopNavigation.tsx
├── contexts/
│   └── AuthContext.tsx # Auth state management
├── lib/
│   ├── database.types.ts # TypeScript types
│   └── supabase.ts     # Supabase client
├── App.tsx             # Main app logic
└── main.tsx            # App entry point

supabase/functions/     # Edge Functions
├── ai-task-inference/
├── ai-priority-scoring/
├── ai-work-analysis/
└── ai-chatbot/
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Database Migrations

Migrations are in Supabase and include:
- Complete schema with all tables
- Row Level Security policies
- Indexes for performance
- Sample data for available apps

## Future Enhancements

- **Real App Integrations**: Connect to actual Gmail, Drive, etc. via OAuth
- **Advanced AI Models**: Integration with GPT-4 or other LLMs
- **Mobile App**: Native iOS and Android applications
- **Team Features**: Shared workspaces and collaboration
- **Analytics Dashboard**: Detailed productivity reports
- **Custom Automations**: User-defined workflows
- **Calendar Integration**: Direct calendar sync
- **Email Integration**: Read and respond to emails

## Support

For issues or questions:
1. Check the Help section in the profile menu
2. Submit feedback through the Feedback option
3. Review the documentation

## Credits

Built by **TriCoders** - Personal Productivity Intelligence Platform

## License

This project is part of a demonstration and learning exercise.
