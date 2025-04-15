// translation.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment'; // Adjust the path as necessary
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  constructor(private translate: TranslateService) {
    this.translate.setDefaultLang(environment.defaultLanguage);
  }

  // Change la langue de l'application
  setLanguage(lang: string): void {
    if (environment.supportedLanguages.includes(lang)) {
      this.translate.use(lang);
    }
  }

  // Traduction simple
  translateText(key: string): string {
    let translation = '';
    this.translate.get(key).subscribe((res: string) => {
      translation = res;
    });
    return translation;
  }

  // Traduction avec paramètres
  translateTextWithParams(key: string, params: object): string {
    let translation = '';
    this.translate.get(key, params).subscribe((res: string) => {
      translation = res;
    });
    return translation;
  }
}