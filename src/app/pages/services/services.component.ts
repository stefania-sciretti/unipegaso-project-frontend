import {Component} from '@angular/core';
import {CommonModule, UpperCasePipe} from '@angular/common';

interface ServiceItem {
  icon: string;  // Material Icon name
  name: string;
  description: string;
  duration?: string;
}

interface ServiceCategory {
  key: string;
  label: string;
  color: string;
  bgColor: string;
  services: ServiceItem[];
  open: boolean;
}

@Component({
    selector: 'app-services',
    imports: [CommonModule, UpperCasePipe],
    templateUrl: './services.component.html'
})
export class ServicesComponent {
  categories: ServiceCategory[] = [
    {
      key: 'clinico', label: 'Area Clinica — Dott. Sandro Scrigoni (Medico dello Sport)',
      color: '#112D4E', bgColor: '#DBE2EF', open: true,
      services: [
        { icon: 'assignment', name: 'Visita di Idoneità Sportiva', duration: '45 min',
          description: 'Certificazione medica per attività sportive agonistiche e non agonistiche, con ECG e spirometria.' },
        { icon: 'healing', name: 'Trattamento Infortuni Sportivi', duration: '45 min',
          description: 'Diagnosi e trattamento di distorsioni, contratture, tendinopatie e altri infortuni legati all\'attività fisica.' },
        { icon: 'speed', name: 'Test da Sforzo', duration: '30 min',
          description: 'Valutazione della capacità cardiorespiratoria tramite test ergometrici per definire le zone di allenamento ottimali.' },
        { icon: 'shield', name: 'Prevenzione Infortuni',
          description: 'Programmi preventivi personalizzati per ridurre il rischio di infortuni nello sport e nel lavoro fisico.' },
        { icon: 'medical_services', name: 'Terapia Infiltrativa', duration: '30 min',
          description: 'Infiltrazioni di acido ialuronico, PRP e corticosteroidi per il trattamento di patologie articolari e tendinee.' },
        { icon: 'trending_up', name: 'Ottimizzazione della Performance',
          description: 'Consulenza medica per atleti agonisti volta a massimizzare le prestazioni nel rispetto della salute.' },
      ]
    },
    {
      key: 'nutrizione', label: 'Area Nutrizione — Dott.ssa Simona Ruberti & Dott.ssa Cristiana Maratti',
      color: '#112D4E', bgColor: '#DBE2EF', open: true,
      services: [
        { icon: 'restaurant_menu', name: 'Piano Alimentare Personalizzato', duration: '60 min',
          description: 'Elaborazione di piani nutrizionali su misura basati su analisi della composizione corporea e obiettivi specifici.' },
        { icon: 'monitor_weight', name: 'Analisi Composizione Corporea (BIA)', duration: '20 min',
          description: 'Misurazione di massa grassa, massa magra, acqua corporea totale e metabolismo basale tramite bioimpedenziometria.' },
        { icon: 'favorite', name: 'Nutrizione Clinica', duration: '45 min',
          description: 'Supporto nutrizionale per patologie metaboliche come diabete, ipertensione, dislipidemia e intolleranze alimentari.' },
        { icon: 'bolt', name: 'Nutrizione Sportiva e Performance', duration: '45 min',
          description: 'Piani alimentari specifici per atleti: gestione del timing dei nutrienti, recupero e supplementazione mirata.' },
        { icon: 'water_drop', name: 'Gestione dell\'Idratazione',
          description: 'Strategie per mantenere un corretto equilibrio idrico prima, durante e dopo l\'attività fisica.' },
        { icon: 'groups', name: 'Educazione Alimentare',
          description: 'Percorsi di consapevolezza alimentare per individui e famiglie, con focus sulla corretta lettura delle etichette.' },
        { icon: 'refresh', name: 'Follow-up e Monitoraggio', duration: '30 min',
          description: 'Visite di controllo periodiche per adattare il piano nutrizionale all\'evoluzione del paziente.' },
      ]
    },
    {
      key: 'sport', label: 'Area Sport — Dott. Luca Siretta (Personal Trainer ISSA)',
      color: '#112D4E', bgColor: '#DBE2EF', open: true,
      services: [
        { icon: 'fitness_center', name: 'Personal Training', duration: '60 min',
          description: 'Sessioni individuali di allenamento personalizzate in base agli obiettivi, al livello di fitness e alle condizioni fisiche del cliente.' },
        { icon: 'directions_run', name: 'Allenamento Funzionale', duration: '60 min',
          description: 'Programmi basati su movimenti naturali per migliorare forza, equilibrio, coordinazione e resistenza nella vita quotidiana.' },
        { icon: 'sports', name: 'Preparazione Atletica', duration: '60 min',
          description: 'Piani di allenamento specifici per atleti amatoriali e agonisti, con periodizzazione e peak performance.' },
        { icon: 'self_improvement', name: 'Programma Dimagrimento', duration: '60 min',
          description: 'Training ad alta intensità (HIIT) e circuiti mirati per la riduzione del grasso corporeo e il miglioramento della composizione corporea.' },
        { icon: 'accessibility_new', name: 'Tonificazione Muscolare', duration: '60 min',
          description: 'Schede di allenamento progressive per la definizione e l\'aumento della massa muscolare magra.' },
        { icon: 'psychology', name: 'Coaching Motivazionale',
          description: 'Supporto psicologico e motivazionale per mantenere la costanza nel percorso di allenamento e superare i momenti di stallo.' },
      ]
    },
    {
      key: 'osteopatia', label: 'Area Osteopatia — Dott. Mihai Lavretti (Osteopata)',
      color: '#112D4E', bgColor: '#DBE2EF', open: true,
      services: [
        { icon: 'back_hand', name: 'Manipolazione Osteopatica', duration: '60 min',
          description: 'Trattamenti manuali per correggere le restrizioni di mobilità articolare e tissutale e ripristinare la funzione ottimale.' },
        { icon: 'airline_seat_flat', name: 'Trattamento del Mal di Schiena', duration: '60 min',
          description: 'Approccio osteopatico per lombalgia, cervicalgia, ernie discali e tensioni muscolari croniche.' },
        { icon: 'pregnant_woman', name: 'Osteopatia in Gravidanza', duration: '60 min',
          description: 'Trattamenti delicati e sicuri per alleviare i dolori tipici della gravidanza e preparare il corpo al parto.' },
        { icon: 'child_care', name: 'Osteopatia Pediatrica', duration: '45 min',
          description: 'Trattamenti specifici per neonati e bambini per risolvere le tensioni legate al parto e favorire uno sviluppo armonioso.' },
        { icon: 'sports_handball', name: 'Osteopatia Sportiva', duration: '60 min',
          description: 'Prevenzione e recupero degli infortuni sportivi, miglioramento della mobilità e ottimizzazione della performance.' },
        { icon: 'sentiment_very_satisfied', name: 'Trattamento Cefalee ed Emicranie', duration: '60 min',
          description: 'Terapia manuale osteopatica per la riduzione della frequenza e dell\'intensità di cefalee tensionali ed emicranie.' },
      ]
    }
  ];

  toggle(cat: ServiceCategory): void {
    cat.open = !cat.open;
  }
}
