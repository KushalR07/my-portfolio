# Kushal R — Developer Portfolio

A personal portfolio website with an AI-powered chatbot assistant, built with vanilla HTML/CSS/JS and a Vercel serverless backend.

## Features

- Responsive single-page portfolio (About, Experience, Skills, Projects, Contact)
- AI chatbot powered by Groq's LLaMA 3.3 70B model
- Serverless API proxy — API key never exposed to the browser
- Per-IP rate limiting (10 requests/minute)
- Multi-turn conversation memory (last 5 exchanges)
- Scroll reveal animations

## Tech Stack

| Layer    | Technology                        |
|----------|-----------------------------------|
| Frontend | Vanilla HTML, CSS, JavaScript     |
| AI       | Groq API · LLaMA 3.3 70B          |
| Backend  | Vercel Serverless Functions        |
| Fonts    | Google Fonts (DM Serif + DM Sans) |

## Project Structure

```
portfolio/
├── api/
│   └── chat.js        # Serverless API route (Groq proxy)
├── index.html         # Main portfolio page
├── style.css          # Styles
├── script.js          # Chat UI logic & scroll animations
├── .env.local         # Environment variables (not committed)
└── .gitignore
```

## Getting Started

### Prerequisites

- [Vercel CLI](https://vercel.com/docs/cli) — for local development with serverless functions
- A [Groq API key](https://console.groq.com/)

### Local Development

1. Clone the repo:
   ```bash
   git clone https://github.com/KushalR07/portfolio.git
   cd portfolio
   ```

2. Create a `.env.local` file:
   ```
   GROQ_API_KEY=your_groq_api_key_here
   ```

3. Start the dev server:
   ```bash
   vercel dev
   ```

4. Open `http://localhost:3000`

### Deploy to Vercel

```bash
vercel --prod
```

Set `GROQ_API_KEY` in your Vercel project's environment variables dashboard.

## API

`POST /api/chat`

**Request body:**
```json
{
  "message": "What are your skills?",
  "history": []
}
```

**Response:**
```json
{
  "reply": "Kushal specializes in React, Node.js, and AI integrations..."
}
```

**Rate limit:** 10 requests per IP per minute.

## Contact

- Email: kushal.r2912@gmail.com
- GitHub: [KushalR07](https://github.com/KushalR07)
- LinkedIn: [kushal-r-a0b37b227](https://linkedin.com/in/kushal-r-a0b37b227/)
