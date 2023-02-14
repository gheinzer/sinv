import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as WSTypes from '../../../../../backend/lib/ws/ws.types';

import { APIResponse } from '@sinv/backend/lib/api/api.types';
import { LoaderModule } from '../../loader/loader.module';

interface FrontendRequestHandler {
  handler: (data: { [key: string]: any }) => APIResponse;
}

@NgModule({
  declarations: [],
  imports: [CommonModule],
})
export class WsModule {
  private protocol = window.location.protocol == 'https:' ? 'wss' : 'ws';
  private socket!: WebSocket;
  private activeRequests: WSTypes.WebsocketRequestData[] = [];
  private highestRequestID: number = -1;
  private openingHandlers: (() => void)[] = [];
  constructor(private loaderModule: LoaderModule) {
    this.openSocket();
  }

  private openSocket() {
    let websocketURL = `${this.protocol}://${window.location.host}`;
    this.socket = new WebSocket(websocketURL);
    this.loaderModule.addRequirement();
    this.socket.onopen = (ev) => {
      this.initializeSocket(ev);
      this.loaderModule.satisfyRequirement();
    };
    setTimeout(() => {
      if (this.socket.readyState !== this.socket.OPEN) {
        this.openSocket();
        this.loaderModule.satisfyRequirement();
      }
    }, 5000);
  }

  private frontendRequestHandlers: { [key: string]: FrontendRequestHandler } =
    {};

  public addRequestHandler(
    action: string,
    requestHandler: FrontendRequestHandler
  ) {
    this.frontendRequestHandlers[action] = requestHandler;
  }

  private messageHandler = async (message: MessageEvent) => {
    try {
      var JSONData: WSTypes.WebsocketMessage = JSON.parse(
        message.data.toString()
      );
    } catch {
      return;
    }
    if (JSONData.requestID > this.highestRequestID) {
      this.highestRequestID = JSONData.requestID;
    }
    if (!this.activeRequests[JSONData.requestID]) {
      this.activeRequests[JSONData.requestID] = {};
    }
    if (JSONData.type == 'request' && JSONData.data && JSONData.action) {
      if (!this.frontendRequestHandlers[JSONData.action]) return;
      let response = this.frontendRequestHandlers[JSONData.action].handler(
        JSONData.data
      );

      let replyContent: WSTypes.WebsocketMessage = {
        requestID: JSONData.requestID,
        data: response,
        type: 'response',
      };
      this.socket.send(JSON.stringify(replyContent));
    } else if (JSONData.type == 'response') {
      let conversationData = this.activeRequests[JSONData.requestID];
      if (!conversationData) return; // Invalid conversation IDs are ignored.
      if (!conversationData.messageHandler) return;
      //@ts-ignore
      await conversationData.messageHandler(JSONData.data);
    }
    delete this.activeRequests[JSONData.requestID]; // Marks the conversation as closed
  };

  private closeHandler(event: CloseEvent) {
    this.openSocket();
  }

  public async sendMessageAwaitResponse(
    action: string,
    data: { [key: string]: any }
  ) {
    await this.awaitSocketConnection();
    return new Promise<APIResponse>((resolve, reject) => {
      let conversationData: WSTypes.WebsocketRequestData = {
        messageHandler(responseData) {
          resolve(responseData);
        },
      };

      this.highestRequestID++;
      let requestID = this.highestRequestID;
      let messageData: WSTypes.WebsocketMessage = {
        requestID,
        data,
        type: 'request',
        action,
      };
      this.activeRequests[requestID] = conversationData;
      this.socket.send(JSON.stringify(messageData));
    });
  }

  private awaitSocketConnection() {
    if (this.socket.readyState == this.socket.OPEN) return;
    return new Promise<void>((resolve, reject) => {
      this.openingHandlers.push(resolve);
    });
  }

  private async initializeSocket(ev: Event) {
    //@ts-ignore
    this.socket = ev.target;
    this.socket.onmessage = this.messageHandler;
    this.socket.addEventListener('close', (ev) => this.closeHandler(ev));
    for (let handler of this.openingHandlers) {
      handler();
    }
  }
}
