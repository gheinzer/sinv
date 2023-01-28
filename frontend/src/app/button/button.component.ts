import { OnChanges, SimpleChanges } from '@angular/core';
import {
  Component,
  Input,
  EventEmitter,
  Output,
  HostBinding,
} from '@angular/core';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
})
export class ButtonComponent implements OnChanges {
  @Input() icon: string = '';
  @Input() fill: 'background' | 'accent' = 'accent';
  @Input() disabled: boolean = false;
  @Input() loader: boolean = false;
  @Output() click = new EventEmitter<void>();

  @HostBinding('style.pointerEvents') pointerEvents: string = 'initial';

  public ngOnChanges(changes: SimpleChanges): void {
    this.pointerEvents = this.disabled ? 'none' : 'initial';
  }

  public clickHandler(ev: Event) {
    if (!this.disabled) this.click.emit();
  }
}
