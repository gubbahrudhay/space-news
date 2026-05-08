# Space and News Dashboard

A production-ready React + Vite dashboard application that provides live ISS tracking, news updates, and an AI-powered chatbot assistant. Built with a modern, responsive, glassmorphism UI, featuring dark mode support and interactive charts.

## Features

1. **ISS Live Tracking**
   - Real-time location fetched every 15 seconds
   - Interactive Leaflet.js map with custom markers and trajectory polyline
   - Speed calculation using the Haversine formula
   - Displays nearest terrestrial location and current astronauts in space

2. **News Dashboard**
   - Fetches latest news across multiple categories (Technology, Space, Science)
   - Features search and sorting (by date and source)
   - Caches data in `localStorage` to minimize API calls
   - Displays a professional feed with fallback images and error handling

3. **AI Chatbot**
   - Integrates with Mistral 7B via OpenRouter
   - Context-aware responses based strictly on dashboard data
   - Typing indicators and persistent chat history
   - Beautiful floating action button (FAB) interface

4. **Data Visualization**
   - Real-time ISS speed trend line chart using Recharts
   - News distribution pie chart highlighting category spread

5. **Premium UI/UX**
   - Clean, modern layout using Tailwind CSS
   - Light and Dark theme toggling with `localStorage` persistence
   - Toast notifications for system updates and errors
   - Fully responsive design from mobile to desktop

## Tech Stack

- **Framework**: React 19 + Vite
- **Styling**: Tailwind CSS
- **Maps**: Leaflet + React-Leaflet
- **Charts**: Recharts
- **Networking**: Axios
- **Notifications**: React Hot Toast
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- API Keys for NewsAPI (EventRegistry) and OpenRouter (for Chatbot)

### Installation

1. Clone the repository and navigate into the project directory:
   \`\`\`bash
   cd space-news-dashboard
   \`\`\`

2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

3. Configure Environment Variables:
   - Copy `.env.example` to `.env`
   - Fill in your API keys:
     \`\`\`env
     VITE_NEWS_API_KEY=your_news_api_key_here
     VITE_OPENROUTER_API_KEY=your_openrouter_api_key_here
     \`\`\`

4. Start the development server:
   \`\`\`bash
   npm run dev
   \`\`\`

### Building for Production

\`\`\`bash
npm run build
npm run preview
\`\`\`

## Architecture & State Management

- **Custom Hooks**: Features dedicated hooks (`useISS.js`, `useNews.js`, `useTheme.js`) to encapsulate complex state logic and API polling.
- **Component Design**: Highly modular structure with separate domains for Dashboard, Map, Charts, and Chatbot.
- **Caching**: Local storage is leveraged for persisting theme preferences, chat history, and news caching to limit redundant network traffic.
- **Error Handling**: Graceful degradation strategies including fallback mock data for news when the API key is missing or quotas are exceeded, and loading state skeletons across the UI.
