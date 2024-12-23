# PulseCommunity

A modern discussion forum for PulseOS built with Next.js 13, Prisma, and TypeScript.

## Features

- 🚀 Modern UI with glass morphism design
- 💬 Nested comments with infinite threading
- 🏷️ Tag system for organizing discussions
- 👤 User profiles with badges
- 🔍 Real-time search
- 📱 Fully responsive design
- 🌙 Dark mode by default

## Tech Stack

- **Framework:** Next.js 13 (App Router)
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Authentication:** NextAuth.js
- **Styling:** Tailwind CSS
- **Deployment:** Vercel

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/yourusername/pulsecommunity.git
cd pulsecommunity
```

2. Install dependencies:
```bash
npm install
```

3. Copy the example env file:
```bash
cp .env.example .env
```

4. Update the environment variables in `.env`

5. Set up the database:
```bash
npx prisma db push
```

6. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the result.

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/pulsecommunity"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-here"

# Image Upload (if using)
UPLOADTHING_SECRET="your-uploadthing-secret"
UPLOADTHING_APP_ID="your-uploadthing-app-id"
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details. 