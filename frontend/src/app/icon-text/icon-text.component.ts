import { Component, Input } from '@angular/core';

@Component({
  selector: 'icon-text',
  template: `
    <app-icon [id]="icon"></app-icon>
    <span><ng-content></ng-content></span>
  `,
  styles: [
    `
      @import 'src/globals.scss';

      :host {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 1ch;
        app-icon {
          fill: $root-color;
          height: 1.25em;
          display: block;
        }
      }
    `,
  ],
})
export class IconTextComponent {
  @Input() icon: string = 'username';
}
