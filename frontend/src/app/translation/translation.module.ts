import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { translations } from './translations';

@NgModule({
  declarations: [],
  imports: [CommonModule],
})
export class TranslationModule {
  private supportedLanguages = ['de', 'en'];

  private browserLang = 'en';
  private updatedBrowserLanguage: boolean = false;

  private getBrowserLanguage() {
    if (this.updatedBrowserLanguage) return;
    //@ts-ignore
    var lang = navigator.language || navigator.userLanguage;
    lang = lang.split('-')[0];
    lang = lang.toLowerCase();
    if (this.supportedLanguages.includes(lang)) {
      this.browserLang = lang;
    }
    // If the language is not supported, it is not set and remains english.
    this.updatedBrowserLanguage = true;
  }

  public getTranslation(id: string) {
    this.getBrowserLanguage();
    if (translations[id]) {
      //@ts-ignore
      return translations[id][this.browserLang];
    } else {
      throw Error(`Translation with ID ${id} could not be found.`);
    }
  }
}
