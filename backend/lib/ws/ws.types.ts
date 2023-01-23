export interface WebsocketRequestData {
    messageHandler?: (responseData: Object) => void;
}

export interface WebsocketMessage {
    requestID: number;
    type: 'request' | 'response';
    action?: string;
    data: { [key: string]: any };
}
