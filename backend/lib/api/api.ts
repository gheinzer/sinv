import { SINVPermissions } from '../auth/permissions';
import { SINVUserSystem } from '../auth/users';
import { APIAction, AuthenticationData, APIResponse } from './api.types';

export namespace SINVAPI {
    const actions: { [key: string]: APIAction } = {};

    /**
     * This executes an api call and returns the api response.
     *
     * @export
     * @param {string} action
     * @param {Object} data
     * @param {AuthenticationData} authenticationData
     * @returns {Promise<APIResponse>}
     */
    export async function executeCall(
        action: string,
        data: { [key: string]: any },
        authenticationData: AuthenticationData
    ): Promise<APIResponse> {
        let actionInfo = actions[action];
        let result: APIResponse;

        if (!actionInfo) return { success: false, error: 'invalid_action' };

        if (
            authenticationData.isAuthenticated && // The isAuthenticated property can also be set on the frontend and the state must be checked.
            actionInfo.needsAuthentication
        ) {
            try {
                let user = new SINVUserSystem.User({
                    sessionID: authenticationData.sessionID,
                });
                for (let permission of actionInfo.needsPermissions) {
                    if (!(await user.hasPermission(permission))) {
                        return {
                            success: false,
                            error: 'unsufficient_permissions_' + permission,
                        };
                    }
                }
            } catch (e) {
                //@ts-ignore
                return { success: false, error: e.message };
            }
        } else if (actionInfo.needsAuthentication) {
            return { success: false, error: 'not_authenticated_when_required' };
        }

        for (let field of actionInfo.requiresDataFields) {
            if (!data[field])
                return {
                    success: false,
                    error: 'required_field_nonexistent_' + field,
                };
        }

        // This is then only executed if none of the above checks have failed.
        try {
            result = await actionInfo.actionHandler(data, authenticationData);
        } catch (e) {
            //@ts-ignore
            return { success: false, error: e.message };
        }
        return result;
    }

    /**
     * Turns an api response into a JSON string.
     *
     * @export
     * @param {APIResponse} apiResponse
     * @returns {string}
     */
    export function stringifyReponse(apiResponse: APIResponse): string {
        return JSON.stringify(apiResponse);
    }

    /**
     * Adds an action to the API which can then be executed by using `executeCall`.
     *
     * @export
     * @param {string} action
     * @param {APIAction} actionData
     */
    export function addAction(action: string, actionData: APIAction) {
        actions[action] = actionData;
    }
}
