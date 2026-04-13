import {Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {NavbarComponent} from './components/navbar/navbar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent],
  template: `
    <app-navbar></app-navbar>
    <div class="page-content">
      <router-outlet></router-outlet>
    </div>
    <footer class="app-footer">
      <div class="footer-inner">
        <div class="footer-brand">
          <span class="material-icons footer-logo">fitness_center</span>
          <span class="footer-name">Apice Clinic</span>
        </div>
        <div class="footer-contacts">
          <a href="mailto:prenotazioni@apiceclinic.com" class="footer-link">
            <span class="material-icons" style="font-size:1rem">mail_outline</span>
            prenotazioni@apiceclinic.com
          </a>
          <a href="mailto:informazioni@apiceclinic.com" class="footer-link">
            <span class="material-icons" style="font-size:1rem">mail_outline</span>
            informazioni@apiceclinic.com
          </a>
          <a href="tel:+393480000000" class="footer-link">
            <span class="material-icons" style="font-size:1rem">phone</span>
            +39 348 000 0000
          </a>
        </div>
        <div class="footer-copy">
          © 2026 Apice Clinic — Tutti i diritti riservati
        </div>
      </div>
    </footer>
  `
})
export class AppComponent {}
