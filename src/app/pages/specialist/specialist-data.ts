export interface SpecialistServiceItem {
  icon: string;
  title: string;
  description: string;
}

interface RoleServiceEntry {
  roleMatcher: RegExp;
  services: SpecialistServiceItem[];
}

// Frontend-defined service lists grouped by specialist role.
// Role values from the API can be English enums (SPORT_DOCTOR, NUTRITIONIST, …)
// or Italian strings (Medico dello Sport, Biologa Nutrizionista, …).
const ROLE_SERVICE_MAPS: RoleServiceEntry[] = [
  {
    roleMatcher: /medico|sport_doctor/i,
    services: [
      { icon: 'assignment', title: 'Visita di Idoneità Sportiva', description: 'Certificazione medica per attività sportive agonistiche e non agonistiche, con ECG e spirometria.' },
      { icon: 'healing', title: 'Trattamento Infortuni Sportivi', description: "Diagnosi e trattamento di distorsioni, contratture, tendinopatie e altri infortuni legati all'attività fisica." },
      { icon: 'speed', title: 'Test da Sforzo', description: 'Valutazione della capacità cardiorespiratoria tramite test ergometrici per definire le zone di allenamento ottimali.' },
      { icon: 'shield', title: 'Prevenzione Infortuni', description: 'Programmi preventivi personalizzati per ridurre il rischio di infortuni nello sport e nel lavoro fisico.' },
      { icon: 'medical_services', title: 'Terapia Infiltrativa', description: 'Infiltrazioni di acido ialuronico, PRP e corticosteroidi per il trattamento di patologie articolari e tendinee.' },
      { icon: 'trending_up', title: 'Ottimizzazione della Performance', description: 'Consulenza medica per atleti agonisti volta a massimizzare le prestazioni nel rispetto della salute.' },
    ],
  },
  {
    roleMatcher: /nutri|dietol/i,
    services: [
      { icon: 'restaurant_menu', title: 'Piano Alimentare Personalizzato', description: 'Elaborazione di piani nutrizionali su misura basati su analisi della composizione corporea e obiettivi specifici.' },
      { icon: 'monitor_weight', title: 'Analisi Composizione Corporea (BIA)', description: 'Misurazione di massa grassa, massa magra, acqua corporea totale e metabolismo basale tramite bioimpedenziometria.' },
      { icon: 'favorite', title: 'Nutrizione Clinica', description: 'Supporto nutrizionale per patologie metaboliche come diabete, ipertensione, dislipidemia e intolleranze alimentari.' },
      { icon: 'bolt', title: 'Nutrizione Sportiva e Performance', description: 'Piani alimentari specifici per atleti: gestione del timing dei nutrienti, recupero e supplementazione mirata.' },
      { icon: 'water_drop', title: "Gestione dell'Idratazione", description: 'Strategie per mantenere un corretto equilibrio idrico prima, durante e dopo l\'attività fisica.' },
      { icon: 'groups', title: 'Educazione Alimentare', description: 'Percorsi di consapevolezza alimentare per individui e famiglie, con focus sulla corretta lettura delle etichette.' },
      { icon: 'refresh', title: 'Follow-up e Monitoraggio', description: 'Visite di controllo periodiche per adattare il piano nutrizionale all\'evoluzione del paziente.' },
    ],
  },
  {
    roleMatcher: /trainer|fitness|personal/i,
    services: [
      { icon: 'fitness_center', title: 'Personal Training', description: 'Sessioni individuali di allenamento personalizzate in base agli obiettivi, al livello di fitness e alle condizioni fisiche del cliente.' },
      { icon: 'directions_run', title: 'Allenamento Funzionale', description: 'Programmi basati su movimenti naturali per migliorare forza, equilibrio, coordinazione e resistenza nella vita quotidiana.' },
      { icon: 'sports', title: 'Preparazione Atletica', description: 'Piani di allenamento specifici per atleti amatoriali e agonisti, con periodizzazione e peak performance.' },
      { icon: 'self_improvement', title: 'Programma Dimagrimento', description: 'Training ad alta intensità (HIIT) e circuiti mirati per la riduzione del grasso corporeo e il miglioramento della composizione corporea.' },
      { icon: 'accessibility_new', title: 'Tonificazione Muscolare', description: "Schede di allenamento progressive per la definizione e l'aumento della massa muscolare magra." },
      { icon: 'psychology', title: 'Coaching Motivazionale', description: 'Supporto psicologico e motivazionale per mantenere la costanza nel percorso di allenamento e superare i momenti di stallo.' },
    ],
  },
  {
    roleMatcher: /fisioterapi|physio/i,
    services: [
      { icon: 'back_hand', title: 'Fisioterapia Muscoloscheletrica', description: 'Trattamento di patologie muscolo-scheletriche: dolori articolari, tendinopatie, lombalgie e cervicalgie attraverso tecniche fisioterapiche mirate.' },
      { icon: 'airline_seat_flat', title: 'Riabilitazione Post-Chirurgica', description: 'Percorsi riabilitativi personalizzati dopo interventi ortopedici per recuperare la funzionalità e tornare alla vita quotidiana.' },
      { icon: 'accessibility_new', title: 'Terapia Manuale', description: 'Tecniche specifiche di mobilizzazione articolare e manipolazione per ridurre il dolore e migliorare la mobilità.' },
      { icon: 'sports_handball', title: 'Fisioterapia Sportiva', description: "Valutazione e trattamento degli infortuni sportivi, con programmi di recupero per tornare all'attività fisica in sicurezza." },
      { icon: 'self_improvement', title: 'Rieducazione Posturale', description: 'Programmi personalizzati per la correzione di squilibri posturali, scoliosi e paramorfismi attraverso esercizi specifici.' },
      { icon: 'psychology', title: 'Fisioterapia Neurologica', description: 'Trattamento fisioterapico per patologie neurologiche come ictus, sclerosi multipla e Parkinson per migliorare la funzionalità motoria.' },
    ],
  },
];

export function getServicesByRole(role: string): SpecialistServiceItem[] {
  return ROLE_SERVICE_MAPS.find(entry => entry.roleMatcher.test(role))?.services ?? [];
}
