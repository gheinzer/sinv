import { Directive, Input } from '@angular/core';

@Directive({
  selector: '[keyboardShortcut]',
})
export class KeyboardShortcutDirective {
  @Input() keyboardShortcut: {
    keys: string[];
    handler: () => void;
  }[] = [];

  constructor() {
    window.addEventListener('keydown', (ev) => {
      this.keydownListener(ev);
    });
  }

  private keydownListener(ev: KeyboardEvent) {
    for (let shortcut of this.keyboardShortcut) {
      let keysSatisifed: number = 0;
      for (let key of shortcut.keys) {
        switch (key) {
          case 'alt':
            if (ev.altKey) keysSatisifed++;
            break;
          case 'ctrl':
            if (ev.ctrlKey) keysSatisifed++;
            break;
          case 'shift':
            if (ev.shiftKey) keysSatisifed++;
            break;
          default:
            if (ev.key.toLowerCase() === key.toLowerCase()) keysSatisifed++;
        }

        if (keysSatisifed == shortcut.keys.length) {
          shortcut.handler();
          break;
        }
      }
    }
  }
}
