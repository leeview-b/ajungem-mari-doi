# Ajungem Mari - Portal Voluntari

NGO volunteer management platform built with Next.js, Supabase, and PostgreSQL.

## Features

- 🔐 **Authentication**: Secure signup/login with Supabase Auth
- 📅 **Event Management**: Create and manage visit events to care centers
- 📝 **Visit Reports**: Submit detailed visit reports matching the organization's Google Form
- 💬 **Internal Messaging**: Communicate with team members and receive broadcast messages
- 👥 **Role-Based Access**: Different permissions for volunteers and admins
- 🎨 **Modern UI**: Built with Tailwind CSS for a responsive experience

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL via Supabase
- **Authentication**: Supabase Auth
- **Styling**: Tailwind CSS
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ installed
- A Supabase account and project
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd ajungem-mari-doi
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
   - Copy `.env.example` to `.env.local`
   - Fill in your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Set up the database:
   - Go to your Supabase project SQL Editor
   - Run the migration file: `supabase/migrations/001_initial_schema.sql`
   - This will create all necessary tables, policies, and triggers

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Database Schema

The application uses the following main tables:

- **profiles**: User profiles with volunteer/admin roles
- **events**: Visit events to care centers
- **visit_reports**: Detailed reports of completed visits
- **messages**: Internal messaging system

All tables include Row Level Security (RLS) policies for data protection.

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import the project in Vercel
3. Add environment variables in Vercel project settings
4. Deploy!

The app is configured for Vercel deployment with `vercel.json`.

## Project Structure

```
app/
├── dashboard/           # Protected dashboard pages
│   ├── events/         # Event management
│   ├── reports/        # Visit reports
│   └── messages/       # Messaging system
├── login/              # Login page
├── signup/             # Signup page
└── page.tsx            # Landing page

components/             # Reusable React components
lib/
├── supabase/          # Supabase client configuration
types/                 # TypeScript type definitions
supabase/
└── migrations/        # Database migration files
```

## Features in Detail

### Event Management
- Create events for planned visits
- View upcoming and past events
- Track event details (center, location, date, activity type)

### Visit Reports
- Comprehensive form matching the organization's Google Form
- Fields include:
  - Visit date and duration
  - Center information and location
  - Number of children and their names
  - Activity description
  - Optional testimonials and observations
- View all reports with filtering

### Messaging System
- Admins can send broadcast messages to all volunteers
- Individual messaging capability
- Mark messages as read
- Organized inbox view

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is private and proprietary to Asociația Ajungem Mari.

## Support

For issues or questions, please contact the development team.
