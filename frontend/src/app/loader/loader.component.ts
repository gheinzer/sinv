import { Component, HostBinding, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss'],
})
export class LoaderComponent implements OnInit {
  @Input() color: string | null = null;
  @HostBinding('style.border-top-color') borderTop!: string;
  @HostBinding('style.border-right-color') borderRight!: string;

  ngOnInit() {
    if (this.color !== null) {
      this.borderTop = this.color;
      this.borderRight = this.color;
    }
  }
}
