import { APIResponse } from '../api/api.types';

export interface WebsocketRequestData {
    messageHandler?: (responseData: APIResponse) => void;
}

export interface WebsocketMessage {
    requestID: number;
    type: 'request' | 'response';
    action?: string;
    data: { [key: string]: any };
}
