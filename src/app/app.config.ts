import { importProvidersFrom } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { routes } from './app.routes';

export const appProviders = [
  importProvidersFrom(
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot(routes, { useHash: false })
  )
];
