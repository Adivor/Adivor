const INCORRECT_QUESTIONS_KEY = 'incorrectQuestionIds';
const EXPLANATIONS_KEY = 'quizExplanations';

/**
 * Recupera gli ID delle domande errate dalla localStorage.
 * @returns Un array di numeri (ID delle domande).
 */
export const getIncorrectQuestionIds = (): number[] => {
  try {
    const storedIds = localStorage.getItem(INCORRECT_QUESTIONS_KEY);
    if (storedIds) {
      const ids = JSON.parse(storedIds);
      if (Array.isArray(ids) && ids.every(id => typeof id === 'number')) {
        return ids;
      }
    }
  } catch (error) {
    console.error("Errore nel leggere gli ID delle domande errate dalla localStorage:", error);
  }
  return [];
};

/**
 * Salva un array di ID di domande errate nella localStorage.
 * @param ids L'array di ID da salvare.
 */
export const saveIncorrectQuestionIds = (ids: number[]): void => {
  try {
    const uniqueIds = [...new Set(ids)]; // Assicura l'unicità
    localStorage.setItem(INCORRECT_QUESTIONS_KEY, JSON.stringify(uniqueIds));
  } catch (error) {
    console.error("Errore nel salvare gli ID delle domande errate nella localStorage:", error);
  }
};


/**
 * Recupera l'oggetto delle spiegazioni dalla localStorage.
 * @returns Un oggetto Record<number, string> con le spiegazioni salvate.
 */
export const getStoredExplanations = (): Record<number, string> => {
  try {
    const stored = localStorage.getItem(EXPLANATIONS_KEY);
    if (stored) {
      const data = JSON.parse(stored);
      if (typeof data === 'object' && data !== null && !Array.isArray(data)) {
        return data;
      }
    }
  } catch (error) {
    console.error("Errore nel leggere le spiegazioni dalla localStorage:", error);
  }
  return {};
};

/**
 * Salva una nuova spiegazione nella localStorage, aggiungendola a quelle esistenti.
 * @param questionId L'ID della domanda.
 * @param explanation Il testo della spiegazione.
 */
export const saveExplanation = (questionId: number, explanation: string): void => {
  try {
    const allExplanations = getStoredExplanations();
    allExplanations[questionId] = explanation;
    localStorage.setItem(EXPLANATIONS_KEY, JSON.stringify(allExplanations));
  } catch (error) {
    console.error("Errore nel salvare la spiegazione nella localStorage:", error);
  }
};