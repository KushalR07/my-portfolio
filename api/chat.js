export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== "POST") return res.status(405).end();

  // CORS headers (so your frontend can call this)
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  const { message, history } = req.body;
  if (!message) return res.status(400).json({ error: "No message provided" });

  // Rate limiting
  const rateLimit = global.rateLimit || (global.rateLimit = new Map());
  const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
  const now = Date.now();
  const requests = (rateLimit.get(ip) || []).filter((t) => now - t < 60000);
  if (requests.length >= 10) {
    return res
      .status(429)
      .json({ error: "Too many requests. Please slow down!" });
  }
  rateLimit.set(ip, [...requests, now]);

  const SYSTEM_PROMPT = `You are a friendly assistant on Kushal R's portfolio website.
  Kushal is a full-stack developer based in Bengaluru, India with 2 years of experience.
  
  KEY FACTS:
  - Name: Kushal R
  - Role: Full Stack Developer & AI Integration Specialist
  - Location: Bengaluru, India
  - Email: kushal.r2912@gmail.com
  - GitHub: github.com/KushalR07
  - LinkedIn: linkedin.com/in/kushal-r-a0b37b227/
  - Education: BE from UVCE Bengaluru (CGPA 8.4)
  
  EXPERIENCE:
  - KIKSAR Technologies, Bengaluru — Software Engineer (Feb 2024 – Dec 2025)
  - Built AI chatbot onboarding platform UI using React
  - Integrated Meta WhatsApp Business API
  - Built SEO-optimized product websites with 30% faster load times
  
  SKILLS:
  - Frontend: React.js, Next.js, TypeScript, Tailwind CSS, HTML/CSS
  - Backend: Node.js, REST APIs, Spring Boot
  - AI: OpenAI API, Claude API, Groq API, LangChain, RAG
  - DevOps: AWS, Docker, Vercel, CI/CD
  - Mobile: React Native, Firebase
  
  PROJECTS:
  1. AI-Powered Portfolio Bot — Groq API + LLaMA + Vercel
  2. E-Commerce Dashboard — React, Node.js, PostgreSQL
  3. Task Management App — React Native, Firebase, TypeScript
  4. Open Source CLI Tool — Python, 2000+ GitHub stars, 40+ countries
  
  BEHAVIOR RULES:
  1. Questions about Kushal → answer using info above
  2. General tech questions → answer helpfully and briefly
  3. Off-topic questions → politely redirect
  4. Never make up facts about Kushal not listed above
  5. Keep responses under 3-4 sentences
  6. Hiring/collaboration questions → direct to kushal.r2912@gmail.com`;

  try {
    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`, // ✅ secure
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            ...(history || []),
            { role: "user", content: message },
          ],
          max_tokens: 300,
        }),
      },
    );

    const data = await response.json();
    if (!response.ok) throw new Error(JSON.stringify(data));
    res.json({ reply: data.choices[0].message.content });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Something went wrong. Please try again!" });
  }
}
