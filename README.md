<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Green Curry Hostel - Boutique Management System

Premium solo-traveler booking engine with AI concierge and smart dynamic pricing for Green Curry Hostel in Chiang Mai.

**Production URL**: https://greencurryhostel.click/

## Features

- 🏨 **Room Management**: Multi-room booking system with dynamic pricing
- 🤖 **AI Concierge**: Google Gemini-powered chat assistant for guest inquiries
- 📊 **Admin Dashboard**: Comprehensive booking and guest management
- 💳 **Payment Integration**: Stripe payment processing
- 📧 **Email Notifications**: Automated booking confirmations
- 🎨 **Modern UI**: Responsive design with TailwindCSS

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Backend**: Express.js + Node.js
- **Database**: PostgreSQL
- **AI**: Google Gemini AI
- **Styling**: TailwindCSS
- **Deployment**: Spaceship Hyperlift (Docker)

## Run Locally

**Prerequisites**: Node.js 20+

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set environment variables** (create `.env.local`):
   ```bash
   GEMINI_API_KEY=your_gemini_api_key
   DATABASE_URL=your_postgresql_connection_string
   ```

3. **Run development server**:
   ```bash
   # Frontend (Vite dev server)
   npm run dev

   # Backend (Express server)
   npm run dev:server
   ```

4. **Build for production**:
   ```bash
   npm run build
   npm start
   ```

## Deployment

This application is configured for deployment on **Spaceship Hyperlift**.

📖 **See [DEPLOYMENT.md](./DEPLOYMENT.md) for comprehensive deployment instructions.**

### Quick Deploy

```bash
# Build Docker image
docker build -t greencurryhostel .

# Deploy to Spaceship Hyperlift
spaceship deploy
```

### Environment Variables

Required for production:
- `DATABASE_URL` - PostgreSQL connection string
- `GEMINI_API_KEY` - Google Gemini AI API key
- `PORT` - Server port (auto-set by Spaceship)

## Project Structure

```
├── server/          # Express.js backend
├── pages/           # React page components
├── components/      # Reusable React components
├── utils/           # Utility functions (API, pricing, email)
├── scripts/         # Database setup scripts
├── assets/          # Images and static assets
├── Dockerfile       # Multi-stage Docker build
└── .spaceship.toml  # Spaceship Hyperlift config
```

## AI Studio

View this app in AI Studio: https://ai.studio/apps/drive/1WnKNbaOkA_2fu9uGdOKCp4z-DM7Hj92S

## License

Private - Green Curry Hostel © 2026
