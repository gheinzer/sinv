import * as ws from 'ws';
import { SINVHTTPD } from './httpd';

export namespace SINVWebSocket {
    const websocketServer = new ws.WebSocket.Server({
        server: SINVHTTPD.server,
    });

    export function initializeServer() {
        websocketServer.on('connection', connectionHandler);
    }

    function connectionHandler(socket: ws.WebSocket) {
        socket.on('message', messageHandler);
    }

    function messageHandler(message: ws.RawData) {}

    export function sendMessage() {
        return new Promise<string>((resolve, reject) => {});
    }
}
