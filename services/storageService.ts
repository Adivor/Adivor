const INCORRECT_QUESTIONS_KEY = 'incorrectQuestionIds';

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
