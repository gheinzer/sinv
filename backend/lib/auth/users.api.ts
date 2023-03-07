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
        let user = new SINVUserSystem.User({ sessionID: auth.sessionID });
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
        let user = new SINVUserSystem.User({ sessionID: auth.sessionID });
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
        let user = new SINVUserSystem.User({ sessionID: auth.sessionID });
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
SINVAPI.addAction('auth/createUser', {
    needsAuthentication: true,
    needsPermissions: ['userAdmin'],
    requiresDataFields: ['username'],
    actionHandler: async (data, auth) => {
        let user = await SINVUserSystem.createUser(data.username, '', true);
        let passwordResetRequestID = await user.createPasswordResetRequest();
        return { success: true, data: { passwordResetRequestID } };
    },
});

SINVAPI.addAction('auth/requestPasswordResetForOtherUser', {
    needsAuthentication: true,
    needsPermissions: ['userAdmin'],
    requiresDataFields: ['userID'],
    actionHandler: async (data, auth) => {
        let user: SINVUserSystem.User = new SINVUserSystem.User({
            userID: data.userID,
        });
        return {
            success: true,
            data: {
                passwordResetRequestID: await user.createPasswordResetRequest(),
            },
        };
    },
});
SINVAPI.addAction('auth/updatePermissions', {
    needsAuthentication: true,
    needsPermissions: ['userAdmin'],
    requiresDataFields: ['userID', 'permissionString'],
    actionHandler: async (data, auth) => {
        let user = new SINVUserSystem.User({ userID: data.userID });
        await user.updatePermissions(data.permissionString);
        return {
            success: true,
        };
    },
});
SINVAPI.addAction('auth/deleteUser', {
    needsAuthentication: true,
    needsPermissions: ['userAdmin'],
    requiresDataFields: ['userID'],
    actionHandler: async (data, auth) => {
        let user = new SINVUserSystem.User({ userID: data.userID });
        await user.delete();
        return { success: true };
    },
});
