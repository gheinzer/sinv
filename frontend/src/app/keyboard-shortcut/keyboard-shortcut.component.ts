import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-keyboard-shortcut',
  templateUrl: './keyboard-shortcut.component.html',
  styleUrls: ['./keyboard-shortcut.component.scss'],
})
export class KeyboardShortcutComponent {
  public shortcutText: string = '';

  @Input() keys: string[] = [];
  @Input() keyboardIconShown: boolean = true;

  public getEntries = Object.entries;
  public parseInt = parseInt;

  ngOnInit() {
    this.shortcutText = this.keys.join('+');
  }
}
