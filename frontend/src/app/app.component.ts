import { Component } from '@angular/core';
import { WsModule } from './api/ws/ws.module';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  constructor(private ws: WsModule) {}

  title = 'frontend';
}
