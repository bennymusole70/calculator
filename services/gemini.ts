import { GoogleGenAI, Type, Schema } from "@google/genai";
import { SolveResult, GraphPoint } from '../types';

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

// Schema for structured math responses
const mathResponseSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    solutionMarkdown: {
      type: Type.STRING,
      description: "Step-by-step solution in Markdown format. Use standard text for math, or LaTeX wrapped in $ signs if absolutely necessary, but prefer readable text.",
    },
    finalAnswer: {
      type: Type.STRING,
      description: "The concise final result.",
    },
    isGraphable: {
      type: Type.BOOLEAN,
      description: "True if the result can be visualized on a 2D X/Y Cartesian plane (e.g., a function, a set of points).",
    },
    graphData: {
      type: Type.ARRAY,
      description: "If isGraphable is true, provide 20-50 sampled (x, y) points to plot the function nicely. Range typically -10 to 10 unless context suggests otherwise.",
      items: {
        type: Type.OBJECT,
        properties: {
          x: { type: Type.NUMBER },
          y: { type: Type.NUMBER },
        },
        required: ["x", "y"],
      },
    },
    bennyComment: {
      type: Type.STRING,
      description: "A short, encouraging, friendly remark from 'Benny Toon', the math mascot. Keep it fun and under 20 words.",
    },
  },
  required: ["solutionMarkdown", "finalAnswer", "isGraphable", "bennyComment"],
};

export const solveMathQuery = async (query: string, historyContext: string = ""): Promise<SolveResult> => {
  try {
    const model = "gemini-2.5-flash";
    const systemInstruction = `You are Benny Toon, a world-class, friendly, and super smart mathematics calculator engine. 
    You help users solve problems in Algebra, Calculus, Trigonometry, Statistics, Geometry, Matrices, and more.
    
    Style Guide:
    - Be precise mathematically.
    - Be friendly and encouraging (you are a cartoon mascot).
    - If the user asks for a graph, generate the data points.
    - For matrices, format them clearly in the markdown.
    - For calculus, explain the steps (derivatives, integrals).
    - If the input is just a simple arithmetic expression (e.g., '2+2'), solve it quickly.
    
    Context from previous turns: ${historyContext}
    `;

    const response = await ai.models.generateContent({
      model,
      contents: query,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: mathResponseSchema,
        temperature: 0.2, // Low temperature for math precision
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from Benny.");

    const result = JSON.parse(text) as SolveResult;
    result.type = 'math';
    return result;

  } catch (error) {
    console.error("Gemini Error:", error);
    return {
      solutionMarkdown: "Oops! My calculator circuits got a bit tangled.",
      finalAnswer: "Error",
      isGraphable: false,
      bennyComment: "Let's try that again, maybe rephrase the problem?",
      type: 'chat'
    };
  }
};
