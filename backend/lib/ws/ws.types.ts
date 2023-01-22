export interface WebsocketConversation {
    messageHandler?: (responseData: Object) => void;
}

export interface IncomingWebsocketData {
    requestID: number;
    type: 'request' | 'response';
    action?: string;
    data: { [key: string]: any };
}

export interface OutgoingWebsocketData {
    requestID: number;
    type: 'request' | 'response';
    action?: string;
    data: { [key: string]: any };
}
