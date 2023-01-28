import { permission } from '../auth/permissions.types';
export interface APIAction {
    needsAuthentication: boolean;
    needsPermissions: permission[];
    actionHandler: (
        data: { [key: string]: any },
        authenticationData: AuthenticationData
    ) => APIResponse | Promise<APIResponse>;
    requiresDataFields: string[];
}

export interface APIResponse {
    success: boolean;
    data?: any;
    error?: string;
}

export interface AuthenticationData {
    isAuthenticated: boolean;
    sessionID?: string;
}
