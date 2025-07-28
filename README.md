# SAT Test Prep - Next.js 15

A modern, adaptive SAT test preparation application built with Next.js 15, featuring personalized learning paths and real-time progress tracking.

## ✨ Features

- 📊 **Adaptive Learning** - Questions adjust to your skill level automatically
- 📈 **Progress Tracking** - Real-time analytics and performance insights
- 📚 **Comprehensive Content** - Math, Reading, and Writing questions
- 🎯 **Personalized Dashboard** - Track your strengths and weaknesses
- 📱 **Responsive Design** - Works seamlessly on all devices
- 🗄️ **Database Integration** - Real-time data persistence with Supabase

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **State Management**: Zustand
- **Icons**: Lucide React
- **Development**: ESLint, PostCSS

## 🚀 Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or yarn
- Supabase account (free at [supabase.com](https://supabase.com))

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd sat_test_nextjs
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```

4. **Set up Supabase Database**
   - Sign up at [supabase.com](https://supabase.com)
   - Create a new project
   - Run the migration from `supabase/migrations/001_initial_schema.sql`
   - Add seed data from `supabase/seed.sql`
   - Update `.env.local`:
     ```
     NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
     NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
     ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── app/                 # Next.js 15 App Router
│   ├── globals.css     # Global styles
│   ├── layout.tsx      # Root layout
│   └── page.tsx        # Main page
├── components/
│   ├── Dashboard/      # Dashboard components
│   ├── Layout/         # Layout components
│   ├── Onboarding/     # Diagnostic assessment
│   ├── Progress/       # Progress visualization
│   ├── Question/       # Question interface
│   ├── Reading/        # Reading comprehension
│   └── Vocabulary/     # Vocabulary drills
├── lib/
│   └── store.ts        # Zustand store
└── types/
    └── index.ts        # TypeScript definitions
```

## Key Components

### State Management
- **Zustand Store**: Manages user data, progress, and application state
- **Computed Values**: Automatic calculation of weakest/strongest concepts
- **Persistence**: Client-side state management with reactive updates

### Adaptive Learning
- **Mastery Levels**: 0-100 scale for each concept
- **Weakness Focus**: Prioritizes concepts below 60% mastery
- **Progress Tracking**: Tracks correct answers, attempts, and review needs

### Interactive Features
- **Question Interface**: Multiple choice with explanations
- **Reading Comprehension**: Click-to-mark vocabulary words
- **Vocabulary Drills**: Spaced repetition-style practice
- **Progress Visualization**: Visual progress tracking with trends

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Customization

The application uses mock data for demonstration. To integrate with a real backend:

1. Replace mock data in `src/app/page.tsx`
2. Implement API calls in appropriate components
3. Add authentication and user management (not currently included)
4. Integrate with a database for persistence

## License

This project is for educational purposes.

---

## What the Screenshot Shows

Supabase is warning you that several tables (like `users`, `questions`, `user_progress`, etc.) are **public but do not have Row Level Security (RLS) enabled**. This is a security risk and can also cause issues with your app’s ability to read/write data, especially if you’re using Supabase client libraries from the browser or a non-admin context.

---

## What You Need To Do

### 1. **Enable Row Level Security (RLS) on Your Tables**

For each table listed, you need to:
- Go to the Supabase dashboard
- Navigate to the table (e.g., `users`, `questions`, etc.)
- Enable RLS (Row Level Security)

### 2. **Add RLS Policies**

After enabling RLS, you must add policies that allow your app to read/write data as needed. For development, you can add a simple policy like:

```sql
-- Allow all access (for development only!)
CREATE POLICY "Allow all" ON public.users
  FOR ALL
  USING (true);
```

**Repeat this for each table** you need your app to access.

---

## Why This Matters

- **Without RLS enabled**, Supabase will block most client-side operations for security reasons.
- **If you’re running locally**, your app can still connect to Supabase, but if RLS is not set up, you’ll get errors like “permission denied” or “no rows returned.”

---

## Next Steps

1. **Enable RLS** for each table in the Supabase dashboard.
2. **Add at least one policy** per table (for development, `USING (true)` is fine, but for production, you’ll want more restrictive rules).
3. **Test your app again**—it should now be able to read/write data.

---

If you want, I can give you the exact SQL to copy-paste for each table, or walk you through setting up more secure policies. Just let me know!

## Start Your Development Server

### Option 1: In your terminal (if you have it open)
```bash
npm run dev
```

### Option 2: If you need to open a new terminal
1. Open Terminal/Command Prompt
2. Navigate to your project folder:
   ```bash
   cd /Users/vipabc/Documents/project/sat_test_nextjs
   ```
3. Start the server:
   ```bash
   npm run dev
   ```

### What to expect:
- You should see output like "ready - started server on 0.0.0.0:3000"
- The terminal will show compilation status
- Once it says "ready", you can go to `http://localhost:3000` in your browser

### If you get errors:
Let me know what error messages you see in the terminal, and I'll help you fix them.

Once the server is running, you should be able to see your SAT prep app with the new Projects page we created!