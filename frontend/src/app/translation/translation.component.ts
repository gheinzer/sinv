import { Component, Input, OnInit } from '@angular/core';
import { TranslationModule } from './translation.module';

@Component({
  selector: 'translation',
  templateUrl: './translation.component.html',
  styleUrls: ['./translation.component.scss'],
})
export class TranslationComponent implements OnInit {
  constructor(private translationModule: TranslationModule) {}

  @Input() id: string = '';
  public translation: string = '';

  ngOnInit(): void {
    this.translation = this.translationModule.getTranslation(this.id);
  }
}
