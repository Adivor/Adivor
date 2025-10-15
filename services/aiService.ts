import { GoogleGenAI } from "@google/genai";
import { Question } from '../types';

let aiInstance: GoogleGenAI | null = null;

function getAiInstance(): GoogleGenAI {
  if (!aiInstance) {
    // Initialize the Gemini client.
    // This will only be called the first time an explanation is requested.
    // Ensure the API_key is set in the environment variables.
    aiInstance = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
  }
  return aiInstance;
}


/**
 * Generates a concise explanation for a given quiz question using the Gemini API.
 * @param question The question object containing text, options, and the correct answer.
 * @returns A promise that resolves to a string with the explanation.
 */
export async function generateExplanation(question: Question): Promise<string> {
  const correctOptionLetter = String.fromCharCode(65 + question.correctAnswer);
  const correctAnswerText = question.options[question.correctAnswer];

  const optionsString = question.options
    .map((opt, index) => `${String.fromCharCode(65 + index)}) ${opt}`)
    .join('\n');

  const prompt = `
    Sei un esperto di radiotecnica e regolamenti per radioamatori. 
    Fornisci una spiegazione chiara e concisa (massimo 4 righe) per la seguente domanda d'esame.
    Spiega perché la risposta corretta è giusta e, se rilevante, perché le altre opzioni principali sono sbagliate.
    Rispondi in italiano.

    Domanda: "${question.text}"
    
    Opzioni:
    ${optionsString}

    Risposta corretta: ${correctOptionLetter}) ${correctAnswerText}

    Spiegazione concisa:
  `;

  try {
    const ai = getAiInstance();
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    
    // Using response.text for direct text output
    const explanation = response.text;

    if (explanation) {
      return explanation.trim();
    } else {
      return 'Non è stato possibile generare una spiegazione.';
    }
  } catch (error) {
    console.error('Errore durante la generazione della spiegazione con Gemini:', error);
    if (error instanceof Error && error.message.includes('API key')) {
        return 'Errore di configurazione: API key mancante o non valida.';
    }
    return 'A causa delle elevate richieste, la funzione di spiegazione è in questo istante limitata.';
  }
}