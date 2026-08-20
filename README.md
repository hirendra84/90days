# 🚀 90-Day Placement Streak

![Dashboard Preview](https://via.placeholder.com/1200x600.png?text=90-Day+Placement+Streak+Dashboard)

An immersive **90-day sprint platform** designed to prepare students for top-tier software engineering placements (MAANG+ / Tier-1 companies). By gamifying the learning process, the platform enforces consistency through structured daily missions spanning the four core pillars of placement preparation.

## ✨ Key Features

- **🗺️ 90-Day Structured Roadmap**: A meticulously planned day-by-day syllabus that dynamically unlocks as the user progresses.
- **📚 4 Pillars of Prep**: Daily missions are categorized into **Logical Reasoning**, **Quantitative Aptitude**, **Verbal Ability**, and **Data Structures & Algorithms (DSA)**.
- **🔥 Gamified Dashboard**: Built-in psychological motivators including "Streaks" and a visually satisfying progression tracker to keep students accountable.
- **📺 Integrated Video Player**: Seamlessly embeds the best YouTube tutorials directly into the learning dashboard using the **YouTube Data API**, eliminating external distractions.
- **🔐 Secure Authentication**: Fast and secure credential-based login powered by NextAuth.js.
- **📊 Real-time Progress Tracking**: Automatically updates user profiles, day counters, and completion states in the cloud database.

## 🛠️ Tech Stack

This platform is built using a modern, scalable web architecture:

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router & Server Actions)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) & [Shadcn UI](https://ui.shadcn.com/)
- **Database**: PostgreSQL (Hosted on [Neon](https://neon.tech/))
- **ORM**: [Prisma](https://www.prisma.io/) 
- **Authentication**: [Auth.js (NextAuth v5)](https://authjs.dev/)
- **External API**: [YouTube Data API v3](https://developers.google.com/youtube/v3)
- **Icons**: [Lucide React](https://lucide.dev/)

## 🚀 Getting Started

Follow these instructions to set up the project locally.

### 1. Clone the repository
```bash
git clone https://github.com/hirendra84/90days.git
cd 90days/platform
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env` file in the root directory and add the following keys:
```env
# Your PostgreSQL Database URL
DATABASE_URL="postgresql://user:password@localhost:5432/dbname"

# NextAuth Secret (Generate using: openssl rand -base64 32)
AUTH_SECRET="your_nextauth_secret"

# YouTube Data API Key (For embedding videos)
YOUTUBE_API_KEY="your_youtube_api_key"
```

### 4. Setup the Database
Push the Prisma schema to your database and generate the Prisma Client:
```bash
npx prisma db push
npx prisma generate
```

### 5. Seed the Database
Populate the 90-day syllabus (360 total topics and YouTube search queries):
```bash
npx tsx prisma/seed.ts
```

### 6. Create a Demo Account (Optional)
Run the script to quickly create a test account:
```bash
npx tsx create_demo_account.ts
```

### 7. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## 📝 License
This project is for educational and portfolio purposes. 
