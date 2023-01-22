import * as ws from 'ws';
import { SINVHTTPD } from '../httpd';
import { SINVAPI } from '../api/api';
import { APIResponse, AuthenticationData } from '../api/api.types';
import {
    WebsocketConversation,
    IncomingWebsocketData,
    OutgoingWebsocketData,
} from './ws.types';

export namespace SINVWebSocket {
    const WSServer = new ws.WebSocket.Server({
        server: SINVHTTPD.serverHTTP,
    });
    const WSSServer = new ws.WebSocket.Server({
        server: SINVHTTPD.serverHTTPS,
    });

    class WebsocketConnection {
        private activeRequests: {
            [key: number]: WebsocketConversation;
        } = {};
        private highestConversationID: number = -1;

        constructor(
            private socket: ws.WebSocket,
            private auth: AuthenticationData = {
                isAuthenticated: false,
            }
        ) {
            this.socket.on('message', this.messageHandler);
        }

        public sendMessageAwaitResponse(): Promise<Object> {
            return new Promise<Object>((resolve, reject) => {
                let messageData: WebsocketConversation = {
                    messageHandler(responseData) {
                        resolve(responseData);
                    },
                };
            });
        }

        private async messageHandler(rawData: ws.RawData, isBinary: boolean) {
            try {
                var JSONData: IncomingWebsocketData = JSON.parse(
                    rawData.toString()
                );
            } catch {
                return;
            }
            if (JSONData.requestID > this.highestConversationID) {
                this.highestConversationID = JSONData.requestID;
            }
            if (!this.activeRequests[JSONData.requestID]) {
                this.activeRequests[JSONData.requestID] = {};
            }

            if (
                JSONData.type == 'request' &&
                JSONData.data &&
                JSONData.action
            ) {
                var apiResponse: APIResponse;
                if (JSONData.action.startsWith('apiHandler/')) {
                    // These are special actions which are handled by the api handler.
                    switch (JSONData.action) {
                        case 'apiHandler/updateAuthenticationData': // This is used on logins or logouts and ensures that the user is properly logged out and doesn't have any permissions anymore.
                            this.auth = JSONData.data.auth;
                            apiResponse = { success: true };
                            break;

                        default:
                            return;
                    }
                } else {
                    apiResponse = await SINVAPI.executeCall(
                        JSONData.action,
                        JSONData.data,
                        this.auth
                    );
                }
                let replyContent: OutgoingWebsocketData = {
                    requestID: JSONData.requestID,
                    data: apiResponse,
                    type: 'response',
                };
                this.socket.send(JSON.stringify(replyContent));
            } else if (JSONData.type == 'response') {
                let conversationData = this.activeRequests[JSONData.requestID];
                if (!conversationData) return; // Invalid conversation IDs are ignored.
                if (!conversationData.messageHandler) return;
                await conversationData.messageHandler(JSONData.data);
            }
            delete this.activeRequests[JSONData.requestID]; // Marks the conversation as closed
        }
    }

    let connections: WebsocketConnection[] = [];

    export function initializeServer() {
        WSServer.on('connection', connectionHandler);
        WSSServer.on('connection', connectionHandler);
    }

    function connectionHandler(socket: ws.WebSocket) {
        connections.push(new WebsocketConnection(socket));
    }
}
