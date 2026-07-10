import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini SDK with User-Agent for telemetry
let ai: GoogleGenAI | null = null;
try {
  const apiKey = process.env.GEMINI_API_KEY;
  if (apiKey) {
    ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  } else {
    console.warn('GEMINI_API_KEY environment variable is not set. AI Features will be disabled.');
  }
} catch (error) {
  console.error('Failed to initialize GoogleGenAI client:', error);
}

// 1. API: Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// 2. API: AWS Study Assistant Query
app.post('/api/ai-assistant', async (req, res) => {
  const { prompt, history = [] } = req.body;

  if (!ai) {
    return res.status(500).json({
      error: 'AI Assistant is temporarily unavailable. Please configure GEMINI_API_KEY inside Settings > Secrets.',
    });
  }

  try {
    const systemInstruction = `You are a friendly, highly certified AWS Academy Cloud Practitioner (CLF-C02) tutor.
Your goal is to explain complex AWS cloud concepts, services, and architectures in an easy-to-understand, encouraging, plain-language way.
For any service or concept discussed:
1. Provide a plain-language, clear explanation.
2. Provide a creative everyday analogy (e.g., S3 is like a locker, EBS is like a flash drive, IAM is like a security guard).
3. Provide a real-world AWS practical use case.
Keep your answer clear, structured, and visually engaging using Markdown bullets and bold highlights. Avoid long unformatted blocks of text.`;

    const contents = [];

    // Map history to correct parts structure
    for (const msg of history) {
      if (msg.role && msg.text) {
        contents.push({
          role: msg.role === 'user' ? 'user' : 'model',
          parts: [{ text: msg.text }],
        });
      }
    }

    // Append current prompt
    contents.push({
      role: 'user',
      parts: [{ text: prompt }],
    });

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.error('Gemini API Error:', error);
    res.status(500).json({ error: error?.message || 'An error occurred while contacting the AI model.' });
  }
});

// 3. API: Generate custom follow-up quiz questions based on an AWS topic
app.post('/api/ai-assistant/quiz', async (req, res) => {
  const { concept } = req.body;

  if (!ai) {
    return res.status(500).json({
      error: 'AI Assistant is temporarily unavailable. Please configure GEMINI_API_KEY inside Settings > Secrets.',
    });
  }

  try {
    const prompt = `Generate exactly 3 multiple-choice practice quiz questions testing the AWS concept: "${concept}".
Each question should be realistic, testing knowledge level appropriate for AWS Certified Cloud Practitioner CLF-C02.
Make sure options are plausible but contain only one correct option.
Include a detailed explanation for why the correct option is right and others are incorrect.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
      config: {
        systemInstruction: 'You are an AWS Exam Writer. Generate highly realistic multiple-choice questions on specified topics in JSON format.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: 'ARRAY',
          description: 'A list of 3 multiple choice questions',
          items: {
            type: 'OBJECT',
            properties: {
              question: {
                type: 'STRING',
                description: 'The multiple-choice question question text.',
              },
              options: {
                type: 'ARRAY',
                items: { type: 'STRING' },
                description: 'Four plausible options, exactly one correct.',
              },
              correctAnswerIndex: {
                type: 'INTEGER',
                description: 'The 0-based index of the correct answer inside the options array (0, 1, 2, or 3).',
              },
              explanation: {
                type: 'STRING',
                description: 'A friendly and educational explanation of why this is the correct answer.',
              },
            },
            required: ['question', 'options', 'correctAnswerIndex', 'explanation'],
          },
        },
      },
    });

    const quizData = JSON.parse(response.text || '[]');
    res.json({ questions: quizData });
  } catch (error: any) {
    console.error('Gemini Quiz Generation Error:', error);
    res.status(500).json({ error: error?.message || 'An error occurred while generating quiz questions.' });
  }
});

// Serve frontend assets via Vite in development, and static build files in production
async function setupServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
    console.log('Running in DEVELOPMENT mode with Vite middleware.');
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
    console.log('Running in PRODUCTION mode serving static files.');
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`AWS Foundation Tracker running at http://localhost:${PORT}`);
  });
}

setupServer().catch((err) => {
  console.error('Failed to start server:', err);
});
