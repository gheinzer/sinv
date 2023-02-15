import { SINVAPI } from '../api/api';
import { SINVUserSystem } from './users';

SINVAPI.addAction('auth/login', {
    needsAuthentication: false,
    needsPermissions: [],
    requiresDataFields: ['username', 'password'],
    actionHandler: async (data) => {
        let user = new SINVUserSystem.User({ username: data.username });
        if (await user.checkPassword(data.password)) {
            let sessionID = await user.createSession();
            return { success: true, data: { sessionID } };
        } else {
            return { success: false, error: 'wrong_password' };
        }
    },
});

SINVAPI.addAction('auth/userExists', {
    needsAuthentication: false,
    needsPermissions: [],
    requiresDataFields: ['username'],
    actionHandler: async (data) => {
        return {
            success: true,
            data: {
                userExists: await SINVUserSystem.userExists(data.username),
            },
        };
    },
});
SINVAPI.addAction('auth/validateSession', {
    needsAuthentication: false,
    needsPermissions: [],
    requiresDataFields: ['sessionID'],
    actionHandler: async (data) => {
        return {
            success: true,
            data: {
                isValid: await SINVUserSystem.validateSession(data.sessionID),
            },
        };
    },
});
SINVAPI.addAction('auth/getUsername', {
    needsAuthentication: true,
    needsPermissions: [],
    requiresDataFields: [],
    actionHandler: async (data, auth) => {
        let user = new SINVUserSystem.User(auth);
        await user.awaitInitialization();
        return {
            success: true,
            data: {
                username: user.username,
            },
        };
    },
});
SINVAPI.addAction('auth/logout', {
    needsAuthentication: true,
    needsPermissions: [],
    requiresDataFields: [],
    actionHandler: async (data, auth) => {
        //@ts-ignore
        await SINVUserSystem.destroySession(auth.sessionID);
        return { success: true };
    },
});
SINVAPI.addAction('auth/hasPermission', {
    needsAuthentication: true,
    needsPermissions: [],
    requiresDataFields: ['permissionName'],
    actionHandler: async (data, auth) => {
        let user = new SINVUserSystem.User(auth);
        return {
            success: true,
            data: {
                hasPermission: await user.hasPermission(data.permissionName),
            },
        };
    },
});
SINVAPI.addAction('auth/getUsers', {
    needsAuthentication: true,
    needsPermissions: [],
    requiresDataFields: [],
    actionHandler: async (data, auth) => {
        let user = new SINVUserSystem.User(auth);
        if (
            (await user.hasPermission('repositoryAdmin')) ||
            (await user.hasPermission('userAdmin'))
        ) {
            return {
                success: true,
                data: {
                    users: await SINVUserSystem.getAllUsers(),
                },
            };
        }
        return {
            success: false,
            error: 'insufficient_permissions',
        };
    },
});
