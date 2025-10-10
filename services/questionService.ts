
import { Question, QuestionCategory } from '../types';
import { TECHNICAL_CATEGORIES, OTHER_CATEGORIES, TECHNICAL_QUESTIONS_COUNT, OTHER_QUESTIONS_COUNT } from '../constants';

// This is a small subset of questions for demonstration. A real app would have hundreds.
const ALL_QUESTIONS: Question[] = [
  // Radiotecnica 1
  { id: 1, category: QuestionCategory.RADIOTECNICA_1, text: "Qual è l'unità di misura della frequenza?", options: ["Hertz (Hz)", "Volt (V)", "Ohm (Ω)", "Watt (W)"], correctAnswer: 0 },
  { id: 2, category: QuestionCategory.RADIOTECNICA_1, text: "Cosa rappresenta la lettera 'I' nella legge di Ohm?", options: ["Tensione", "Resistenza", "Corrente", "Potenza"], correctAnswer: 2 },
  { id: 3, category: QuestionCategory.RADIOTECNICA_1, text: "Un condensatore immagazzina energia in un campo...", options: ["Magnetico", "Elettrico", "Gravitazionale", "Elettromagnetico"], correctAnswer: 1 },
  { id: 4, category: QuestionCategory.RADIOTECNICA_1, text: "Quale componente si oppone al passaggio della corrente continua ma non a quella alternata?", options: ["Resistore", "Induttore", "Condensatore", "Diodo"], correctAnswer: 2 },
  { id: 5, category: QuestionCategory.RADIOTECNICA_1, text: "La lunghezza d'onda è inversamente proporzionale alla...", options: ["Potenza", "Tensione", "Frequenza", "Ampiezza"], correctAnswer: 2 },
  { id: 6, category: QuestionCategory.RADIOTECNICA_1, text: "Come si chiama il fenomeno per cui un'onda radio cambia direzione passando attraverso un mezzo?", options: ["Riflessione", "Rifrazione", "Diffrazione", "Assorbimento"], correctAnswer: 1 },
  { id: 7, category: QuestionCategory.RADIOTECNICA_1, text: "Quale materiale è un buon conduttore?", options: ["Vetro", "Gomma", "Rame", "Plastica"], correctAnswer: 2 },
  { id: 8, category: QuestionCategory.RADIOTECNICA_1, text: "Un trasformatore funziona solo con corrente...", options: ["Continua", "Alternata", "Pulsante", "Mista"], correctAnswer: 1 },
   { id: 9, category: QuestionCategory.RADIOTECNICA_1, text: "Quale strumento si usa per misurare la resistenza?", options: ["Voltmetro", "Amperometro", "Wattmetro", "Ohmetro"], correctAnswer: 3 },
  { id: 10, category: QuestionCategory.RADIOTECNICA_1, text: "La formula V = I * R è nota come...", options: ["Legge di Kirchhoff", "Legge di Ohm", "Teorema di Thevenin", "Legge di Coulomb"], correctAnswer: 1 },
  { id: 11, category: QuestionCategory.RADIOTECNICA_1, text: "Cosa fa un diodo?", options: ["Amplifica il segnale", "Permette alla corrente di fluire in una sola direzione", "Immagazzina carica", "Genera onde radio"], correctAnswer: 1 },
  { id: 12, category: QuestionCategory.RADIOTECNICA_1, text: "L'unità di misura della capacità è il...", options: ["Henry", "Farad", "Siemens", "Weber"], correctAnswer: 1 },
  { id: 13, category: QuestionCategory.RADIOTECNICA_1, text: "Un'antenna a dipolo mezz'onda è risonante quando la sua lunghezza fisica è approssimativamente...", options: ["Un quarto della lunghezza d'onda", "Metà della lunghezza d'onda", "Uguale alla lunghezza d'onda", "Doppia della lunghezza d'onda"], correctAnswer: 1 },
  { id: 14, category: QuestionCategory.RADIOTECNICA_1, text: "Quale dei seguenti non è un componente passivo?", options: ["Resistore", "Condensatore", "Transistor", "Induttore"], correctAnswer: 2 },
  { id: 15, category: QuestionCategory.RADIOTECNICA_1, text: "La reattanza capacitiva diminuisce all'aumentare della...", options: ["Resistenza", "Induttanza", "Frequenza", "Tensione"], correctAnswer: 2 },

  // Radiotecnica 2
  { id: 16, category: QuestionCategory.RADIOTECNICA_2, text: "In un trasmettitore AM, cosa viene modulato?", options: ["La frequenza della portante", "La fase della portante", "L'ampiezza della portante", "La larghezza di banda"], correctAnswer: 2 },
  { id: 17, category: QuestionCategory.RADIOTECNICA_2, text: "Qual è il principale vantaggio della modulazione FM rispetto alla AM?", options: ["Minore larghezza di banda", "Maggiore portata", "Migliore qualità audio e immunità ai disturbi", "Circuiteria più semplice"], correctAnswer: 2 },
  { id: 18, category: QuestionCategory.RADIOTECNICA_2, text: "Cos'è un oscillatore?", options: ["Un circuito che converte DC in AC", "Un circuito che amplifica segnali deboli", "Un filtro passa-basso", "Un misuratore di potenza"], correctAnswer: 0 },
  { id: 19, category: QuestionCategory.RADIOTECNICA_2, text: "Il ROS (Rapporto Onde Stazionarie) ideale è...", options: ["0:1", "1:1", "2:1", "Infinito"], correctAnswer: 1 },
  { id: 20, category: QuestionCategory.RADIOTECNICA_2, text: "Un filtro che lascia passare solo le frequenze al di sopra di una certa soglia è un...", options: ["Filtro passa-basso", "Filtro passa-alto", "Filtro passa-banda", "Filtro elimina-banda"], correctAnswer: 1 },
  { id: 21, category: QuestionCategory.RADIOTECNICA_2, text: "In un ricevitore supereterodina, il mescolatore produce una...", options: ["Frequenza immagine", "Frequenza intermedia", "Frequenza di battimento", "Armonica"], correctAnswer: 1 },
  { id: 22, category: QuestionCategory.RADIOTECNICA_2, text: "La propagazione per 'onda di terra' è più efficace a frequenze...", options: ["Alte (HF)", "Molto alte (VHF)", "Ultra alte (UHF)", "Basse (LF/MF)"], correctAnswer: 3 },
  { id: 23, category: QuestionCategory.RADIOTECNICA_2, text: "La ionosfera è fondamentale per la propagazione a lunga distanza in...", options: ["VHF", "UHF", "HF", "SHF"], correctAnswer: 2 },
   { id: 24, category: QuestionCategory.RADIOTECNICA_2, text: "Quale tipo di modulazione è comunemente usato per le trasmissioni dati digitali come il PSK31?", options: ["Modulazione di ampiezza (AM)", "Modulazione di frequenza (FM)", "Modulazione di fase (PM)", "Modulazione a impulsi"], correctAnswer: 2 },
  { id: 25, category: QuestionCategory.RADIOTECNICA_2, text: "Cos'è la 'banda laterale unica' (SSB)?", options: ["Un tipo di antenna", "Una modulazione AM in cui una banda laterale e la portante sono soppresse", "Una tecnica di filtraggio", "Un modo operativo solo per CW"], correctAnswer: 1 },
  { id: 26, category: QuestionCategory.RADIOTECNICA_2, text: "L'impedenza caratteristica della maggior parte dei cavi coassiali per uso radioamatoriale è:", options: ["300 Ohm", "75 Ohm", "50 Ohm", "600 Ohm"], correctAnswer: 2 },
  { id: 27, category: QuestionCategory.RADIOTECNICA_2, text: "Cosa si intende per 'guadagno' di un'antenna?", options: ["La sua altezza dal suolo", "La sua capacità di concentrare la potenza in una certa direzione", "La sua resistenza alla corrosione", "La sua larghezza di banda"], correctAnswer: 1 },
  { id: 28, category: QuestionCategory.RADIOTECNICA_2, text: "Un'antenna Yagi è un'antenna...", options: ["Omnidirezionale", "Isotropica", "Direttiva", "Verticale"], correctAnswer: 2 },
  { id: 29, category: QuestionCategory.RADIOTECNICA_2, text: "Lo 'skip' o propagazione ionosferica avviene grazie a quale fenomeno?", options: ["Diffrazione", "Rifrazione", "Riflessione", "Assorbimento"], correctAnswer: 2 },
  { id: 30, category: QuestionCategory.RADIOTECNICA_2, text: "Il 'fading' è...", options: ["Un aumento costante del segnale", "Una variazione casuale dell'intensità del segnale ricevuto", "Un tipo di disturbo artificiale", "La frequenza centrale di un segnale"], correctAnswer: 1 },
  
  // Radiotecnica 3
  { id: 31, category: QuestionCategory.RADIOTECNICA_3, text: "Cosa indica l'acronimo 'FET'?", options: ["Frequency Emitter Transistor", "Field-Effect Transistor", "Fast Electron Tube", "Forward Emission Triode"], correctAnswer: 1 },
  { id: 32, category: QuestionCategory.RADIOTECNICA_3, text: "Un circuito integrato è:", options: ["Un insieme di componenti discreti su una basetta", "Un singolo componente con molte funzioni", "Un dispositivo miniaturizzato contenente molti transistor e altri componenti", "Un tipo di valvola termoionica"], correctAnswer: 2 },
  { id: 33, category: QuestionCategory.RADIOTECNICA_3, text: "Qual è la funzione principale di un amplificatore operazionale?", options: ["Oscillare a una frequenza fissa", "Amplificare la differenza tra due tensioni di ingresso", "Rettificare una tensione AC", "Modulare un segnale"], correctAnswer: 1 },
  { id: 34, category: QuestionCategory.RADIOTECNICA_3, text: "La sigla 'CW' sta per:", options: ["Carrier Wave", "Continuous Wave", "Correct Wave", "Complex Wave"], correctAnswer: 1 },
  { id: 35, category: QuestionCategory.RADIOTECNICA_3, text: "In un sistema binario, un 'bit' può assumere...", options: ["10 valori", "8 valori", "2 valori", "16 valori"], correctAnswer: 2 },

  // Codice Q e Abbreviazioni
  { id: 36, category: QuestionCategory.CODICE_Q, text: "Cosa significa 'QSO'?", options: ["Avete un messaggio per me?", "Posso comunicare con...?", "Conversazione/collegamento radio", "Qual è il vostro nominativo?"], correctAnswer: 2 },
  { id: 37, category: QuestionCategory.CODICE_Q, text: "Cosa significa 'QTH'?", options: ["La mia posizione è...", "Il mio nome è...", "Sto trasmettendo a bassa potenza", "Qual è l'ora esatta?"], correctAnswer: 0 },
  { id: 38, category: QuestionCategory.CODICE_Q, text: "Se un radioamatore vi chiede 'QSY?', cosa vuole sapere?", options: ["Se avete interferenze", "Se dovete cambiare frequenza", "Se la vostra potenza è sufficiente", "Se state chiudendo la stazione"], correctAnswer: 1 },
  { id: 39, category: QuestionCategory.CODICE_Q, text: "L'abbreviazione '73' significa:", options: ["Saluti cordiali", "Amore e baci", "Ho ricevuto il messaggio", "Arrivederci"], correctAnswer: 0 },
  { id: 40, category: QuestionCategory.CODICE_Q, text: "Cosa significa 'QRZ'?", options: ["Chi mi sta chiamando?", "Posso ridurre la potenza?", "Siete occupati?", "La mia frequenza è libera?"], correctAnswer: 0 },
   { id: 41, category: QuestionCategory.CODICE_Q, text: "Cosa significa 'QRM'?", options: ["Ho interferenze da altre stazioni (man-made)", "Ho interferenze naturali (statiche)", "Il mio segnale è debole", "Devo interrompere la trasmissione"], correctAnswer: 0 },
  { id: 42, category: QuestionCategory.CODICE_Q, text: "Cosa significa 'QRN'?", options: ["Ho interferenze da altre stazioni (man-made)", "Ho interferenze naturali (statiche)", "La mia trasmissione è disturbata", "Potete aumentare la potenza?"], correctAnswer: 1 },
  { id: 43, category: QuestionCategory.CODICE_Q, text: "Cosa significa 'QRT'?", options: ["Devo aumentare la velocità?", "Cesso le trasmissioni", "Siete pronti?", "Il mio segnale è buono?"], correctAnswer: 1 },
  { id: 44, category: QuestionCategory.CODICE_Q, text: "L'abbreviazione 'OM' si riferisce a:", options: ["Old Man (radioamatore di sesso maschile)", "Onde Medie", "Ohm", "Operatore Mobile"], correctAnswer: 0 },
  { id: 45, category: QuestionCategory.CODICE_Q, text: "Cosa si intende con 'CQ'?", options: ["Chiamata selettiva a una stazione specifica", "Chiamata generale a tutte le stazioni", "Comunicazione di emergenza", "Controllo qualità del segnale"], correctAnswer: 1 },

  // Regolamenti
  { id: 46, category: QuestionCategory.REGOLAMENTI, text: "Qual è l'ente governativo che rilascia le patenti di radioamatore in Italia?", options: ["Ministero della Difesa", "Ministero dello Sviluppo Economico (ora MIMIT)", "Polizia Postale", "Autorità per le Garanzie nelle Comunicazioni (AGCOM)"], correctAnswer: 1 },
  { id: 47, category: QuestionCategory.REGOLAMENTI, text: "È consentito trasmettere musica sulle frequenze radioamatoriali?", options: ["Sì, sempre", "Solo se è musica classica", "No, è vietato", "Sì, ma solo per brevi periodi"], correctAnswer: 2 },
  { id: 48, category: QuestionCategory.REGOLAMENTI, text: "Il nominativo di stazione deve essere trasmesso...", options: ["Solo all'inizio del QSO", "Solo alla fine del QSO", "All'inizio, alla fine e almeno ogni 10 minuti", "Mai, è privato"], correctAnswer: 2 },
  { id: 49, category: QuestionCategory.REGOLAMENTI, text: "Qual è lo scopo principale del servizio di radioamatore?", options: ["Profitto commerciale", "Trasmissione di notiziari", "Autoistruzione, intercomunicazione e studio tecnico", "Diffusione di programmi religiosi"], correctAnswer: 2 },
  { id: 50, category: QuestionCategory.REGOLAMENTI, text: "In caso di emergenza, un radioamatore può...", options: ["Comunicare solo con altre stazioni di radioamatori", "Utilizzare qualsiasi mezzo a sua disposizione per prestare soccorso", "Non fare nulla se non autorizzato", "Chiedere un compenso per l'aiuto"], correctAnswer: 1 },
   { id: 51, category: QuestionCategory.REGOLAMENTI, text: "La patente di operatore di stazione di radioamatore ha una validità di:", options: ["1 anno", "5 anni", "10 anni", "Permanente"], correctAnswer: 2 },
  { id: 52, category: QuestionCategory.REGOLAMENTI, text: "Quale classe di patente radioamatoriale consente l'accesso a tutte le bande?", options: ["Classe A", "Classe B", "Classe speciale", "Non ci sono classi in Italia"], correctAnswer: 0 },
  { id: 53, category: QuestionCategory.REGOLAMENTI, text: "È permesso usare un linguaggio cifrato o codici segreti nelle comunicazioni radioamatoriali?", options: ["Sì, per motivi di privacy", "No, le comunicazioni devono essere in chiaro", "Solo se si comunica con stazioni estere", "Solo in caso di contest"], correctAnswer: 1 },
  { id: 54, category: QuestionCategory.REGOLAMENTI, text: "Il 'log di stazione' è...", options: ["Un accessorio opzionale per la stazione", "Un registro obbligatorio di tutte le comunicazioni effettuate", "Un software per controllare la radio", "Un tipo di antenna"], correctAnswer: 1 },
  { id: 55, category: QuestionCategory.REGOLAMENTI, text: "La potenza massima consentita in HF per un radioamatore di classe A in Italia è generalmente:", options: ["100 Watt", "500 Watt", "1500 Watt", "10 Watt"], correctAnswer: 1 },
];

function shuffleArray<T,>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

export const getQuizQuestions = (): Question[] => {
  const technicalQuestions = ALL_QUESTIONS.filter(q => TECHNICAL_CATEGORIES.includes(q.category));
  const otherQuestions = ALL_QUESTIONS.filter(q => OTHER_CATEGORIES.includes(q.category));

  const shuffledTechnical = shuffleArray(technicalQuestions).slice(0, TECHNICAL_QUESTIONS_COUNT);
  const shuffledOther = shuffleArray(otherQuestions).slice(0, OTHER_QUESTIONS_COUNT);

  const finalQuiz = shuffleArray([...shuffledTechnical, ...shuffledOther]);
  return finalQuiz;
};
