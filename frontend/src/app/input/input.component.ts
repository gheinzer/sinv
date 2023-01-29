import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  Renderer2,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
})
export class InputComponent {
  constructor(public rd: Renderer2) {}

  @Input() icon: string = '';
  @Input() placeholder: string = '';
  @Input() type: 'text' | 'email' | 'password' | 'dropdown' | 'textarea' =
    'text';
  @Input() autofocus: '' | null = null;

  @Input() value: any = '';
  @Input() choices: { [key: string | number]: string } = {};
  @Output() valueChange = new EventEmitter<string>();

  @ViewChild('input') input!: ElementRef;

  ngAfterViewInit() {
    if (this.autofocus == '') {
      this.input.nativeElement.focus();
    }
    if (this.type == 'dropdown' && this.value == '') {
      this.value = Object.entries(this.choices)[0][0];
    }
  }

  public getEntries = Object.entries;
}
