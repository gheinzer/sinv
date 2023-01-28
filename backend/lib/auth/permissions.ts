import _ from 'lodash';
import { permissionObject, permission } from './permissions.types';
export namespace SINVPermissions {
    export const defaultPermissions: permissionObject = {
        login: true,
        superuser: false,
    };

    /**
     * Takes a permission string and defauls the undefined values to the defaults.
     * @param {string} permissionString The permission string to process.
     * @returns {SINVPermissions.permissionObject} A permission object.
     */
    export function permissionStringToObject(
        permissionString: string
    ): permissionObject {
        var userPermissions = JSON.parse(permissionString);
        return _.defaultsDeep(userPermissions, defaultPermissions);
    }

    /**
     * Simpliefies the permission object and converts it in to a permission string (JSON).
     * @param {SINVPermissions.permissionObject} object The input object to convert to a string.
     * @returns {string} The permission string.
     */
    export function permissionObjectToString(object: permissionObject): string {
        let simplifiedPermissionObject = simplifyPermissionObject(object);
        return JSON.stringify(simplifiedPermissionObject);
    }

    /**
     * This removes all the keys from the permission object that are the default.
     * @param {SINVPermissions.permissionObject} object The input object, unsimplified, with all keys.
     * @returns {SINVPermissions.permissionObject} The simplified permission object.
     *
     * @private
     */
    function simplifyPermissionObject(
        object: permissionObject
    ): permissionObject {
        let key: permission;
        //@ts-ignore
        for (key of _.keys(object)) {
            if (object[key] == defaultPermissions[key]) {
                delete object[key];
            }
        }
        return object;
    }

    /**
     * Determines if a permission in a specific permission object is given. This also considers the `superuser` and `login` permissions, which have an effect on all the other permissions.
     *
     * @export
     * @param {permissionObject} object
     * @param {permission} permission
     * @returns {boolean}
     */
    export function hasPermission(
        object: permissionObject,
        permission: permission
    ) {
        if (object.superuser) return true;
        else if (!object.login) return false;
        else return object[permission];
    }
}
