import { provideZoneChangeDetection } from "@angular/core";
import { bootstrapApplication } from '@angular/platform-browser';
import { registerLocaleData } from '@angular/common';
import localeIt from '@angular/common/locales/it';
import { AppComponent } from './app/app.component';
import { appProviders } from './app/app.config';

registerLocaleData(localeIt);

bootstrapApplication(AppComponent, { providers: [provideZoneChangeDetection(), ...appProviders] })
  .catch(err => console.error(err));
