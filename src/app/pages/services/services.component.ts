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
  standalone: true,
  imports: [CommonModule, UpperCasePipe],
  templateUrl: './services.component.html'
})
export class ServicesComponent {
  categories: ServiceCategory[] = [
    {
      key: 'clinico',    label: 'Area Clinica',    color: '#112D4E', bgColor: '#DBE2EF', open: true,
      services: [
        { icon: 'medical_services',  name: 'Visita Nutrizionistica', duration: '60 min',
          description: 'Prima visita con anamnesi completa, valutazione dello stato nutrizionale e definizione degli obiettivi personalizzati.' },
        { icon: 'event_available',   name: 'Visita di Controllo', duration: '30 min',
          description: 'Monitoraggio dell\'andamento del piano nutrizionale o di allenamento, con revisione dei parametri e aggiustamenti del piano.' },
        { icon: 'directions_run',    name: 'Visita Medico-Sportiva', duration: '45 min',
          description: 'Valutazione medica per idoneità sportiva agonistica e non agonistica, incluso ECG e test da sforzo.' },
        { icon: 'assignment',        name: 'Referto Clinico', duration: '20 min',
          description: 'Stesura e rilascio di referti medici con diagnosi, indicazioni terapeutiche e prescrizioni nutrizionali.' },
      ]
    },
    {
      key: 'nutrizione', label: 'Area Nutrizione', color: '#112D4E', bgColor: '#DBE2EF', open: true,
      services: [
        { icon: 'restaurant_menu',   name: 'Piano Nutrizionale Personalizzato', duration: '45 min',
          description: 'Elaborazione di un piano alimentare settimanale calibrato su obiettivi, abitudini e parametri biochimici del paziente.' },
        { icon: 'accessibility_new', name: 'Analisi Composizione Corporea (BIA)', duration: '20 min',
          description: 'Misurazione di massa grassa, massa magra, acqua corporea totale e metabolismo basale tramite bioimpedenziometria.' },
        { icon: 'colorize',          name: 'Monitoraggio Glicemia (Pungidito)', duration: '10 min',
          description: 'Misurazione della glicemia capillare in diversi contesti (digiuno, post-pasto) con classificazione automatica e registro storico.' },
        { icon: 'directions_bike',   name: 'Consulenza Nutrizionale Sportiva', duration: '45 min',
          description: 'Piano di alimentazione specifico per atleti: gestione dei macronutrienti, timing dei pasti e supplementazione.' },
        { icon: 'menu_book',         name: 'Ricettario Fit Personalizzato',
          description: 'Selezione di ricette salutari in linea con il piano nutrizionale, con indicazione di calorie e macronutrienti.' },
      ]
    },
    {
      key: 'sport', label: 'Area Sport', color: '#112D4E', bgColor: '#DBE2EF', open: true,
      services: [
        { icon: 'fitness_center',    name: 'Scheda di Allenamento Personalizzata', duration: '45 min',
          description: 'Programma di allenamento su misura per obiettivi (dimagrimento, ipertrofia, resistenza) e livello di fitness.' },
        { icon: 'self_improvement',  name: 'Personal Training', duration: '60 min',
          description: 'Sedute di allenamento individuale con il preparatore atletico, con correzione della tecnica e progressione dei carichi.' },
        { icon: 'healing',           name: 'Riatletizzazione e Recupero Funzionale', duration: '60 min',
          description: 'Programma di rientro all\'attività sportiva dopo infortunio, con esercizi di rinforzo muscolare e recupero della mobilità.' },
        { icon: 'emoji_events',      name: 'Preparazione Atletica Agonistica',
          description: 'Pianificazione periodizzata per atleti in preparazione a competizioni: forza, velocità, resistenza e picco di forma.' },
      ]
    }
  ];

  toggle(cat: ServiceCategory): void {
    cat.open = !cat.open;
  }
}
