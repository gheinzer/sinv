import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as WSTypes from '../../../../../backend/lib/ws/ws.types';

interface FrontendRequestHandler {
  handler: (data: { [key: string]: any }) => WSTypes.WebsocketMessage;
}

@NgModule({
  declarations: [],
  imports: [CommonModule],
})
export class WsModule {
  private protocol = window.location.protocol == 'https:' ? 'wss' : 'ws';
  private socket: WebSocket;

  constructor() {
    let websocketURL = `${this.protocol}://${window.location.host}`;
    this.socket = new WebSocket(websocketURL);
    this.socket.onopen = this.initializeSocket;
  }

  private frontendRequestHandlers: { [key: string]: FrontendRequestHandler } =
    {};

  public addRequestHandler(
    action: string,
    requestHandler: FrontendRequestHandler
  ) {
    this.frontendRequestHandlers[action] = requestHandler;
  }

  private messageHandler(message: MessageEvent) {
    console.log(message);
  }

  private closeHandler(event: CloseEvent) {}

  private initializeSocket(ev: Event) {
    //@ts-ignore
    this.socket = ev.target;
    this.socket.onmessage = this.messageHandler;
    this.socket.onclose = this.closeHandler;
    let testData: WSTypes.WebsocketMessage = {
      requestID: 0,
      action: 'helloWorld',
      data: {},
      type: 'request',
    };
    console.log('ok');
    this.socket.send(JSON.stringify(testData));
    console.log(this.socket);
  }
}
