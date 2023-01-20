import * as ws from 'ws';
import { SINVHTTPD } from './httpd';
import { SINVAPI } from './api';

export namespace SINVWebSocket {
    const websocketServer = new ws.WebSocket.Server({
        server: SINVHTTPD.server,
    });

    interface WebsocketConversation {
        messageHandler?: (responseData: Object) => void;
    }

    interface IncomingWebsocketData {
        conversationID: number;
        type: 'request' | 'response';
        action?: string;
        data: { [key: string]: any };
    }

    interface WebsocketReponse {
        conversationID: number;
        type: 'request' | 'response';
        action?: string;
        data: { [key: string]: any };
    }

    class WebsocketConnection {
        private activeConversations: { [key: number]: WebsocketConversation } =
            {};
        private highestConversationID: number = -1;

        constructor(
            private socket: ws.WebSocket,
            private auth: SINVAPI.AuthenticationData = {
                isAuthenticated: false,
            }
        ) {
            this.socket.on('message', this.messageHandler);
        }

        public sendMessageAwaitResponse(): Promise<Object> {
            return new Promise<Object>((resolve, reject) => {
                let messageData: WebsocketConversation = {
                    messageHandler(responseData) {},
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
            if (JSONData.conversationID > this.highestConversationID) {
                this.highestConversationID = JSONData.conversationID;
            }
            if (!this.activeConversations[JSONData.conversationID]) {
                this.activeConversations[JSONData.conversationID] = {};
            }

            if (
                JSONData.type == 'request' &&
                JSONData.data &&
                JSONData.action
            ) {
                var apiResponse: SINVAPI.APIResponse;
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
                let replyContent: WebsocketReponse = {
                    conversationID: JSONData.conversationID,
                    data: apiResponse,
                    type: 'response',
                };
                this.socket.send(JSON.stringify(replyContent));
                delete this.activeConversations[JSONData.conversationID]; // Marks the conversation as closed
            } else if (JSONData.type == 'response') {
            }
        }
    }

    let connections: WebsocketConnection[] = [];

    export function initializeServer() {
        websocketServer.on('connection', connectionHandler);
    }

    function connectionHandler(socket: ws.WebSocket) {
        connections.push(new WebsocketConnection(socket));
    }
}
