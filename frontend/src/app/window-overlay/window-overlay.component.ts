import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-window-overlay',
  templateUrl: './window-overlay.component.html',
  styleUrls: ['./window-overlay.component.scss'],
})
export class WindowOverlayComponent {
  @Input() windowTitle: string = 'windowTitle';
  @Input() windowIcon: string = '';
  @Input() closable: boolean = false;
  @Output() close: EventEmitter<any> = new EventEmitter();
}
